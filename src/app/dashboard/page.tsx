import DashboardHomeScreen from "@/components/dashboard/dashboard-home-screen";
import type { HomeView } from "@/components/dashboard/dashboard-types";

type DashboardPageSearchParams = {
  view?: string | string[];
  recording?: string | string[];
  message?: string | string[];
  reportId?: string | string[];
};

type DashboardPageProps = {
  searchParams?: Promise<DashboardPageSearchParams>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolved = (await searchParams) ?? {};
  const rawView = resolved.view;
  const rawRecording = resolved.recording;
  const rawMessage = resolved.message;
  const rawReportId = resolved.reportId;
  const view = Array.isArray(rawView) ? rawView[0] : rawView;
  const recording = Array.isArray(rawRecording)
    ? rawRecording[0]
    : rawRecording;
  const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
  const reportId = Array.isArray(rawReportId) ? rawReportId[0] : rawReportId;
  const assistantRecording = recording === "1";
  let homeView: HomeView = "overview";

  if (view === "microeducation") {
    homeView = "microeducation";
  } else if (view === "microcards") {
    homeView = "microcards";
  } else if (view === "microcarddetail") {
    homeView = "microcarddetail";
  } else if (view === "assistantconversation") {
    homeView = "assistantconversation";
  } else if (view === "assistant") {
    homeView = "assistant";
  } else if (view === "scamshieldintake") {
    homeView = "scamshieldintake";
  } else if (view === "scamshieldrisk") {
    homeView = "scamshieldrisk";
  } else if (view === "scamshieldassets") {
    homeView = "scamshieldassets";
  } else if (view === "scamshieldagency") {
    homeView = "scamshieldagency";
  } else if (view === "reportshistory") {
    homeView = "reportshistory";
  } else if (view === "reportoverview") {
    homeView = "reportoverview";
  } else if (view === "reportsubmissionsupport") {
    homeView = "reportsubmissionsupport";
  } else if (view === "reportsubmissionrecommendations") {
    homeView = "reportsubmissionrecommendations";
  } else if (view === "reportsubmissionhistory") {
    homeView = "reportsubmissionhistory";
  } else if (view === "reportsubmissiondetailedexplanations") {
    homeView = "reportsubmissiondetailedexplanations";
  } else if (view === "reportsubmissiondetails") {
    homeView = "reportsubmissiondetails";
  } else if (view === "reportsubmissionevidence") {
    homeView = "reportsubmissionevidence";
  } else if (view === "reportsubmissionreview") {
    homeView = "reportsubmissionreview";
  } else if (view === "reportsubmissionsuccess") {
    homeView = "reportsubmissionsuccess";
  }

  return (
    <DashboardHomeScreen
      homeView={homeView}
      assistantRecording={assistantRecording}
      assistantMessage={message}
      reportId={reportId}
    />
  );
}
