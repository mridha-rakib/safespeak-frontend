import { expect, test, type Page } from "@playwright/test";

const API_ROUTE = "**/api/v1/**";
const REPORT_ID = "report-admin-destination-e2e";
const LEGAL_AID_DESTINATION_ID = "6a0e038a0a296b9642533aa8";
const LEGAL_AID_SUBMISSION_ID = "submission-legal-aid-e2e";
const INCIDENT_TEXT =
  "My wife hit me at home. She slapped me and pushed me into the wall. I feel unsafe at home and want legal and reporting options in NSW.";

function apiEnvelope(data: unknown, message = "OK") {
  return {
    success: true,
    message,
    data,
    timestamp: new Date("2026-07-12T00:00:00.000Z").toISOString(),
    requestId: "report-admin-destination-flow-e2e",
  };
}

async function mockAdminDestinationApi(page: Page) {
  let submissionPostCount = 0;
  let submission: Record<string, unknown> | null = null;
  let report = {
    _id: REPORT_ID,
    refNo: "SS-E2E-ADMIN-001",
    language: "en",
    jurisdiction: "NSW",
    context: "Domestic violence incident report",
    originalNarrative: INCIDENT_TEXT,
    incidentType: "domestic_violence",
    severity: "high",
    status: "draft",
    structuredFields: {
      incidentTitle: "Domestic violence incident report",
      what: INCIDENT_TEXT,
      when: "2026-07-12",
      where: "Sydney, NSW",
    },
  };

  const adminDestinations = [
    {
      destinationId: "admin-police-nsw",
      destinationKey: "nsw-police",
      destinationType: "police",
      destinationName: "NSW Police",
      reason:
        "Suggested because it matches the report incident type \"domestic_violence\", serves NSW, supports manual export routing.",
      channel: "manual_export_json",
      jurisdiction: "NSW",
      languages: ["en"],
      contactPhone: "131 444",
      minimumRequiredInfo: ["summary", "where"],
      missingRequiredInfo: [],
      anonymityOptions: ["identified", "pseudonymous"],
      expectedNextSteps: [
        "Use 000 for immediate danger.",
        "Use the prepared report to support a police contact if you choose to proceed.",
      ],
      consentRequired: true,
      supportsAcknowledgement: false,
      requiredConsentFlags: ["share_with_agencies"],
      matchedIncidentTypes: ["domestic_violence"],
      deliveryReadiness: {
        status: "manual_action",
        mode: "manual",
        canAutoSend: false,
        actuallySends: false,
        credentialConfigured: true,
        configurationIssues: [],
      },
      payloadPreview: {
        refNo: report.refNo,
        title: report.context,
        summary: report.originalNarrative,
        language: report.language,
        jurisdiction: report.jurisdiction,
        incidentType: report.incidentType,
        severity: report.severity,
        structuredFields: report.structuredFields,
        evidence: [],
      },
    },
    {
      destinationId: LEGAL_AID_DESTINATION_ID,
      destinationKey: "legal-aid-nsw",
      destinationType: "legal_aid",
      destinationName: "Legal Aid NSW",
      reason:
        "Suggested because it matches the report incident type \"domestic_violence\", serves NSW, supports booking link routing.",
      channel: "booking_link",
      jurisdiction: "NSW",
      languages: ["en"],
      endpoint:
        "https://www.legalaid.nsw.gov.au/ways-to-get-help/apply-for-legal-aid",
      contactPhone: "1300 888 529",
      minimumRequiredInfo: ["summary"],
      missingRequiredInfo: [],
      anonymityOptions: ["identified", "pseudonymous"],
      expectedNextSteps: [
        "Use the prepared summary to ask for information about legal options.",
      ],
      consentRequired: true,
      supportsAcknowledgement: false,
      requiredConsentFlags: ["share_with_agencies"],
      matchedIncidentTypes: ["domestic_violence"],
      payloadPreview: {
        refNo: report.refNo,
        title: report.context,
        summary: report.originalNarrative,
        language: report.language,
        jurisdiction: report.jurisdiction,
        incidentType: report.incidentType,
        severity: report.severity,
        structuredFields: report.structuredFields,
        evidence: [],
      },
    },
  ];

  await page.route(API_ROUTE, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const method = request.method();

    if (pathname.endsWith("/sessions/anonymous")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ sessionToken: "e2e-session-token" })),
      });
      return;
    }

    if (pathname.endsWith("/auth/me")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            user: {
              id: "user-e2e",
              email: "e2e@safespeak.test",
              fullName: "SafeSpeak E2E User",
              role: "public_user",
              status: "active",
              isEmailVerified: true,
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/consents/current")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            consent: {
              cloud_sync: true,
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
              cloud_sync: true,
              process_with_ai: true,
              share_with_agencies: true,
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith("/rag/timeline-assistant")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ answer: "No cited answer.", citations: [] })),
      });
      return;
    }

    if (pathname.endsWith("/reports") && method === "POST") {
      const payload = request.postDataJSON() as Partial<typeof report>;

      if (
        payload.structuredFields &&
        "incidentTitle" in payload.structuredFields
      ) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            message: "Validation failed",
          }),
        });
        return;
      }

      report = {
        ...report,
        ...payload,
        _id: REPORT_ID,
        refNo: report.refNo,
      };
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ report })),
      });
      return;
    }

    if (pathname.endsWith("/reports") && method === "GET") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ reports: [report] })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}`) && method === "GET") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ report })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}`) && method === "PATCH") {
      const payload = request.postDataJSON() as Partial<typeof report>;

      if (
        payload.structuredFields &&
        "incidentTitle" in payload.structuredFields
      ) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            message: "Validation failed",
          }),
        });
        return;
      }

      report = {
        ...report,
        ...payload,
        _id: REPORT_ID,
        refNo: report.refNo,
      };
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ report })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}/status`)) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(
          apiEnvelope({
            status: {
              id: REPORT_ID,
              refNo: report.refNo,
              current: report.status,
              status: report.status,
            },
          })
        ),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}/timeline`)) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ timeline: [] })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}/evidence`)) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ evidence: [] })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}/destinations`)) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ destinations: adminDestinations })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}/submissions`) && method === "GET") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ submissions: submission ? [submission] : [] })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}/submissions`) && method === "POST") {
      submissionPostCount += 1;
      const payload = request.postDataJSON() as {
        destinationId: string;
        anonymityMode?: string;
        notes?: string;
        confirmConsent?: boolean;
      };

      submission = {
        _id: LEGAL_AID_SUBMISSION_ID,
        reportId: REPORT_ID,
        destinationId: payload.destinationId,
        destinationKey: "legal-aid-nsw",
        destinationType: "legal_aid",
        destinationName: "Legal Aid NSW",
        channel: "booking_link",
        jurisdiction: "NSW",
        languages: ["en"],
        status: "requires_manual_action",
        anonymityMode: payload.anonymityMode ?? "identified",
        minimumRequiredInfo: ["summary"],
        missingRequiredInfo: [],
        requiredConsentFlags: ["share_with_agencies"],
        expectedNextSteps: [
          "Use the prepared summary to ask for information about legal options.",
        ],
        notes: payload.notes,
        payloadSnapshot: {},
        evidenceSnapshot: [],
        consentSnapshot: { share_with_agencies: true },
        deliveryArtifacts: [],
        deliveryMessage: "Booking/link destination prepared for manual follow-through",
        deliveryMode: "manual",
        deliveryConfigurationStatus: "manual_action",
        deliveryConfigurationIssues: [],
        actuallySent: false,
        createdAt: new Date("2026-07-12T00:00:00.000Z").toISOString(),
      };

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ submission })),
      });
      return;
    }

    if (pathname.endsWith(`/reports/${REPORT_ID}/submission-previews`)) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(apiEnvelope({ previews: [] })),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: `Unhandled ${pathname}` }),
    });
  });

  return {
    getSubmissionPostCount: () => submissionPostCount,
  };
}

test("evidence review share flow submits the Legal Aid NSW booking-link handoff once", async ({
  page,
}) => {
  const api = await mockAdminDestinationApi(page);
  await page.goto("/dashboard?view=reportsubmissionevidence");
  await page.evaluate(() => {
    sessionStorage.removeItem("safespeak_report_flow_draft");
    localStorage.removeItem("safespeak_report_evidence_draft");
  });
  await page.goto("/dashboard?view=reportsubmissionevidence");

  const safetyGate = page.getByRole("dialog", { name: "Before you continue" });
  if (await safetyGate.isVisible()) {
    await safetyGate
      .getByRole("checkbox", {
        name: "I am in a safe place and want to continue.",
      })
      .check();
    await safetyGate.getByRole("button", { name: "Continue safely" }).click();
    await expect(safetyGate).toBeHidden();
  }

  await page.getByRole("textbox", { name: "Incident title" }).fill("Domestic violence incident report");
  await page.getByRole("textbox", { name: "Date" }).fill("2026-07-12");
  await page.getByRole("textbox", { name: "Location" }).fill("Sydney, NSW");
  await page.getByRole("textbox", { name: "What happened" }).fill(INCIDENT_TEXT);

  await page.getByRole("button", { name: "Continue to Review" }).click();
  await expect(page).toHaveURL(/view=reportsubmissionreview/);
  await expect(page.getByText("Contact option", { exact: false })).toBeVisible();
  await expect(page.getByText("NSW Police")).toBeVisible();

  await page.goto(
    `/dashboard?view=reportsubmissionshare&destinationId=${LEGAL_AID_DESTINATION_ID}`
  );
  await expect(page.getByRole("heading", { name: "Legal Aid NSW" }).first()).toBeVisible();
  await expect(page.getByText("Awaiting recipient selection")).toHaveCount(0);

  await page.getByRole("button", { name: "Share report securely" }).click();
  await expect(
    page.getByText(`SafeSpeak submission reference ${LEGAL_AID_SUBMISSION_ID}.`).first()
  ).toBeVisible();
  await expect(page.getByText("No external report was sent by SafeSpeak.").first()).toBeVisible();
  expect(api.getSubmissionPostCount()).toBe(1);

  await expect(page.getByRole("button", { name: "Share report securely" })).toBeDisabled();
  expect(api.getSubmissionPostCount()).toBe(1);

  await page.reload();
  await expect(
    page.getByText(`SafeSpeak submission reference ${LEGAL_AID_SUBMISSION_ID}.`).first()
  ).toBeVisible();
});
