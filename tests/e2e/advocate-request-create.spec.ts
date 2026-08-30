import { expect, test, type Page } from "@playwright/test";

const API_ROUTE = "**/api/v1/**";

function apiEnvelope(data: unknown, message = "OK") {
  return {
    success: true,
    message,
    data,
    timestamp: new Date("2026-07-13T00:00:00.000Z").toISOString(),
    requestId: "advocate-e2e-request",
  };
}

async function installSafeState(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.sessionStorage.setItem("safespeak_safety_gate_ack", "1");
  });
}

async function mockAdvocateApi(page: Page) {
  let createRequestCount = 0;
  let lastRequestBody: unknown;

  await page.route(API_ROUTE, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;

    if (pathname.endsWith("/sessions/anonymous")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ sessionToken: "advocate-e2e-session" })),
      });
      return;
    }

    if (pathname.endsWith("/consents/current")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            consent: {
              store_local: true,
              advocate_request: true,
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/support/advocates")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            advocates: [
              {
                id: "e2e_verified_advocate",
                key: "e2e_verified_advocate",
                advocateType: "e2e_verified_advocate",
                displayName: "E2E Verified Advocate",
                languages: ["en"],
                issueTypes: ["general_support"],
                regions: ["national"],
                culturalProfiles: [],
                faithProfiles: [],
                availability: "request_based",
                informationOnly: true,
              },
            ],
            facets: {
              languages: ["en"],
              regions: ["national"],
              issueTypes: ["general_support"],
              culturalProfiles: [],
              faithProfiles: [],
              availability: ["request_based"],
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/support/advocate-requests/me")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ requests: [] })),
      });
      return;
    }

    if (pathname.endsWith("/support/advocate-request") && request.method() === "POST") {
      createRequestCount += 1;
      lastRequestBody = JSON.parse(request.postData() ?? "{}");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope(
            {
              request: {
                id: "advocate-request-e2e",
                _id: "advocate-request-e2e",
                reference: "ADV-E2E",
                advocateType: "e2e_verified_advocate",
                advocateKey: "e2e_verified_advocate",
                advocateProfileId: "advocate-profile-e2e",
                advocateSnapshot: {
                  key: "e2e_verified_advocate",
                  displayName: "E2E Verified Advocate",
                  languages: ["en"],
                  issueTypes: ["general_support"],
                  regions: ["national"],
                  culturalProfiles: [],
                  faithProfiles: [],
                  availability: "request_based",
                },
                language: "en",
                safeContactPreference: "in_app",
                consentSnapshot: {
                  advocate_request: true,
                  capturedAt: "2026-07-13T00:00:00.000Z",
                },
                status: "pending",
                createdAt: "2026-07-13T00:00:00.000Z",
              },
            },
            "Advocate request created"
          )
        ),
      });
      return;
    }

    if (pathname.endsWith("/support/services")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ services: [] })),
      });
      return;
    }

    if (pathname.endsWith("/support/recommendations")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ recommendations: [] })),
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(apiEnvelope({})),
    });
  });

  return {
    getCreateRequestCount: () => createRequestCount,
    getLastRequestBody: () => lastRequestBody,
  };
}

test("advocate create request has loading, single-submit, and success states", async ({ page }) => {
  await installSafeState(page);
  const api = await mockAdvocateApi(page);

  await page.goto("/dashboard/explorer");
  await expect(page.getByText("E2E Verified Advocate")).toBeVisible();

  const previewButton = page.getByRole("button", { name: /preview request/i });
  await expect(previewButton).toBeDisabled();

  await page.getByLabel(/I understand SafeSpeak/i).check();
  await expect(previewButton).toBeEnabled();
  await page
    .getByPlaceholder("Share only what feels safe and necessary.")
    .fill("I need safe support options.");
  await previewButton.click();

  await expect(page.getByText("Shared fields preview")).toBeVisible();
  const createButton = page.getByRole("button", { name: /create advocate request/i });
  await expect(createButton).toBeEnabled();

  await createButton.dblclick();
  await expect(page.getByRole("button", { name: "Creating request..." })).toBeVisible();
  await expect(page.getByRole("status").getByText("Advocate request created")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Reference: ADV-E2E");
  await expect(page.getByText("My advocate requests")).toBeVisible();
  await expect(page.getByText("Your request has been received")).toBeVisible();
  await expect(page.getByRole("button", { name: /request created/i })).toBeDisabled();

  expect(api.getCreateRequestCount()).toBe(1);
  expect(api.getLastRequestBody()).toMatchObject({
    advocateKey: "e2e_verified_advocate",
    safeContactPreference: "in_app",
  });
});
