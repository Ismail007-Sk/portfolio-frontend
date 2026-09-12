// achievement.api.ts

import api from "@/lib/api-client";
import type {
  Achievement,
  CreateAchievementData,
  UpdateAchievementData,
} from "./achievement.types";

/**
 * Serializes achievement input data into FormData.
 * Handles string primitives, numbers, and File objects while skipping undefined/null values.
 */
function createAchievementFormData(
  data: CreateAchievementData | UpdateAchievementData
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Skip empty or unprovided values
    if (value === undefined || value === null) {
      return;
    }

    // Safely check for File type to prevent ts(2358) type checking errors
    if (typeof value === "object" && (value as unknown) instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export async function createAchievement(
  data: CreateAchievementData
): Promise<Achievement> {
  const formData = createAchievementFormData(data);

  const response = await api.post<Achievement>("/achievements", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getAchievements(): Promise<Achievement[]> {
  const response = await api.get<Achievement[]>("/achievements");
  return response.data;
}

export async function getAchievementById(id: string): Promise<Achievement> {
  const response = await api.get<Achievement>(`/achievements/${id}`);
  return response.data;
}

export async function updateAchievement(
  id: string,
  data: UpdateAchievementData
): Promise<Achievement> {
  const formData = createAchievementFormData(data);

  const response = await api.patch<Achievement>(
    `/achievements/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteAchievement(id: string): Promise<void> {
  await api.delete(`/achievements/${id}`);
}