import { type Page, expect, test } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3130";
const API_ROUTE = "**/api/v1/**";
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

function apiEnvelope(data: unknown, message = "OK") {
  return {
    success: true,
    message,
    data,
    timestamp: new Date("2026-05-17T00:00:00.000Z").toISOString(),
    requestId: "scamshield-e2e-request",
  };
}

async function installAuthState(page: Page) {
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
}

async function mockSafeSpeakApi(page: Page) {
  await page.route(API_ROUTE, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;

    if (pathname.endsWith("/sessions/anonymous")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({ sessionToken: "scamshield-e2e-session-token" })
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
        body: JSON.stringify(
          apiEnvelope({
            consent: {
              process_with_ai: true,
              share_with_agencies: true,
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/consents/update")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            consent: {
              process_with_ai: true,
              share_with_agencies: true,
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/scamshield/analyze-text")) {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            analysis: {
              _id: "scam-analysis-e2e",
              type: "text",
              riskLevel: "high",
              riskScore: 76,
              confidence: "high",
              summary:
                "High scam risk detected based on credential request, link in message, official impersonation.",
              indicators: [
                "credential request",
                "link in message",
                "official impersonation",
              ],
              redFlags: [
                "The message asks for account access details or sends the user toward a login flow.",
                "The message includes a link that could lead to a fake form or login page.",
              ],
              recommendations: [
                "Do not enter passwords or PINs from this message. Go directly to the official app or website.",
                "Avoid clicking the link. Search for the organization yourself or use its official app.",
              ],
              extractedEntities: {
                urls: ["https://paypal-security-login.example/verify"],
                emailAddresses: ["spoof@paypal-security.example"],
                phoneNumbers: [],
                amounts: [],
                paymentMethods: [],
                organizations: ["paypal", "bank"],
                accountTerms: ["login", "account verification"],
                cryptoReferences: [],
                urlSignals: ["sensitive action in link"],
                primaryUrlDomain: "paypal-security-login.example",
                possibleSender: "spoof@paypal-security.example",
              },
              metadata: {
                informationOnly: true,
              },
            },
          })
        ),
      });
      return;
    }

    if (
      pathname.endsWith("/scamshield/scam-analysis-e2e/generate-report-draft")
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            analysis: {
              _id: "scam-analysis-e2e",
              type: "text",
              riskLevel: "high",
              riskScore: 76,
              confidence: "high",
              summary:
                "High scam risk detected based on credential request, link in message, official impersonation.",
              indicators: [
                "credential request",
                "link in message",
                "official impersonation",
              ],
              draftReport: {
                summary:
                  "High scam risk detected based on credential request, link in message, official impersonation.",
                draft:
                  "ScamShield assessment: high risk (76/100), high confidence.\n\nDetected signals: credential request, link in message, official impersonation.",
                scamCategory: "Phishing or account takeover",
                platform: "Message with link (paypal-security-login.example)",
                senderName: "spoof@paypal-security.example",
                indicators: [
                  "credential request",
                  "link in message",
                  "official impersonation",
                ],
              },
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/media-assets")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ assets: [] })),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify(apiEnvelope({ error: pathname }, "Not mocked")),
    });
  });
}

test.describe("ScamShield", () => {
  test.beforeEach(async ({ page }) => {
    await installAuthState(page);
    await mockSafeSpeakApi(page);
  });

  test("does not show demo risk results without a completed analysis", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dashboard?view=scamshieldrisk`, {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByText("Run a ScamShield analysis first")
    ).toBeVisible();
    await expect(page.getByText("Demo preview only")).toHaveCount(0);
    await expect(page.getByText("High Risk Detected")).toHaveCount(0);
  });

  test("analyzes message content and carries real results into agency fields", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dashboard?view=scamshieldintake`, {
      waitUntil: "domcontentloaded",
    });
    await page
      .getByRole("button", { name: "Minimize emergency safety controls" })
      .click();

    const analyzeButton = page.getByRole("button", { name: /Analyze Now/i });
    await expect(analyzeButton).toBeDisabled();

    await page
      .getByLabel("Message Content")
      .fill(
        "Urgent: verify your PayPal login now at https://paypal-security-login.example/verify from spoof@paypal-security.example."
      );
    await expect(analyzeButton).toBeEnabled();
    await analyzeButton.click();

    await expect(
      page
        .getByText(/High scam risk detected based on credential request/i)
        .first()
    ).toBeVisible();
    await expect(
      page.getByText(/The message asks for account access details/i)
    ).toBeVisible();
    await expect(
      page.getByText(/paypal-security-login\.example/i)
    ).toBeVisible();

    await page.getByRole("link", { name: /Report This Incident/i }).click();
    await expect(page.getByText(/Secure your assets/i)).toBeVisible();

    await page
      .getByRole("link", { name: /Launch Report Tool/i })
      .first()
      .click();
    await expect(page.getByText("Generated draft")).toBeVisible();
    await expect(
      page.locator('input[value="spoof@paypal-security.example"]')
    ).toBeVisible();
    await expect(
      page.locator('input[value="Phishing or account takeover"]')
    ).toBeVisible();
    await expect(
      page.locator(
        'input[value="Message with link (paypal-security-login.example)"]'
      )
    ).toBeVisible();
  });
});
