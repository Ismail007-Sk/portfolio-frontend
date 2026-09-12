import api from "@/lib/api-client";
import type {
  Skill,
  CreateSkillData,
  UpdateSkillData,
} from "./skill.types";

function buildSkillFormData(data: CreateSkillData | UpdateSkillData): FormData {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.category !== undefined) formData.append("category", data.category);
  if (data.icon) formData.append("icon", data.icon);
  return formData;
}

export async function createSkill(
  data: CreateSkillData
): Promise<Skill> {
  const formData = buildSkillFormData(data);
  const response = await api.post<Skill>("/skills", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function getSkills(): Promise<Skill[]> {
  const response = await api.get<Skill[]>("/skills");

  return response.data;
}

export async function getSkillById(
  id: string
): Promise<Skill> {
  const response = await api.get<Skill>(`/skills/${id}`);

  return response.data;
}

export async function updateSkill(
  id: string,
  data: UpdateSkillData
): Promise<Skill> {
  const formData = buildSkillFormData(data);
  const response = await api.patch<Skill>(`/skills/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function deleteSkill(
  id: string
): Promise<void> {
  await api.delete(`/skills/${id}`);
}