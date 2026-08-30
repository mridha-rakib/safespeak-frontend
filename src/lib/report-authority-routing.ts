import type { ReportFlowDraft } from "@/lib/report-flow";
import type { ReportDestinationPreview } from "@/lib/reports-client";

export type AuthorityMatch = {
  destinationId: string;
  destinationName: string;
  destinationType: string;
  channel: string;
  jurisdiction: string;
  reason: string;
  confidence: number;
  tags: string[];
  contactEmail?: string;
  contactPhone?: string;
  consentRequired?: boolean;
  supportsAcknowledgement?: boolean;
  deliveryReadiness?: ReportDestinationPreview["deliveryReadiness"];
  missingRequiredInfo: string[];
  expectedNextSteps: string[];
};

const destinationTypeLabels: Record<string, string> = {
  police: "Police",
  anti_discrimination_agency: "Anti-discrimination",
  esafety: "eSafety",
  legal_aid: "Legal aid",
  community_legal_centre: "Community legal",
  education_provider: "Education provider",
  workplace_channel: "Workplace",
  scamwatch: "Scamwatch",
  reportcyber: "ReportCyber",
  community_support_org: "Community support",
  domestic_violence_agency: "Domestic violence",
};

export const formatDestinationType = (value: string): string =>
  destinationTypeLabels[value] ??
  value
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");

export const formatChannel = (value: string): string =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");

const uniqueValues = (values: Array<string | undefined>): string[] =>
  Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value))
    )
  );

const legacyDestinationAliases: Record<
  string,
  { destinationKeys?: string[]; destinationTypes?: string[]; namePatterns?: RegExp[] }
> = {
  "mock-police": {
    destinationKeys: ["nsw-police"],
    destinationTypes: ["police"],
    namePatterns: [/\bpolice\b/i],
  },
  "mock-esafety": {
    destinationKeys: ["esafety-commissioner"],
    destinationTypes: ["esafety"],
    namePatterns: [/\besafety\b/i],
  },
  "mock-anti-discrimination": {
    destinationKeys: ["anti-discrimination-nsw"],
    destinationTypes: ["anti_discrimination_agency"],
    namePatterns: [/\banti-discrimination\b/i, /\bdiscrimination\b/i],
  },
};

export const resolvePreferredDestinationId = (
  destinations: ReportDestinationPreview[],
  preferredDestinationId?: string
): string | undefined => {
  if (!preferredDestinationId) {
    return undefined;
  }

  const exactMatch = destinations.find(
    (destination) =>
      destination.destinationId === preferredDestinationId ||
      destination.destinationKey === preferredDestinationId
  );

  if (exactMatch) {
    return exactMatch.destinationId;
  }

  const alias = legacyDestinationAliases[preferredDestinationId];

  if (!alias) {
    return preferredDestinationId;
  }

  return (
    destinations.find((destination) =>
      alias.destinationKeys?.includes(destination.destinationKey)
    ) ??
    destinations.find((destination) =>
      alias.destinationTypes?.includes(destination.destinationType)
    ) ??
    destinations.find((destination) =>
      alias.namePatterns?.some((pattern) =>
        pattern.test(destination.destinationName)
      )
    )
  )?.destinationId;
};

const stringifyStructuredFields = (fields?: Record<string, unknown>): string =>
  Object.values(fields ?? {})
    .map((value) => {
      if (typeof value === "string") {
        return value;
      }

      if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
      }

      if (Array.isArray(value)) {
        return value.join(" ");
      }

      if (value && typeof value === "object") {
        return Object.values(value as Record<string, unknown>)
          .map((nestedValue) =>
            typeof nestedValue === "string" ? nestedValue : ""
          )
          .join(" ");
      }

      return "";
    })
    .join(" ");

const getIncidentSignalText = (draft: ReportFlowDraft | null): string =>
  [
    draft?.title,
    draft?.summary,
    draft?.incidentType,
    draft?.incidentCategory,
    draft?.topic,
    stringifyStructuredFields(draft?.structuredFields),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const hasAnySignal = (text: string, patterns: RegExp[]): boolean =>
  patterns.some((pattern) => pattern.test(text));

const scoreDestination = (
  destination: ReportDestinationPreview,
  draft: ReportFlowDraft | null,
  preferredDestinationId?: string
): number => {
  const signalText = getIncidentSignalText(draft);
  const destinationType = destination.destinationType;
  const destinationName = destination.destinationName.toLowerCase();
  let score = 66;

  if (destination.destinationId === preferredDestinationId) {
    score += 8;
  }

  if (!destination.missingRequiredInfo.length) {
    score += 6;
  } else {
    score -= Math.min(destination.missingRequiredInfo.length * 4, 14);
  }

  if (destination.supportsAcknowledgement) {
    score += 3;
  }

  if (destination.channel.startsWith("api_")) {
    score += 3;
  }

  const incidentKeys = uniqueValues([
    draft?.incidentType,
    draft?.incidentCategory,
    draft?.topic,
  ]).map((value) => value.toLowerCase());

  if (
    incidentKeys.some((key) =>
      destination.matchedIncidentTypes.some(
        (incidentType) => incidentType.toLowerCase() === key
      )
    )
  ) {
    score += 14;
  }

  if (
    hasAnySignal(signalText, [
      /\bdomestic\b/,
      /\bfamily violence\b/,
      /\bpartner\b/,
      /\bhusband\b/,
      /\bwife\b/,
      /\bthreat/i,
      /\bunsafe\b/,
    ])
  ) {
    if (destinationType === "police") score += 16;
    if (destinationType === "domestic_violence_agency") score += 15;
    if (destinationType === "legal_aid") score += 8;
    if (destinationType === "community_support_org") score += 7;
  }

  if (
    hasAnySignal(signalText, [
      /\bcyber\b/,
      /\bscam\b/,
      /\bfraud\b/,
      /\bonline\b/,
      /\bsocial media\b/,
      /\bimage\b/,
      /\bemail\b/,
      /\baccount\b/,
    ])
  ) {
    if (destinationType === "reportcyber") score += 18;
    if (destinationType === "scamwatch") score += 17;
    if (destinationType === "esafety") score += 15;
    if (destinationType === "police") score += 6;
  }

  if (
    hasAnySignal(signalText, [
      /\bracist\b/,
      /\bracism\b/,
      /\bdiscrimination\b/,
      /\bhate\b/,
      /\bworkplace\b/,
      /\bschool\b/,
    ])
  ) {
    if (destinationType === "anti_discrimination_agency") score += 18;
    if (destinationType === "legal_aid") score += 9;
    if (destinationType === "community_legal_centre") score += 8;
    if (destinationType === "police") score += 7;
  }

  if (
    hasAnySignal(signalText, [
      /\blegal\b/,
      /\bright\b/,
      /\bcourt\b/,
      /\border\b/,
      /\bvisa\b/,
      /\bmigrant\b/,
    ])
  ) {
    if (destinationType === "legal_aid") score += 16;
    if (destinationType === "community_legal_centre") score += 12;
  }

  if (destinationName.includes("police")) score += 3;
  if (destinationName.includes("esafety")) score += 3;
  if (destinationName.includes("legal aid")) score += 3;

  return Math.max(52, Math.min(97, score));
};

const buildDestinationTags = (
  destination: ReportDestinationPreview,
  draft: ReportFlowDraft | null
): string[] =>
  uniqueValues([
    formatDestinationType(destination.destinationType),
    destination.jurisdiction,
    draft?.incidentCategory?.replace(/_/g, " "),
    destination.missingRequiredInfo.length ? "Needs review" : "Ready to share",
    destination.deliveryReadiness?.status === "config_missing"
      ? "Needs setup"
      : destination.deliveryReadiness?.status === "manual_action"
        ? "Manual follow-up"
        : undefined,
  ]).slice(0, 4);

export const toAuthorityMatch = (
  destination: ReportDestinationPreview,
  draft: ReportFlowDraft | null,
  preferredDestinationId?: string
): AuthorityMatch => ({
  destinationId: destination.destinationId,
  destinationName: destination.destinationName,
  destinationType: destination.destinationType,
  channel: destination.channel,
  jurisdiction: destination.jurisdiction,
  reason:
    destination.reason ||
    "Suggested because this admin-managed destination matches the incident context and jurisdiction.",
  confidence: scoreDestination(destination, draft, preferredDestinationId),
  tags: buildDestinationTags(destination, draft),
  contactEmail: destination.contactEmail,
  contactPhone: destination.contactPhone,
  consentRequired: destination.consentRequired,
  supportsAcknowledgement: destination.supportsAcknowledgement,
  deliveryReadiness: destination.deliveryReadiness,
  missingRequiredInfo: destination.missingRequiredInfo,
  expectedNextSteps: destination.expectedNextSteps,
});

export function rankAuthorityMatches(input: {
  destinations: ReportDestinationPreview[];
  draft: ReportFlowDraft | null;
  preferredDestinationId?: string;
}): AuthorityMatch[] {
  const preferredDestinationId = resolvePreferredDestinationId(
    input.destinations,
    input.preferredDestinationId
  );

  return input.destinations
    .map((destination) =>
      toAuthorityMatch(destination, input.draft, preferredDestinationId)
    )
    .sort((a, b) => b.confidence - a.confidence);
}
