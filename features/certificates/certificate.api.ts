import api from "@/lib/api-client";
import type {
  Certification,
  CreateCertificationData,
  UpdateCertificationData,
} from "./certificate.types";

/**
 * Converts JS payload objects into standard FormData.
 * Safely appends File objects and primitives while ignoring empty/null values.
 */
function createCertificationFormData(
  data: CreateCertificationData | UpdateCertificationData
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Skip unprovided or null values
    if (value === undefined || value === null) {
      return;
    }

    // Safely append File instances (bypasses ts(2358) type checking error)
    if (typeof value === "object" && (value as unknown) instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export async function createCertification(
  data: CreateCertificationData
): Promise<Certification> {
  const formData = createCertificationFormData(data);

  const response = await api.post<Certification>(
    "/certifications",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function getCertifications(): Promise<Certification[]> {
  const response = await api.get<Certification[]>("/certifications");
  return response.data;
}

export async function getCertificationById(
  id: string
): Promise<Certification> {
  const response = await api.get<Certification>(`/certifications/${id}`);
  return response.data;
}

export async function updateCertification(
  id: string,
  data: UpdateCertificationData
): Promise<Certification> {
  const formData = createCertificationFormData(data);

  const response = await api.patch<Certification>(
    `/certifications/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteCertification(id: string): Promise<void> {
  await api.delete(`/certifications/${id}`);
}