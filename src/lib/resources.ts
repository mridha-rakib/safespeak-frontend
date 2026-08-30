"use client";

import { apiRequest } from "@/lib/api";

export type ResourceStatus = "draft" | "published";

export type ResourceItem = {
  id: string;
  name: string;
  category: string;
  region: string;
  contact: string;
  status: ResourceStatus;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function listPublishedResources(): Promise<ResourceItem[]> {
  const response = await apiRequest<{ resources: ResourceItem[] }>("/resources");

  return response.data.resources;
}
