import { apiRequest, getApiBaseUrl } from "@/lib/api";

export type MicroEducationTone = "blue" | "orange" | "green" | "amber" | "violet" | "teal";
export type MicroEducationChip = "harassment" | "rights" | "safety" | "mentalHealth";
export type MicroEducationIncidentCategory =
  | "domestic_violence"
  | "workplace_bullying"
  | "racism_discrimination"
  | "online_abuse"
  | "scam_fraud"
  | "theft_property"
  | "harassment"
  | "mental_health_distress"
  | "general_support";
export type MicroEducationDuration = "quick" | "deep";
export type MicroEducationFormat = "video" | "interactive" | "guide";
export type MicroEducationCategoryStatus = "draft" | "published";

export type MicroEducationCategory = {
  id: string;
  name: string;
  description?: string;
  backgroundColor: string;
  textColor: string;
  iconName?: string;
  imageUrl?: string;
  status: MicroEducationCategoryStatus;
  sortOrder: number;
  cardCount?: number;
};

export type MicroEducationItem = {
  id: string;
  title: string;
  summary: string;
  readTimeLabel: string;
  tag: string;
  cta: string;
  detailHeading: string;
  detailSummary?: string;
  detailBody: string;
  detailTakeaway: string;
  imageAlt?: string;
  categoryId?: string;
  category?: MicroEducationCategory;
  tone: MicroEducationTone;
  chips: MicroEducationChip[];
  incidentCategories?: MicroEducationIncidentCategory[];
  matchKeywords?: string[];
  duration: MicroEducationDuration;
  format: MicroEducationFormat;
  sortOrder: number;
  views: number;
  imageOriginalFileName?: string;
  imageMimeType?: string;
  imageSizeBytes?: number;
  imagePath?: string;
};

export async function listPublishedMicroEducation(): Promise<MicroEducationItem[]> {
  const response = await apiRequest<{ items: MicroEducationItem[] }>("/microeducation");

  return response.data.items;
}

export async function listPublishedMicroEducationCategories(): Promise<MicroEducationCategory[]> {
  const response = await apiRequest<{ categories: MicroEducationCategory[] }>(
    "/microeducation/categories",
  );

  return response.data.categories;
}

export async function listPublishedMicroEducationByCategory(
  categoryId: string,
): Promise<MicroEducationItem[]> {
  const response = await apiRequest<{ items: MicroEducationItem[] }>(
    `/microeducation/categories/${categoryId}/cards`,
  );

  return response.data.items;
}

export function getMicroEducationImageUrl(item: Pick<MicroEducationItem, "imagePath">): string | undefined {
  if (!item.imagePath) {
    return undefined;
  }

  return /^https?:\/\//i.test(item.imagePath) ? item.imagePath : `${getApiBaseUrl()}${item.imagePath}`;
}
