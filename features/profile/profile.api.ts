import api from "@/lib/api-client";
import type {
  Profile,
  CreateProfileData,
  UpdateProfileData,
} from "./profile.types";

export async function createProfile(
  data: CreateProfileData
): Promise<Profile> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.post<Profile>(
    "/myprofile",
    formData
  );

  return response.data;
}

export async function getProfiles(): Promise<Profile[]> {
  const response = await api.get<Profile[]>("/myprofile");

  return response.data;
}

export async function getProfileById(
  id: string
): Promise<Profile> {
  const response = await api.get<Profile>(
    `/myprofile/${id}`
  );

  return response.data;
}

export async function updateProfile(
  id: string,
  data: UpdateProfileData
): Promise<Profile> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.patch<Profile>(
    `/myprofile/${id}`,
    formData
  );

  return response.data;
}

export async function deleteProfile(
  id: string
): Promise<void> {
  await api.delete(`/myprofile/${id}`);
}