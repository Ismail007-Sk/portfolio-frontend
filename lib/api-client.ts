import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// --------------------------------------------------
// Types
// --------------------------------------------------

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type WaitingRequest = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

// --------------------------------------------------
// Axios Client
// --------------------------------------------------

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// --------------------------------------------------
// Refresh Token State
// --------------------------------------------------

let isRefreshing = false;

let waitingRequests: WaitingRequest[] = [];

// Resolve/reject all requests waiting for token refresh
const processWaitingRequests = (error: unknown = null): void => {
  waitingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  waitingRequests = [];
};

// --------------------------------------------------
// Response Interceptor
// --------------------------------------------------

API.interceptors.response.use(
  // Successful response
  (response) => response,

  // Error response
  async (error: AxiosError) => {
    const failedRequest = error.config as RetryableRequestConfig | undefined;

    // No request config available
    if (!failedRequest) {
      return Promise.reject(error);
    }

    // Never try to refresh the refresh-token request itself
    if (failedRequest.url === "/refresh") {
      return Promise.reject(error);
    }

    // Only handle 401 once per request
    if (error.response?.status === 401 && !failedRequest._retry) {
      failedRequest._retry = true;

      // Another request is already refreshing the token
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          waitingRequests.push({
            resolve,
            reject,
          });
        }).then(() => API(failedRequest));
      }

      // This request becomes responsible for refreshing
      isRefreshing = true;

      try {
        await API.post("/refresh");

        // Release waiting requests
        processWaitingRequests();

        // Retry original request
        return API(failedRequest);
      } catch (refreshError) {
        // Reject all waiting requests
        processWaitingRequests(refreshError);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normal error
    return Promise.reject(error);
  }
);

export default API;