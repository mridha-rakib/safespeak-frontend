import { apiRequest, getApiBaseUrl } from "@/lib/api";

export type MediaAssetItem = {
  id: string;
  title: string;
  subtitle: string;
  bodyText: string;
  category: string;
  status: "draft" | "published" | "archived";
  createdDate?: string;
  expirationDate?: string;
  offlineCachingEnabled: boolean;
  primaryCta?: string;
  secondaryButton?: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  imagePath: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function listPublishedMediaAssets(category?: string): Promise<MediaAssetItem[]> {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  const response = await apiRequest<{ assets: MediaAssetItem[] }>(
    `/media-assets${params.size ? `?${params.toString()}` : ""}`
  );

  return response.data.assets;
}

export function getMediaAssetImageUrl(asset: Pick<MediaAssetItem, "imagePath">): string {
  return `${getApiBaseUrl()}${asset.imagePath}`;
}
