# Report Incident Progress

Last updated: 2026-07-08

## Scope

This note tracks the current implementation status of the `report incident` flow across the SafeSpeak repos, based on:

- the current frontend implementation in `safespeak-frontend`
- the PDF requirements in `Safespeak (2).docx.pdf`
- the latest frontend implementation commit:
  - `5a6e3f8` - `Complete report incident flow handoff and backend-backed review`

## Repos Touched

- `safespeak-frontend`: yes
- `safespeak-backend`: no code changes in this pass
- `safespeak-ai-agent`: no code changes in this pass

## Overall Status

### Practical current flow status

For the implemented user flow:

`Details -> Evidence -> Review -> Support/Triage -> Recommendations/Details -> Share -> Success/History`

Current status: `mostly complete`

Rough implementation status:

- Core frontend flow completion: `80-85%`
- Full PDF vision completion for Report Incident / Route Engine: `55-65%`

The gap exists because the PDF describes a broader product scope than the currently implemented route-and-submit flow.

## What Is Completed

### 1. Review to Share handoff is real

Completed:

- review page no longer creates a fake `prepared_only` result
- review page prepares destination selection and review metadata only
- share page is the single final submit authority
- final outbound send happens only from share page
- success page reflects actual recorded delivery state

Key result:

- no fake "shared" state is created just by leaving review

### 2. Destination and submission flow is backend-backed

Completed:

- selected destination is preserved from review to share
- share page submits through real backend destination APIs
- success page and history page use real submission records
- history now distinguishes:
  - actually sent
  - manual follow-up recorded
  - config missing
  - failed

### 3. URL-backed recovery was added

Completed:

- `reportId`, `destinationId`, and `submissionId` can be carried in URL query state
- share and success pages can recover flow state after refresh or direct open
- flow is no longer only dependent on `sessionStorage`

### 4. Review page local pseudo-state was reduced

Completed:

- backend load failure no longer falls back to a fake local review timeline
- review page now prefers backend sync and authoritative backend fields
- user cannot continue to secure sharing when review state is not properly synced

### 5. Evidence flow is no longer local-only for attachments

Completed:

- `local-only` evidence attach path removed
- evidence must be uploaded to backend evidence vault
- continue-to-review is blocked if evidence is not backend-backed
- restored draft text may exist, but evidence files must be re-uploaded for real use

### 6. Hardcoded fallback recommendation/detail content was removed

Completed:

- recommendations page no longer shows frontend-invented fallback cards
- detailed explanations page no longer shows frontend-invented fallback guidance
- missing or unavailable live data now shows explicit SafeSpeak status notices

### 7. Support page guessed triage fallback was removed

Completed:

- support page no longer fabricates a fallback triage path when session/backend data is missing
- live support page rendering now depends on real triage/session data
- otherwise user sees a clear status notice and return actions

### 8. Continuity cache was tightened

Completed:

- share and success pages refresh draft continuity from backend-authoritative state
- stale local `preparedSubmission` metadata is less likely to drift from real backend data
- evidence draft restore no longer resurrects fake attachment cards

## What Is Partial

These are not fake anymore, but they are still not the full product vision from the PDF.

### 1. Session/local continuity still exists

Current state:

- `sessionStorage` is still used for temporary form continuity
- local draft save still exists for evidence page text fields

Meaning:

- this is now a convenience cache, not the source of truth
- backend state is preferred where available

### 2. Single story to multiple destinations is only partially realized

Current state:

- multiple destination previews exist
- destination recommendation and preview logic exists
- actual final send still behaves mainly as a single active destination flow

Meaning:

- "single story -> multiple destination forms" is partially implemented in preview/recommendation terms
- not fully implemented as a complete one-click multi-forward orchestration flow

### 3. Success state still carries draft continuity metadata

Current state:

- `preparedSubmission` still exists in draft state

Meaning:

- it is no longer a fake submission result
- but it still acts as UI continuity metadata in some paths

## What Is Still Missing Relative To The PDF

These are the main remaining gaps compared with the document requirements.

### 1. Offline queueing

PDF requirement:

- capture offline and queue secure upload later

Status:

- not implemented as a full offline queue workflow

### 2. Full multi-destination final submission

PDF requirement:

- one story reused across multiple destination forms
- user selects destination(s)
- previews each submission
- consents and submits

Status:

- destination preview is there
- complete multi-destination final forwarding workflow is not fully implemented

### 3. Translation packaging

PDF requirement:

- native language input plus English translation attached together

Status:

- not fully implemented as a formal route-package guarantee

### 4. Submission fallback methods

PDF requirement:

- preferred API integration
- fallback secure email with structured PDF/JSON and hashed evidence

Status:

- current implementation assumes backend submission route exists
- secure email / PDF / JSON fallback path is not fully implemented in this pass

### 5. Destination acknowledgement lifecycle

PDF requirement:

- Submitted / Received / Closed style lifecycle with acknowledgements where supported

Status:

- basic outcome display exists
- broader acknowledgement polling / limited status pings are not fully implemented

### 6. Clarifying question loop tightly attached to report builder

PDF requirement:

- after timeline extraction, system asks clarifying questions if needed

Status:

- triage/support/recommendation ecosystem exists
- a complete report-builder-native clarification loop is still partial

### 7. Smart dialler / call-prep integration in report incident flow

PDF requirement:

- call preparation, interpreter guidance, covert assistance instructions

Status:

- not fully integrated into the current report incident submission flow

### 8. Full route-engine fallback document export

PDF requirement:

- structured PDF / JSON route output

Status:

- not completed in this pass

## Mapping Against PDF Requirements

### Incident Builder

PDF reference:

- structured field extraction and editable timeline

Status: `mostly done`

Notes:

- editable timeline exists
- backend-backed timeline sync exists
- no full offline queue mode yet

### Understand / Explainers / Q&A

PDF reference:

- issue classification
- lawful pathways
- support options
- information-only disclaimers

Status: `partially done`

Notes:

- live recommendations/details/support flows exist
- fake fallback content removed
- broader legal/rights depth from PDF remains larger than current implementation

### Report & Route Engine

PDF reference:

- single story capture
- destination recommender
- anonymity options
- required info
- consent per destination
- submission record
- SafeSpeak reference ID

Status: `mostly done for single-destination flow, partial for full multi-destination orchestration`

### Epic: Single Story -> Multi Destination

PDF reference:

- input narrative
- auto structured fields
- previews for each destination
- forwarded with consent

Status: `partial to mostly done`

Notes:

- narrative reuse, previews, consent, and route flow exist
- full multi-destination forward orchestration is still not complete

## Files Most Relevant To Future Work

### Core flow

- `src/components/dashboard/dashboard-report-submission-pages/report-submission-details-page.tsx`
- `src/components/dashboard/dashboard-report-submission-pages/report-submission-evidence-page.tsx`
- `src/components/dashboard/dashboard-report-submission-pages/report-submission-review-page.tsx`
- `src/components/dashboard/dashboard-report-submission-pages/report-submission-share-page.tsx`
- `src/components/dashboard/dashboard-report-submission-pages/report-submission-success-page.tsx`
- `src/components/dashboard/dashboard-report-submission-pages/report-submission-history-page.tsx`

### Triage/support ecosystem

- `src/components/dashboard/dashboard-report-submission-pages/report-submission-support-page.tsx`
- `src/components/dashboard/dashboard-report-submission-pages/report-submission-recommendations-page.tsx`
- `src/components/dashboard/dashboard-report-submission-pages/report-submission-detailed-explanations-page.tsx`

### Shared logic

- `src/lib/report-flow.ts`
- `src/lib/report-authority-routing.ts`

## Recommended Next Steps

If work resumes later, the highest-value order is:

1. Implement true multi-destination final submission orchestration
2. Add export / secure email / PDF-JSON fallback path for destinations without API delivery
3. Add offline queue support for evidence and report sync
4. Tighten translation packaging so original and translated content are guaranteed in outbound payloads
5. Add E2E tests for the entire report incident path

## Validation Already Performed

- `npm run lint` passed after the report incident flow changes

Known note:

- the repo still has pre-existing unrelated lint warnings outside the core report incident work

## Commit Reference

Frontend commit containing the main flow completion work:

- `5a6e3f8` - `Complete report incident flow handoff and backend-backed review`
