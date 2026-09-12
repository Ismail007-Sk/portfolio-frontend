// project.api.ts

import api from "@/lib/api-client";

import type {
  Project,
  ProjectById,
  CreateProjectData,
  UpdateProjectData,
  ProjectImage,
  CreateProjectImageData,
  UpdateProjectImageData,
} from "./project.types";


// =================================
// Project
// =================================

export async function createProject(
  data: CreateProjectData
): Promise<Project> {
  const response = await api.post<{
    success: boolean;
    data: Project;
  }>(
    "/projects",
    data
  );

  return response.data.data;
}

export async function getProjects(
  params?: {
    featured?: boolean;
    status?: Project["status"];
    category?: string;
  }
): Promise<Project[]> {
  const response = await api.get<{
    success: boolean;
    data: Project[];
  }>(
    "/projects",
    { params }
  );

  return response.data.data;
}

export async function getProjectById(
  id: string
): Promise<ProjectById> {
  const response = await api.get<{
    success: boolean;
    data: ProjectById;
  }>(`/projects/${id}`);

  return response.data.data;
}

export async function updateProject(
  id: string,
  data: UpdateProjectData
): Promise<Project> {
  const response = await api.patch<{
    success: boolean;
    data: Project;
  }>(`/projects/${id}`, data);

  return response.data.data;
}

export async function deleteProject(
  id: string
): Promise<void> {
  await api.delete(`/projects/${id}`);
}


// =================================
// Project Images
// =================================

export async function createProjectImage(
  data: CreateProjectImageData
): Promise<ProjectImage> {
  const formData = new FormData();

  formData.append("projectId", data.projectId);
  formData.append("image", data.image);

  if (data.altText !== undefined) {
    formData.append("altText", data.altText);
  }

  if (data.displayOrder !== undefined) {
    formData.append("displayOrder", String(data.displayOrder));
  }

  const response = await api.post<{
    success: boolean;
    data: ProjectImage;
  }>("/projects/images", formData);

  return response.data.data;
}


export async function updateProjectImage(
  id: string,
  data: UpdateProjectImageData
): Promise<ProjectImage> {
  const response = await api.patch<{
    success: boolean;
    data: ProjectImage;
  }>(`/projects/images/${id}`, data);

  return response.data.data;
}


export async function deleteProjectImage(
  id: string
): Promise<void> {
  await api.delete(`/projects/images/${id}`);
}