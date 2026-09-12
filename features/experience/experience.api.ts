import api from "@/lib/api-client";
import type {
  Experience,
  CreateExperienceData,
  UpdateExperienceData,
} from "./experience.types";

/**
 * Helper function to convert Create/Update payloads into multipart FormData
 */
function buildExperienceFormData(
  data: CreateExperienceData | UpdateExperienceData
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "icon" && value instanceof File) {
      formData.append("icon", value);
    } else if (Array.isArray(value)) {
      // Append each array item individually so backend/Zod parses them as an array
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export async function createExperience(
  data: CreateExperienceData
): Promise<Experience> {
  const formData = buildExperienceFormData(data);

  const response = await api.post<Experience>("/experience", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getExperience(): Promise<Experience[]> {
  const response = await api.get<Experience[]>("/experience");
  return response.data;
}

export async function getExperienceById(id: string): Promise<Experience> {
  const response = await api.get<Experience>(`/experience/${id}`);
  return response.data;
}

export async function updateExperience(
  id: string,
  data: UpdateExperienceData
): Promise<Experience> {
  const formData = buildExperienceFormData(data);

  const response = await api.patch<Experience>(`/experience/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteExperience(id: string): Promise<void> {
  await api.delete(`/experience/${id}`);
}