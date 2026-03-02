export type DashboardTab = "home" | "explorer" | "notifications" | "settings";

export type HomeView =
  | "overview"
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
  | "reportsubmissiondetailedexplanations"
  | "reportsubmissiondetails"
  | "reportsubmissionevidence"
  | "reportsubmissionreview"
  | "reportsubmissionsuccess";

export type NotificationView = "today" | "past";

export type SettingsView = "overview" | "support" | "privacy";
