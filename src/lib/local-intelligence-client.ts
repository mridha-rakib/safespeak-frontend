"use client";

import { apiRequest } from "@/lib/api";

export type LocalIntelligenceTimeframe = "30d" | "90d" | "12m" | "all";

export type LocalIntelligenceCountCell = {
  count?: number;
  suppressed: boolean;
  label: string;
};

export type LocalIntelligenceArea = LocalIntelligenceCountCell & {
  jurisdiction: string;
  region: string;
};

export type LocalIntelligenceCategory = LocalIntelligenceCountCell & {
  category: string;
};

export type LocalIntelligenceTrend = LocalIntelligenceCountCell & {
  period: string;
};

export type LocalIntelligenceResponse = {
  generatedAt: string;
  timeframe: LocalIntelligenceTimeframe;
  filters: {
    jurisdiction?: string;
    region?: string;
    category?: string;
  };
  summary: {
    reports: LocalIntelligenceCountCell;
    visibleAreaCount: number;
    visibleCategoryCount: number;
    visibleTrendCount: number;
    status: "available" | "insufficient_data";
  };
  areas: LocalIntelligenceArea[];
  categories: LocalIntelligenceCategory[];
  trends: LocalIntelligenceTrend[];
  availableFilters: {
    jurisdictions: string[];
    regions: string[];
    categories: string[];
  };
  privacy: {
    anonymisedOnly: boolean;
    consentedReportsOnly: boolean;
    excludesDeletedWithdrawnAndDraftReports: boolean;
    minimumCellSize: number;
    lowCountLabel: string;
    rawReportsExposed: boolean;
    piiExposed: boolean;
  };
};

type LocalIntelligenceEnvelope = {
  localIntelligence: LocalIntelligenceResponse;
};

export async function getLocalIntelligence(query: {
  timeframe?: LocalIntelligenceTimeframe;
  jurisdiction?: string;
  region?: string;
  category?: string;
} = {}): Promise<LocalIntelligenceResponse> {
  const params = new URLSearchParams();

  if (query.timeframe) {
    params.set("timeframe", query.timeframe);
  }
  if (query.jurisdiction) {
    params.set("jurisdiction", query.jurisdiction);
  }
  if (query.region) {
    params.set("region", query.region);
  }
  if (query.category) {
    params.set("category", query.category);
  }

  const response = await apiRequest<LocalIntelligenceEnvelope>(
    `/analytics/public/local-intelligence${params.size ? `?${params.toString()}` : ""}`
  );

  return response.data.localIntelligence;
}
