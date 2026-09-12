// service.api.ts

import api from "@/lib/api-client";
import type {
  Service,
  CreateServiceData,
  UpdateServiceData,
} from "./service.types";

export async function createService(
  data: CreateServiceData
): Promise<Service> {
  const response = await api.post<Service>(
    "/services",
    data
  );

  return response.data;
}

export async function getServices(): Promise<Service[]> {
  const response = await api.get<Service[]>("/services");

  return response.data;
}

export async function getServiceById(
  id: string
): Promise<Service> {
  const response = await api.get<Service>(
    `/services/${id}`
  );

  return response.data;
}

export async function updateService(
  id: string,
  data: UpdateServiceData
): Promise<Service> {
  const response = await api.patch<Service>(
    `/services/${id}`,
    data
  );

  return response.data;
}

export async function deleteService(
  id: string
): Promise<void> {
  await api.delete(`/services/${id}`);
}