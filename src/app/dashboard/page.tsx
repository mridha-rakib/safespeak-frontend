import DashboardHomeScreen from "@/components/dashboard/dashboard-home-screen";
import type { HomeView } from "@/components/dashboard/dashboard-types";
import {
  type AssistantIncidentCategory,
  isAssistantIncidentCategory,
} from "@/lib/assistant-categories";
import {
  type DashboardCardFlowId,
  isDashboardCardFlowId,
} from "@/lib/dashboard-card-flows";

type DashboardPageSearchParams = {
  view?: string | string[];
  fresh?: string | string[];
  recording?: string | string[];
  voice?: string | string[];
  message?: string | string[];
  prefillMessage?: string | string[];
  reportId?: string | string[];
  category?: string | string[];
  topic?: string | string[];
};

type DashboardPageProps = {
  searchParams?: Promise<DashboardPageSearchParams>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolved = (await searchParams) ?? {};
  const rawView = resolved.view;
  const rawFresh = resolved.fresh;
  const rawRecording = resolved.recording;
  const rawVoice = resolved.voice;
  const rawMessage = resolved.message;
  const rawPrefillMessage = resolved.prefillMessage;
  const rawReportId = resolved.reportId;
  const rawCategory = resolved.category;
  const rawTopic = resolved.topic;
  const view = Array.isArray(rawView) ? rawView[0] : rawView;
  const fresh = Array.isArray(rawFresh) ? rawFresh[0] : rawFresh;
  const recording = Array.isArray(rawRecording)
    ? rawRecording[0]
    : rawRecording;
  const voice = Array.isArray(rawVoice) ? rawVoice[0] : rawVoice;
  const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
  const prefillMessage = Array.isArray(rawPrefillMessage)
    ? rawPrefillMessage[0]
    : rawPrefillMessage;
  const reportId = Array.isArray(rawReportId) ? rawReportId[0] : rawReportId;
  const categoryValue = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory;
  const topicValue = Array.isArray(rawTopic) ? rawTopic[0] : rawTopic;
  const assistantRecording = recording === "1";
  const assistantVoiceMode = voice === "1";
  const assistantStartFresh = fresh === "1";
  const assistantCategory: AssistantIncidentCategory | undefined =
    isAssistantIncidentCategory(categoryValue) ? categoryValue : undefined;
  const assistantTopic: DashboardCardFlowId | undefined = isDashboardCardFlowId(
    topicValue
  )
    ? topicValue
    : undefined;
  let homeView: HomeView = "overview";

  if (view === "microeducation") {
    homeView = "microeducation";
  } else if (view === "resources") {
    homeView = "resources";
  } else if (view === "localintelligence") {
    homeView = "localintelligence";
  } else if (view === "smartdialler") {
    homeView = "smartdialler";
  } else if (view === "safetyplan") {
    homeView = "safetyplan";
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
  } else if (view === "reportsubmissionshare") {
    homeView = "reportsubmissionshare";
  } else if (view === "reportsubmissionsuccess") {
    homeView = "reportsubmissionshare";
  }

  return (
    <DashboardHomeScreen
      homeView={homeView}
      assistantStartFresh={assistantStartFresh}
      assistantRecording={assistantRecording}
      assistantVoiceMode={assistantVoiceMode}
      assistantMessage={message}
      assistantPrefillMessage={prefillMessage}
      reportId={reportId}
      assistantCategory={assistantCategory}
      assistantTopic={assistantTopic}
    />
  );
}
