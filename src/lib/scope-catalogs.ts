"use client";

import { apiRequest } from "@/lib/api";

export type ScopeTaxonomyRecord = {
  type: "incident_type" | "support_need" | "language" | "culture";
  key: string;
  label: string;
  description?: string;
  isActive: boolean;
  metadata?: Record<string, unknown>;
};

export type ScopeTaxonomyCatalog = {
  incidentTypes: ScopeTaxonomyRecord[];
  supportNeeds: ScopeTaxonomyRecord[];
  languages: ScopeTaxonomyRecord[];
  cultures: ScopeTaxonomyRecord[];
};

export type PublicCulturalProfileGuidance = {
  key: string;
  name: string;
  communityType: "cultural" | "faith" | "community";
  languages: string[];
  faithPathway?: string;
  responseGuidance: string;
  referralPreferences: string[];
  contentGuidance: string[];
  updatedAt?: string;
};

type ScopeBootstrapResponse = {
  bootstrap: {
    scopeVersion: string;
    jurisdictions: string[];
    languages: Array<{ code: string; label: string; region: string; priority: string }>;
    culturalProfiles: string[];
    faithProfiles: string[];
    communityProfiles: string[];
    culturalProfileGuidance?: PublicCulturalProfileGuidance[];
    consentFlags: string[];
    incidentTypes: string[];
    supportNeeds: string[];
    destinationTypes: string[];
    destinationChannels: string[];
    reportStatuses: string[];
    scamAnalysisTypes: string[];
    microEducationCategories: string[];
    analyticsPolicy: {
      minimumCellSuppression: number;
      requiresDifferentialPrivacyForExternalExports: boolean;
      aggregationLevel: string;
      timeBuckets: string[];
    };
    taxonomies?: ScopeTaxonomyCatalog;
  };
};

export async function getScopeBootstrap() {
  const response = await apiRequest<ScopeBootstrapResponse>("/scope/bootstrap");

  return response.data.bootstrap;
}

export async function getScopeTaxonomyCatalog(): Promise<ScopeTaxonomyCatalog | null> {
  const bootstrap = await getScopeBootstrap();

  return bootstrap.taxonomies ?? null;
}

export async function getPublicCulturalProfileGuidance(): Promise<PublicCulturalProfileGuidance[]> {
  const response = await apiRequest<{ culturalProfiles: PublicCulturalProfileGuidance[] }>(
    "/scope/cultural-profiles"
  );

  return response.data.culturalProfiles;
}
