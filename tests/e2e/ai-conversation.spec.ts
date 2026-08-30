import { type Locator, type Page, expect, test } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3130";
const API_ROUTE = "**/api/v1/**";
const START_URL = `${BASE_URL}/dashboard?view=assistantconversation&category=domestic_violence&topic=domestic_violence&message=Some+one+pull+my+hijub`;
const VOICE_START_URL = `${BASE_URL}/dashboard?view=assistantconversation&category=domestic_violence&topic=domestic_violence&voice=1`;
const SEEDED_VOICE_START_URL = `${BASE_URL}/dashboard?view=assistantconversation&category=domestic_violence&topic=domestic_violence&voice=1&message=First+voice+message`;
const INITIAL_MESSAGE = "Some one pull my hijub";
const VOICE_TRANSCRIPT = "This is a voice e2e transcript about what happened.";
const TRIAGE_HANDOFF_MESSAGE =
  "Of course — I can take you to your triage summary now.";
const E2E_USER = {
  id: "user-e2e",
  email: "e2e@safespeak.test",
  fullName: "SafeSpeak E2E User",
  role: "public_user",
  status: "active",
  isEmailVerified: true,
  createdAt: "2026-05-17T00:00:00.000Z",
  updatedAt: "2026-05-17T00:00:00.000Z",
};

type ConsentState = {
  process_with_ai?: boolean;
  transcribe_audio?: boolean;
};

type ApiMockState = {
  consent: ConsentState;
  conversationSessionCreates: number;
  conversationMessages: number;
  forceBlockedTriage?: boolean;
  timelineAssistantRequests: number;
  transcriptionRequests: number;
  speechSynthesisRequests: number;
  speechSynthesisLanguages: Array<string | undefined>;
};

function apiEnvelope(data: unknown, message = "OK") {
  return {
    success: true,
    message,
    data,
    timestamp: new Date("2026-05-17T00:00:00.000Z").toISOString(),
    requestId: "e2e-request",
  };
}

async function mockSafeSpeakApi(
  page: Page,
  initialConsent: ConsentState = {}
): Promise<ApiMockState> {
  let turnNumber = 0;
  const state: ApiMockState = {
    consent: { ...initialConsent },
    conversationSessionCreates: 0,
    conversationMessages: 0,
    timelineAssistantRequests: 0,
    transcriptionRequests: 0,
    speechSynthesisRequests: 0,
    speechSynthesisLanguages: [],
  };

  await page.route(API_ROUTE, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;

    if (pathname.endsWith("/sessions/anonymous")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({ sessionToken: "e2e-session-token" })
        ),
      });
      return;
    }

    if (pathname.endsWith("/auth/me")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ user: E2E_USER })),
      });
      return;
    }

    if (pathname.endsWith("/consents/current")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ consent: state.consent })),
      });
      return;
    }

    if (pathname.endsWith("/consents/update")) {
      const body = request.postDataJSON() as { flags?: ConsentState };
      state.consent = {
        ...state.consent,
        ...(body.flags ?? {}),
      };
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ consent: state.consent })),
      });
      return;
    }

    if (
      pathname.endsWith("/conversation-flow/sessions") &&
      request.method() === "POST"
    ) {
      state.conversationSessionCreates += 1;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            session: {
              id: "conversation-e2e",
              selectedTopic: "domestic_violence",
              detectedCategory: "domestic_violence",
              status: "active",
              safetyRiskLevel: "low",
              jurisdiction: "NSW",
              messageCount: 0,
              userTurnCount: 0,
            },
          })
        ),
      });
      return;
    }

    if (
      pathname.endsWith(
        "/conversation-flow/sessions/conversation-e2e/messages"
      ) &&
      request.method() === "POST"
    ) {
      state.conversationMessages += 1;
      turnNumber += 1;
      const body = request.postDataJSON() as { content?: string };
      const userContent = body.content ?? "";
      const normalizedContent = userContent.trim().toLowerCase();
      const isLegalLookup =
        normalizedContent ===
        "what is personal information under the privacy act 1988?";
      const isTriageHandoff =
        normalizedContent === "give me the trige button";
      const isBengaliVoiceRequest = userContent.includes("বাংল");
      const reachedTriageThreshold = turnNumber >= 4;
      const offerTriage =
        isTriageHandoff || (reachedTriageThreshold && !state.forceBlockedTriage);
      const assistantContent = isTriageHandoff
        ? TRIAGE_HANDOFF_MESSAGE
        : isBengaliVoiceRequest
        ? "হ্যাঁ, আমি বাংলায় কথা বলতে পারি। আপনি কী নিয়ে কথা বলতে চান?"
        : offerTriage
        ? "Assistant e2e response 4: enough facts are collected for triage."
        : isLegalLookup
        ? "Under the Privacy Act 1988, section 6 says personal information means information or an opinion about an identified individual, or an individual who is reasonably identifiable."
        : `Assistant e2e response ${turnNumber}: I captured that detail. Please share one more relevant fact.`;

      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            session: {
              id: "conversation-e2e",
              selectedTopic: "domestic_violence",
              detectedCategory: state.forceBlockedTriage
                ? "general_support"
                : "domestic_violence",
              status:
                reachedTriageThreshold && state.forceBlockedTriage
                  ? "ready_for_triage"
                  : offerTriage
                    ? "ready_for_triage"
                    : "active",
              safetyRiskLevel: offerTriage ? "medium" : "low",
              jurisdiction: "NSW",
              messageCount: turnNumber * 2,
              userTurnCount: turnNumber,
            },
            userMessage: {
              id: `user-${turnNumber}`,
              role: "user",
              content: userContent,
              turnNumber,
            },
            assistantMessage: {
              id: `assistant-${turnNumber}`,
              role: "assistant",
              content: assistantContent,
              turnNumber,
            },
            factExtraction: {
              whatHappened: userContent,
              missingInformation: reachedTriageThreshold
                ? []
                : ["location", "timing"],
              timeline: {
                whatHappened: userContent,
              },
            },
            triage: reachedTriageThreshold
              ? {
                  likelyCategory: state.forceBlockedTriage
                    ? "general_support"
                    : "domestic_violence",
                  likelyCategoryLabel: state.forceBlockedTriage
                    ? "General support"
                    : "Domestic violence",
                  confidenceScore: state.forceBlockedTriage ? 0.31 : 0.78,
                  confidenceLabel: state.forceBlockedTriage ? "low" : "medium",
                  safetyRiskLevel: state.forceBlockedTriage ? "low" : "medium",
                  reasoningSummary: state.forceBlockedTriage
                    ? "The conversation does not include harm-related facts."
                    : "The conversation includes harm-related facts.",
                  matchedLegislationIds: [],
                  matchedKnowledgeSources: [],
                  humanReviewRecommended: Boolean(state.forceBlockedTriage),
                  missingInformation: [],
                  canProceedToRecommendations: !state.forceBlockedTriage,
                  matchedResourceTypes: state.forceBlockedTriage
                    ? ["general"]
                    : ["support_service"],
                  disclaimer: "This is information only, not legal advice.",
                }
              : null,
            transition: {
              offerTriage,
              prompt: offerTriage
                ? "You can continue to triage when you are ready."
                : "Keep sharing what happened.",
              primaryCta: offerTriage ? "Continue to Triage" : null,
              secondaryCta: null,
            },
            responseMeta: {
              confidence: "medium",
              disclaimer: "This is information only, not legal advice.",
              citations: isLegalLookup
                ? [
                    {
                      title: "Privacy Act 1988",
                      sectionRef: "Section 6",
                      url: "https://example.test/privacy-act-section-6",
                    },
                  ]
                : [],
              rag: {
                used: isLegalLookup,
                unavailable: false,
                resultCount: isLegalLookup ? 1 : 0,
              },
              reviewStatus: isTriageHandoff
                ? "triage_handoff"
                : "automated",
              triageReady: isTriageHandoff ? true : undefined,
              nextAction: isTriageHandoff
                ? "show_triage_button"
                : undefined,
              conversationSessionId: "conversation-e2e",
              showSources: isLegalLookup ? true : false,
              sourceDisplayReason: isTriageHandoff
                ? "triage_handoff"
                : isLegalLookup
                ? "legal_lookup"
                : "hidden_support_reply",
              assistantLanguage: isBengaliVoiceRequest ? "bn" : "en",
            },
          })
        ),
      });
      return;
    }

    if (
      pathname.endsWith("/conversation-flow/sessions/conversation-e2e/support") &&
      request.method() === "GET"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            session: {
              id: "conversation-e2e",
              selectedTopic: "cyber_scam",
              detectedCategory: "online_abuse",
              status: "triaged",
              safetyRiskLevel: "high",
              jurisdiction: "NSW",
              messageCount: 10,
              userTurnCount: 5,
            },
            triage: {
              likelyCategory: "online_abuse",
              likelyCategoryLabel: "Image-Based Abuse & Online Threat Support",
              confidenceScore: 0.92,
              confidenceLabel: "high",
              safetyRiskLevel: "high",
              reasoningSummary:
                "Matched to privacy, image-based abuse, online threats, identity protection, and workplace privacy signals.",
              structuredFacts: {
                imageBasedAbuse: true,
                onlineThreatBlackmail: true,
                privacyDataBreach: true,
                identityTheftRisk: true,
                scamFraud: true,
                employerHealthPrivacy: true,
                matchedFacts: [
                  "image-based abuse/private photos",
                  "privacy/data breach",
                  "identity theft risk",
                ],
              },
              presentation: {
                title: "Image-Based Abuse & Online Threat Support",
                body: "This may involve private photos, privacy exposure, scam risk, and online threats.",
                assessmentNote:
                  "This is not a formal finding. You choose what to do next.",
                primaryStepTitle:
                  "Protect accounts, bank details, and identity information",
                primaryStepBody:
                  "Change passwords, contact your bank, save screenshots, and avoid sending more money or documents.",
                immediateDangerBody:
                  "If the threats escalate or you feel unsafe, put immediate safety first and consider calling 000.",
                secondTitle: "Report the content or account issue",
                secondBody:
                  "Review platform, eSafety, privacy complaint, and company response options.",
                secondActionLabel: "Review options",
                secondActionHref:
                  "/dashboard?view=reportsubmissionrecommendations",
                thirdTitle:
                  "Keep a short record of the workplace privacy issue",
                thirdBody:
                  "Keep a timeline of who shared the information and who received it.",
                thirdActionLabel: "Evidence steps",
                thirdActionHref: "/dashboard?view=reportsubmissionevidence",
                microCardSummary:
                  "Matched to privacy, identity, evidence, and online threat signals.",
              },
              matchedLegislationIds: [],
              matchedKnowledgeSources: [],
              humanReviewRecommended: false,
              missingInformation: [],
              canProceedToRecommendations: true,
              matchedResourceTypes: [
                "online_safety",
                "government",
                "scam_support",
                "workplace_body",
              ],
              relatedIssueTypes: [
                "online_abuse",
                "privacy_data_breach",
                "scam_fraud",
                "workplace_privacy",
              ],
              disclaimer: "This is information only, not legal advice.",
            },
            support: {
              suggestedMicroCardIds: [],
              recommendedActions: [
                {
                  slot: "immediateDanger",
                  title: "Immediate danger",
                  description:
                    "If the threats escalate or you feel unsafe, put immediate safety first and consider calling 000.",
                  whySuggested:
                    "This stays visible so urgent safety options are always easy to reach.",
                  ctaLabel: "Call 000",
                  href: "tel:000",
                  phone: "000",
                  actionKind: "call",
                  consentNote:
                    "SafeSpeak does not call emergency services for you.",
                },
              ],
              additionalResources: [
                {
                  slot: "additional",
                  title: "eSafety",
                  description:
                    "Online abuse guidance and reporting option for harmful content.",
                  whySuggested:
                    "Suggested because the triage picked up online abuse, image-based abuse, or harmful content concerns.",
                  ctaLabel: "Open eSafety",
                  href: "https://www.esafety.gov.au/",
                  actionKind: "external_link",
                  consentNote:
                    "SafeSpeak does not contact eSafety unless you choose that next step.",
                },
              ],
              matchedSupportServices: [],
              fallbackUsed: false,
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/rag/timeline-assistant")) {
      state.timelineAssistantRequests += 1;
    }

    if (pathname.endsWith("/ai/transcribe-audio")) {
      state.transcriptionRequests += 1;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            transcript: VOICE_TRANSCRIPT,
            language: "en",
            model: "e2e-transcribe",
            saved: false,
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/ai/synthesize-speech")) {
      state.speechSynthesisRequests += 1;
      const body = request.postDataJSON() as { language?: string };
      state.speechSynthesisLanguages.push(body.language);
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            audioBase64: "AA==",
            mimeType: "audio/mpeg",
            model: "e2e-tts",
            voice: "e2e",
            temporary: true,
          })
        ),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        message: `Unhandled E2E API route: ${request.method()} ${pathname}`,
        data: null,
      }),
    });
  });

  return state;
}

async function expectLocatorReceivesPointer(locator: Locator) {
  await expect(locator).toBeEnabled();
  const receivesPointer = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const topElement = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );

    return topElement === element || element.contains(topElement);
  });

  expect(receivesPointer).toBe(true);
}

async function installVoiceMocks(page: Page) {
  await page.addInitScript(() => {
    class MockMediaRecorder {
      static isTypeSupported() {
        return true;
      }

      mimeType = "audio/webm";
      state: "inactive" | "recording" = "inactive";
      ondataavailable: ((event: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(_stream: MediaStream, options?: { mimeType?: string }) {
        this.mimeType = options?.mimeType ?? "audio/webm";
      }

      start() {
        this.state = "recording";
        window.setTimeout(() => {
          if (this.state !== "recording") {
            return;
          }

          this.ondataavailable?.({
            data: new Blob(["voice-e2e"], { type: this.mimeType }),
          });
          this.stop();
        }, 50);
      }

      stop() {
        if (this.state === "inactive") {
          return;
        }

        this.state = "inactive";
        window.setTimeout(() => this.onstop?.(), 0);
      }
    }

    class MockAudio {
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(_url: string) {}

      play() {
        return Promise.reject(
          new DOMException("Autoplay blocked in e2e", "NotAllowedError")
        );
      }

      pause() {}
    }

    class StalledSpeechSynthesisUtterance {
      lang = "en-US";
      rate = 1;
      pitch = 1;
      volume = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(_text: string) {}
    }

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: async () => ({
          getTracks: () => [{ stop: () => undefined }],
        }),
      },
    });
    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: MockMediaRecorder,
    });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockAudio,
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: StalledSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: () => undefined,
        speak: () => undefined,
      },
    });
  });
}

async function installContinuousVoiceLoopMocks(page: Page) {
  await page.addInitScript(() => {
    class MockMediaRecorder {
      static isTypeSupported() {
        return true;
      }

      mimeType = "audio/webm";
      state: "inactive" | "recording" = "inactive";
      ondataavailable: ((event: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(_stream: MediaStream, options?: { mimeType?: string }) {
        this.mimeType = options?.mimeType ?? "audio/webm";
      }

      start() {
        this.state = "recording";
        window.setTimeout(() => {
          if (this.state !== "recording") {
            return;
          }

          this.ondataavailable?.({
            data: new Blob(["voice-loop-e2e"], { type: this.mimeType }),
          });
        }, 50);
      }

      stop() {
        if (this.state === "inactive") {
          return;
        }

        this.state = "inactive";
        window.setTimeout(() => this.onstop?.(), 0);
      }
    }

    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      maxAlternatives = 1;
      onresult: ((event: unknown) => void) | null = null;
      onerror: (() => void) | null = null;
      onend: (() => void) | null = null;

      start() {}

      stop() {
        window.setTimeout(() => this.onend?.(), 0);
      }

      abort() {
        window.setTimeout(() => this.onend?.(), 0);
      }
    }

    class MockAudio {
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(_url: string) {}

      play() {
        window.setTimeout(() => {
          this.onended?.();
        }, 50);
        return Promise.resolve();
      }

      pause() {}
    }

    class StalledSpeechSynthesisUtterance {
      lang = "en-US";
      rate = 1;
      pitch = 1;
      volume = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(_text: string) {}
    }

    const getUserMedia = async () => {
      return {
        getTracks: () => [{ stop: () => undefined }],
      };
    };

    if (navigator.mediaDevices) {
      Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
        configurable: true,
        value: getUserMedia,
      });
    } else {
      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: {
          getUserMedia,
        },
      });
    }
    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: MockMediaRecorder,
    });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      configurable: true,
      value: MockSpeechRecognition,
    });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockAudio,
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: StalledSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: () => undefined,
        speak: () => undefined,
      },
    });
  });
}

test.describe("SafeSpeak AI Conversation", () => {
  test.setTimeout(90_000);
  let apiMock: ApiMockState;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const encodeJwtPart = (value: unknown) =>
        window
          .btoa(JSON.stringify(value))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      const token = `${encodeJwtPart({ alg: "none", typ: "JWT" })}.${encodeJwtPart(
        {
          exp: 4102444800,
        }
      )}.e2e`;

      window.localStorage.clear();
      window.sessionStorage.clear();
      window.sessionStorage.setItem("safespeak_safety_gate_ack", "1");
      window.localStorage.setItem(
        "safespeak_auth_session",
        JSON.stringify({
          user: {
            id: "user-e2e",
            email: "e2e@safespeak.test",
            fullName: "SafeSpeak E2E User",
            role: "public_user",
            status: "active",
            isEmailVerified: true,
            createdAt: "2026-05-17T00:00:00.000Z",
            updatedAt: "2026-05-17T00:00:00.000Z",
          },
          tokens: {
            accessToken: token,
            refreshToken: token,
          },
          timestamp: "2026-05-17T00:00:00.000Z",
        })
      );
    });
    apiMock = await mockSafeSpeakApi(page);
  });

  test("requires AI consent before initial conversation calls and continues until triage is available", async ({
    page,
  }) => {
    await page.goto(START_URL, { waitUntil: "domcontentloaded" });

    const conversation = page.getByTestId("ai-conversation-page");
    const input = page.getByTestId("ai-conversation-input");
    const sendButton = page.getByTestId("ai-conversation-send");
    const triageButton = page.getByTestId("ai-conversation-triage-button");

    await expect(conversation).toBeVisible();
    await expect(page.locator(".dashboard-safety-rail")).toBeVisible();
    await expect(
      page.getByTestId("ai-conversation-message-user")
    ).toContainText(INITIAL_MESSAGE);
    await expect(page.getByText("AI consent required")).toBeVisible();
    expect(apiMock.conversationSessionCreates).toBe(0);
    expect(apiMock.conversationMessages).toBe(0);
    expect(apiMock.timelineAssistantRequests).toBe(0);
    expect(apiMock.transcriptionRequests).toBe(0);

    await page.getByRole("button", { name: /Allow AI and continue/i }).click();
    await expect(page.getByText("Assistant e2e response 1")).toBeVisible();
    expect(apiMock.conversationSessionCreates).toBe(1);
    expect(apiMock.conversationMessages).toBe(1);
    expect(apiMock.transcriptionRequests).toBe(0);

    const firstUserMessage =
      "It happened outside my apartment lobby late last night.";
    await input.fill(firstUserMessage);
    await expectLocatorReceivesPointer(sendButton);
    await sendButton.click();

    await expect(page.getByText(firstUserMessage)).toBeVisible();
    await expect(page.getByText("Assistant e2e response 2")).toBeVisible();

    await expect(page.getByText("Live Timeline Builder")).toHaveCount(0);
    await expect(page.getByText("Start with this topic")).toHaveCount(0);
    await expect(page.getByText("Choose a topic")).toHaveCount(0);
    await expect(
      page.getByText("Domestic Violence", { exact: true })
    ).toHaveCount(0);
    await expect(page.getByText("Racial Abuse", { exact: true })).toHaveCount(
      0
    );
    await expect(page.getByText("Cyber Scam", { exact: true })).toHaveCount(0);
    await expect(
      page.getByText("Migrant Challenges", { exact: true })
    ).toHaveCount(0);

    await page
      .getByRole("button", { name: "Minimize emergency safety controls" })
      .click();
    await expect(page.locator(".dashboard-safety-minimized")).toBeVisible();

    const minimizedRailMessage =
      "The neighbour heard shouting from inside the residence.";
    await input.fill(minimizedRailMessage);
    await expectLocatorReceivesPointer(sendButton);
    await sendButton.click();
    await expect(page.getByText(minimizedRailMessage)).toBeVisible();

    for (const message of [
      "The person grabbed my scarf and shouted at me.",
      "I felt scared and moved away as quickly as I could.",
      "A neighbour saw part of it and I may have camera footage.",
    ]) {
      if (await triageButton.isVisible()) {
        break;
      }

      await input.fill(message);
      await sendButton.click();
      await expect(page.getByText(message)).toBeVisible();
    }

    await expect(triageButton).toBeVisible();
    await expect(triageButton).toHaveText(/Continue to Triage/i);
  });

  test("cancel returns to the previous page instead of forcing home", async ({
    page,
  }) => {
    apiMock.consent = {
      process_with_ai: true,
      transcribe_audio: true,
    };

    await page.goto(
      `${BASE_URL}/dashboard?view=assistant&category=domestic_violence&topic=domestic_violence`,
      { waitUntil: "domcontentloaded" }
    );
    await page.goto(START_URL, { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("ai-conversation-page")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("view"))
      .toBe("assistant");
  });

  test("runs voice-first consent, transcription, autoplay fallback, replay, and stop flow", async ({
    page,
  }) => {
    await installVoiceMocks(page);
    await page.goto(VOICE_START_URL, { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("ai-conversation-page")).toBeVisible();
    await expect(
      page.getByText("Audio transcription consent required")
    ).toBeVisible();
    expect(apiMock.transcriptionRequests).toBe(0);
    expect(apiMock.conversationMessages).toBe(0);

    await page
      .getByRole("button", { name: /Allow transcription and continue/i })
      .click();

    await expect(page.getByText(VOICE_TRANSCRIPT)).toBeVisible();
    await expect(page.getByText("AI consent required")).toBeVisible();
    expect(apiMock.transcriptionRequests).toBe(1);
    expect(apiMock.conversationSessionCreates).toBe(0);
    expect(apiMock.conversationMessages).toBe(0);
    expect(apiMock.speechSynthesisRequests).toBe(0);

    await page.getByRole("button", { name: /Allow AI and continue/i }).click();

    await expect(page.getByText("Assistant e2e response 1")).toBeVisible();
    await expect(page.getByText("Tap to play response.")).toBeVisible();
    const replayButton = page.getByRole("button", { name: "Replay" });
    await expect(replayButton).toBeVisible();
    expect(apiMock.conversationSessionCreates).toBe(1);
    expect(apiMock.conversationMessages).toBe(1);
    expect(apiMock.speechSynthesisRequests).toBe(1);

    await replayButton.click();
    await expect(page.getByText("Tap to play response.")).toBeVisible();
    expect(apiMock.speechSynthesisRequests).toBe(2);

    const stopButton = page.getByRole("button", { name: "Stop Recording" });
    await expect(stopButton).toBeVisible();
    await stopButton.click();
    await expect(stopButton).toHaveCount(0);
  });

  test("does not show triage CTA for blocked low-confidence triage responses", async ({
    page,
  }) => {
    apiMock.forceBlockedTriage = true;
    apiMock.consent = {
      process_with_ai: true,
      transcribe_audio: true,
    };

    await page.goto(START_URL, { waitUntil: "domcontentloaded" });

    const input = page.getByTestId("ai-conversation-input");
    const sendButton = page.getByTestId("ai-conversation-send");
    const triageButton = page.getByTestId("ai-conversation-triage-button");

    await expect(page.getByText("Assistant e2e response 1")).toBeVisible();

    for (const message of [
      "I am only checking how this chat works.",
      "There is no incident to report right now.",
      "I just want general information for later.",
    ]) {
      await input.fill(message);
      await sendButton.click();
      await expect(page.getByText(message)).toBeVisible();
    }

    await expect(page.getByText("Assistant e2e response 4")).toBeVisible();
    await expect(triageButton).toHaveCount(0);
  });

  test("hides supportive source footers, shows compact legal footers, and preserves session into triage", async ({
    page,
  }) => {
    apiMock.consent = {
      process_with_ai: true,
      transcribe_audio: true,
    };

    await page.goto(START_URL, { waitUntil: "domcontentloaded" });

    const input = page.getByTestId("ai-conversation-input");
    const sendButton = page.getByTestId("ai-conversation-send");

    await expect(page.getByText("Assistant e2e response 1")).toBeVisible();
    await expect(page.getByText(/^Source:/)).toHaveCount(0);

    await input.fill("What is personal information under the Privacy Act 1988?");
    await sendButton.click();

    await expect(
      page.getByText("Under the Privacy Act 1988, section 6 says personal information means")
    ).toBeVisible();
    await expect(
      page.getByText("Source: Privacy Act 1988, section 6")
    ).toBeVisible();

    await input.fill("give me the trige button");
    await sendButton.click();

    const triageButton = page.getByTestId("ai-conversation-triage-button");
    await expect(page.getByText(TRIAGE_HANDOFF_MESSAGE)).toBeVisible();
    await expect(triageButton).toBeVisible();
    await expect(page.getByText(/^Source:/)).toHaveCount(1);

    await triageButton.click();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("view"))
      .toBe("reportsubmissionsupport");
    await expect
      .poll(() =>
        new URL(page.url()).searchParams.get("conversationSessionId")
      )
      .toBe("conversation-e2e");
    await expect(
      page.getByText("Image-Based Abuse & Online Threat Support")
    ).toBeVisible();
    await expect(
      page.getByText(/SafeSpeak does not call, email, report, or share anything automatically/i)
    ).toBeVisible();
    await expect(page.getByText("Triage debug")).toHaveCount(0);

    const primaryStepLink = page.getByTestId("triage-primary-step-link");
    await expect(primaryStepLink).toBeVisible();
    await expect(primaryStepLink).toHaveAttribute(
      "href",
      /conversationSessionId=conversation-e2e/
    );
  });

  test("keeps listening when browser recognition and speech synthesis stall", async ({
    page,
  }) => {
    apiMock.consent = {
      process_with_ai: true,
      transcribe_audio: true,
    };
    await installContinuousVoiceLoopMocks(page);

    await page.goto(SEEDED_VOICE_START_URL, { waitUntil: "domcontentloaded" });

    await expect(page.getByText("First voice message")).toBeVisible();
    await expect(page.getByText("Assistant e2e response 1")).toBeVisible();
    expect(apiMock.conversationMessages).toBe(1);
    expect(apiMock.speechSynthesisRequests).toBe(1);

    await expect
      .poll(() => apiMock.transcriptionRequests, { timeout: 12_000 })
      .toBeGreaterThanOrEqual(1);

    await expect(page.getByText(VOICE_TRANSCRIPT)).toBeVisible();
    await expect(page.getByText("Assistant e2e response 2")).toBeVisible();
    expect(apiMock.conversationMessages).toBe(2);

    const stopButton = page.getByRole("button", { name: "Stop Recording" });
    await expect(stopButton).toBeVisible();
    await stopButton.click();
    await expect(stopButton).toHaveCount(0);
  });

  test("uses the assistant language for multilingual voice playback", async ({
    page,
  }) => {
    apiMock.consent = {
      process_with_ai: true,
      transcribe_audio: true,
    };
    await installContinuousVoiceLoopMocks(page);

    await page.goto(
      `${BASE_URL}/dashboard?view=assistantconversation&voice=1&topic=general_assistant&message=${encodeURIComponent("বাংলায় কথা বলুন")}`,
      { waitUntil: "domcontentloaded" }
    );

    await expect(
      page.getByText("হ্যাঁ, আমি বাংলায় কথা বলতে পারি। আপনি কী নিয়ে কথা বলতে চান?")
    ).toBeVisible();
    await expect
      .poll(() => apiMock.speechSynthesisLanguages)
      .toContain("bn");

    await page.getByRole("button", { name: "Stop Recording" }).click();
  });
});
