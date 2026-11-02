import { apiRequest, getAiAgentApiBaseUrl } from "@/lib/api";
import { consentRequirements, ensureConsent } from "@/lib/consent";
import { getSessionAwareAuthHeaders } from "@/lib/frontend-session";

export type VoiceTranscriptionResult = {
  transcript: string;
  language?: string;
  model: string;
  saved: boolean;
};

export type AssistantVoiceSynthesisResult = {
  audioBase64: string;
  mimeType: string;
  model: string;
  voice: string;
  temporary: boolean;
};

async function getTranscriptionAuthHeaders(): Promise<HeadersInit> {
  return getSessionAwareAuthHeaders();
}

function getAudioFileName(blob: Blob): string {
  if (blob.type.includes("mp4")) {
    return "assistant-recording.m4a";
  }

  if (blob.type.includes("wav")) {
    return "assistant-recording.wav";
  }

  return "assistant-recording.webm";
}

export async function transcribeAssistantVoice(
  audioBlob: Blob,
  language?: string
): Promise<VoiceTranscriptionResult> {
  const headers = await getTranscriptionAuthHeaders();

  await ensureConsent(consentRequirements.audioTranscription, headers);

  const formData = new FormData();
  formData.set("audio", audioBlob, getAudioFileName(audioBlob));
  formData.set("saveTranscript", "false");

  if (language) {
    formData.set("language", language);
  }

  const response = await apiRequest<VoiceTranscriptionResult>(
    "/ai/transcribe-audio",
    {
      method: "POST",
      baseUrl: getAiAgentApiBaseUrl(),
      headers,
      body: formData,
    }
  );

  return response.data;
}

export async function synthesizeAssistantVoice(
  text: string,
  language?: string
): Promise<AssistantVoiceSynthesisResult> {
  const headers = await getTranscriptionAuthHeaders();

  await ensureConsent(consentRequirements.aiAssistant, headers);

  const response = await apiRequest<AssistantVoiceSynthesisResult>(
    "/ai/synthesize-speech",
    {
      method: "POST",
      baseUrl: getAiAgentApiBaseUrl(),
      headers,
      body: {
        text,
        language,
      },
    }
  );

  return response.data;
}

export function createAssistantVoiceAudioUrl(
  result: AssistantVoiceSynthesisResult
): string {
  const binary = window.atob(result.audioBase64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return URL.createObjectURL(new Blob([bytes], { type: result.mimeType }));
}
