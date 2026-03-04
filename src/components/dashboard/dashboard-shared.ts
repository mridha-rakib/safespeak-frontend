import { Inter } from "next/font/google";

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

// eslint-disable-next-line n/no-process-env
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const localIntelligenceMapSrc = googleMapsApiKey
  ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=-33.8688,151.2093&zoom=13&maptype=roadmap`
  : null;

type IncidentReportStatus = "in-review" | "submitted" | "draft";

type IncidentReport = {
  id: string;
  title: string;
  status: IncidentReportStatus;
  createdAt: string;
  location: string;
  narrative: string;
  supportKey: string;
  impactLevel: "High Priority" | "Moderate" | "Low";
};

const incidentReports: IncidentReport[] = [
  {
    id: "SS-2026-0421",
    title: "Harassment Incident - Wing A",
    status: "in-review",
    createdAt: "22 Feb, 2026 - 10:31 PM",
    location: "Terminal C, Gate 14",
    narrative:
      "I was walking through the gate area around 8:30 PM when I noticed two individuals following me closely. They were making comments in a low voice and later approached near Exit C.",
    supportKey: "KEY-8745",
    impactLevel: "High Priority",
  },
  {
    id: "SS-2026-0379",
    title: "Wellbeing Support Request",
    status: "draft",
    createdAt: "20 Feb, 2026 - 05:12 PM",
    location: "Online submission",
    narrative:
      "I am submitting an early support request related to repeated verbal pressure from a supervisor. This report is currently saved as a draft.",
    supportKey: "KEY-8624",
    impactLevel: "Moderate",
  },
  {
    id: "SS-2026-0316",
    title: "Safety Concern - Main Entry",
    status: "submitted",
    createdAt: "16 Feb, 2026 - 09:44 AM",
    location: "Main Entry Hall",
    narrative:
      "Suspicious loitering behavior was observed near the main entry. I submitted this report with timestamps and a brief witness summary.",
    supportKey: "KEY-8311",
    impactLevel: "Low",
  },
];

function findIncidentReport(reportId?: string): IncidentReport {
  if (!reportId) {
    return incidentReports[0];
  }

  return (
    incidentReports.find((report) => report.id === reportId) ??
    incidentReports[0]
  );
}

export {
  findIncidentReport,
  incidentReports,
  interFont,
  localIntelligenceMapSrc,
};

export type { IncidentReport, IncidentReportStatus };
