import { apiRequest } from "@/lib/api";

export type LegalContentPageKey = "privacy-policy" | "terms-conditions";

export type LegalDocumentContent = {
  contentHtml: string;
  imageOriginalFileName?: string;
};

export type PublicContentPage<TContent> = {
  key: string;
  content: TContent;
  version: number;
  publishedAt?: string;
  updatedAt?: string;
};

export const DEFAULT_PRIVACY_POLICY_HTML = [
  "<h2>SafeSpeak Privacy Policy</h2>",
  "<p>SafeSpeak collects only the information needed to provide secure reporting, support navigation, consent management, and account services.</p>",
  "<p>You can use SafeSpeak with an account or through supported anonymous sessions. Where anonymous use is available, personal identifying details are optional unless you choose to provide them.</p>",
  "<p>SafeSpeak asks for explicit consent before cloud sync, AI processing, transcription, analytics use, warm referrals, or external agency sharing.</p>",
  "<p>You may request access, export, correction, or deletion of eligible personal information from the privacy controls in your account.</p>",
].join("");

export const DEFAULT_TERMS_CONDITIONS_HTML = [
  "<h2>SafeSpeak Terms of Use</h2>",
  "<p>SafeSpeak provides safety-aware reporting, evidence organization, support navigation, and information-only AI assistance.</p>",
  "<p>If you or someone else is in immediate danger, call 000 or your local emergency number. Use SafeSpeak only when it is safe for you to do so.</p>",
  "<p>You are responsible for reviewing all AI-assisted drafts, summaries, and recommendations before saving or sharing them.</p>",
  "<p>External report submission, warm referral, and agency sharing happen only through supported workflows and required consent.</p>",
].join("");

export function getDefaultLegalDocumentHtml(key: LegalContentPageKey): string {
  return key === "privacy-policy"
    ? DEFAULT_PRIVACY_POLICY_HTML
    : DEFAULT_TERMS_CONDITIONS_HTML;
}

export async function getPublicLegalContentPage(
  key: LegalContentPageKey
): Promise<PublicContentPage<LegalDocumentContent>> {
  const response = await apiRequest<{
    contentPage: PublicContentPage<LegalDocumentContent>;
  }>(`/content-pages/${key}`);

  return response.data.contentPage;
}
