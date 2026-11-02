export type DashboardTab = "home" | "explorer" | "notifications" | "settings";

export type HomeView =
  | "overview"
  | "resources"
  | "localintelligence"
  | "smartdialler"
  | "safetyplan"
  | "microeducation"
  | "microcards"
  | "microcarddetail"
  | "assistantconversation"
  | "assistant"
  | "scamshieldintake"
  | "scamshieldrisk"
  | "scamshieldassets"
  | "scamshieldagency"
  | "reportshistory"
  | "reportoverview"
  | "reportsubmissionsupport"
  | "reportsubmissionrecommendations"
  | "reportsubmissionhistory"
  | "reportsubmissiondetailedexplanations"
  | "reportsubmissiondetails"
  | "reportsubmissionevidence"
  | "reportsubmissionreview"
  | "reportsubmissionshare";

export type NotificationView = "today" | "past";

export type SettingsView = "overview" | "support" | "privacy" | "terms";
