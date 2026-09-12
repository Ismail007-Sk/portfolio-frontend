// service.types.ts

export type ServiceTitle =
  | "fullstack"
  | "frontend"
  | "backend"
  | "aiml"
  | "other";

export type Service = {
  id: string;
  title: ServiceTitle;
  description: string;
  display_order: number;
  services: string[];
  created_at: string;
  updated_at: string;
};

export type CreateServiceData = {
  title: ServiceTitle;
  description: string;
  displayOrder?: number;
  services?: string[];
};

export type UpdateServiceData = Partial<CreateServiceData>;