export type ProjectStatus = "in_progress" | "completed" | "archived";

// =================================
// Project Entities (Database / API Responses)
// =================================

export type Project = {
  id: string;
  title: string;
  problem: string | null;
  solution: string | null;
  full_description: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_demo_url: string | null;
  demo_video_url: string | null;
  project_category: string | null;
  is_featured: boolean;
  display_order: number;
  status: ProjectStatus;
};

// Extended Project type for single-project GET detail views
export type ProjectById = Project & {
  images: ProjectImage[];
};

// Single project image entity
export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
};

// =================================
// Form / Mutation Payloads
// =================================

export type CreateProjectData = {
  title: string;
  problem?: string;
  solution?: string;
  fullDescription?: string;
  techStack?: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  demoVideoUrl?: string;
  projectCategory?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  status?: ProjectStatus;
};

export type UpdateProjectData = Partial<CreateProjectData>;

export type CreateProjectImageData = {
  projectId: string;
  altText?: string;
  displayOrder?: number;
  image: File;
};

export type UpdateProjectImageData = {
  altText?: string;
  displayOrder?: number;
};