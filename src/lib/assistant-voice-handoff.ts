"use client";

const ASSISTANT_VOICE_HANDOFF_KEY = "safespeak.assistant.voice_handoff";

type StoredAssistantVoiceHandoff = {
  dataUrl: string;
};

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Voice recording could not be prepared."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Voice recording could not be prepared."));
    };

    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, body] = dataUrl.split(",", 2);

  if (!header || !body) {
    throw new Error("Voice recording is invalid.");
  }

  const mimeTypeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeTypeMatch?.[1] ?? "audio/webm";
  const binary = window.atob(body);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

export async function saveAssistantVoiceHandoff(blob: Blob): Promise<void> {
  const dataUrl = await readBlobAsDataUrl(blob);
  const payload: StoredAssistantVoiceHandoff = { dataUrl };
  window.sessionStorage.setItem(
    ASSISTANT_VOICE_HANDOFF_KEY,
    JSON.stringify(payload)
  );
}

export function consumeAssistantVoiceHandoff(): Blob | null {
  const raw = window.sessionStorage.getItem(ASSISTANT_VOICE_HANDOFF_KEY);

  if (!raw) {
    return null;
  }

  window.sessionStorage.removeItem(ASSISTANT_VOICE_HANDOFF_KEY);

  try {
    const parsed = JSON.parse(raw) as StoredAssistantVoiceHandoff;
    return dataUrlToBlob(parsed.dataUrl);
  } catch {
    return null;
  }
}

export function clearAssistantVoiceHandoff(): void {
  window.sessionStorage.removeItem(ASSISTANT_VOICE_HANDOFF_KEY);
}
