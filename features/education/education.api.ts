// education.api.ts

import api from "@/lib/api-client";
import type {
  Education,
  CreateEducationData,
  UpdateEducationData,
} from "./education.types";

export async function createEducation(
  data: CreateEducationData
): Promise<Education> {
  const response = await api.post<Education>(
    "/education",
    data
  );

  return response.data;
}

export async function getEducation(): Promise<Education[]> {
  const response = await api.get<Education[]>(
    "/education"
  );

  return response.data;
}

export async function getEducationById(
  id: string
): Promise<Education> {
  const response = await api.get<Education>(
    `/education/${id}`
  );

  return response.data;
}

export async function updateEducation(
  id: string,
  data: UpdateEducationData
): Promise<Education> {
  const response = await api.patch<Education>(
    `/education/${id}`,
    data
  );

  return response.data;
}

export async function deleteEducation(
  id: string
): Promise<void> {
  await api.delete(`/education/${id}`);
}