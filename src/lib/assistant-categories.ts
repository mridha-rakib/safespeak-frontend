export type AssistantIncidentCategory =
  | "domestic_violence"
  | "racial_abuse"
  | "migrant_challenges"
  | "cyber_scam";

export function isAssistantIncidentCategory(
  value: string | undefined
): value is AssistantIncidentCategory {
  return (
    value === "domestic_violence" ||
    value === "racial_abuse" ||
    value === "migrant_challenges" ||
    value === "cyber_scam"
  );
}

export function getAssistantQuickStartMessage(
  category: AssistantIncidentCategory
): string {
  switch (category) {
    case "domestic_violence":
      return "I need help related to domestic violence and want guidance on what to do next.";
    case "racial_abuse":
      return "I want help reporting racial abuse and understanding the safest next steps.";
    case "migrant_challenges":
      return "I need support with a migrant-related challenge and want guidance I can understand clearly.";
    case "cyber_scam":
      return "I think I may be dealing with a cyber scam and need help assessing it.";
  }
}
