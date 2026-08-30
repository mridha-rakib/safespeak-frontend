import type { UrlObject } from "url";

import type { AssistantIncidentCategory } from "@/lib/assistant-categories";

export type DashboardCardFlowId =
  | "domestic_violence"
  | "racial_abuse"
  | "cyber_scam"
  | "migrant_challenges"
  | "general_assistant"
  | "scamshield"
  | "resources"
  | "local_intelligence"
  | "micro_cards"
  | "workplace_issue"
  | "school_issue"
  | "online_abuse"
  | "other";

export type DashboardFlowType =
  | "safety_support_report"
  | "report_guidance"
  | "scam_analysis"
  | "support_guidance"
  | "general_assistant"
  | "learning";

export type DashboardFlowActionId =
  | "start_report"
  | "find_support"
  | "safety_plan"
  | "talk_with_assistant"
  | "understand_reporting_options"
  | "save_evidence"
  | "interpreter_guidance"
  | "quick_exit";

export type DashboardFlowAction = {
  id: DashboardFlowActionId;
  label: string;
  description: string;
};

export type DashboardCardFlow = {
  id: DashboardCardFlowId;
  title: string;
  categoryKey?: AssistantIncidentCategory | "general_assistant";
  flowType: DashboardFlowType;
  targetView: string;
  starterPrompt?: string;
  safetyLevel: "low" | "medium" | "high";
  nextActions: DashboardFlowAction[];
  disclaimers: string[];
};

const dashboardCardFlows: Record<DashboardCardFlowId, DashboardCardFlow> = {
  domestic_violence: {
    id: "domestic_violence",
    title: "Domestic Violence",
    categoryKey: "domestic_violence",
    flowType: "safety_support_report",
    targetView: "assistant",
    starterPrompt:
      "I may be experiencing domestic or family violence and I want to understand safe options.",
    safetyLevel: "high",
    nextActions: [
      {
        id: "start_report",
        label: "Start a safe report",
        description: "Open the report flow with domestic violence context.",
      },
      {
        id: "find_support",
        label: "Find support services",
        description: "Browse support services with domestic violence context.",
      },
      {
        id: "safety_plan",
        label: "Create safety plan",
        description: "Go to support guidance with safety planning focus.",
      },
      {
        id: "talk_with_assistant",
        label: "Talk with SafeSpeak",
        description: "Start a guided assistant conversation with this topic.",
      },
      {
        id: "quick_exit",
        label: "Use Quick Exit",
        description: "Leave the page immediately if it is not safe to continue.",
      },
    ],
    disclaimers: [
      "SafeSpeak is not a crisis service.",
      "If you are in immediate danger, call 000.",
      "If it is safe, contact 1800RESPECT.",
      "This information is general information only.",
    ],
  },
  racial_abuse: {
    id: "racial_abuse",
    title: "Racial Abuse",
    categoryKey: "racial_abuse",
    flowType: "report_guidance",
    targetView: "assistant",
    starterPrompt:
      "I experienced racial abuse and want to understand my options safely.",
    safetyLevel: "medium",
    nextActions: [
      {
        id: "start_report",
        label: "Start incident report",
        description: "Open the report flow with racial abuse context.",
      },
      {
        id: "understand_reporting_options",
        label: "Understand reporting options",
        description: "Open guided reporting options with SafeSpeak.",
      },
      {
        id: "find_support",
        label: "Find support",
        description: "Browse support services and community support options.",
      },
      {
        id: "save_evidence",
        label: "Save evidence",
        description: "Go to the evidence step with this topic in context.",
      },
      {
        id: "talk_with_assistant",
        label: "Talk with SafeSpeak",
        description: "Start a guided assistant conversation with this topic.",
      },
    ],
    disclaimers: ["This information is general information only."],
  },
  cyber_scam: {
    id: "cyber_scam",
    title: "Cyber Scam",
    categoryKey: "cyber_scam",
    flowType: "scam_analysis",
    targetView: "scamshieldintake",
    starterPrompt:
      "I think I may be dealing with a cyber scam and need help assessing it.",
    safetyLevel: "medium",
    nextActions: [],
    disclaimers: ["Analysis starts only after you submit content for review."],
  },
  migrant_challenges: {
    id: "migrant_challenges",
    title: "Migrant Challenges",
    categoryKey: "migrant_challenges",
    flowType: "support_guidance",
    targetView: "assistant",
    starterPrompt:
      "I am facing migrant-related challenges and want safe, culturally appropriate guidance.",
    safetyLevel: "medium",
    nextActions: [
      {
        id: "find_support",
        label: "Find migrant support services",
        description: "Browse support services with migrant support context.",
      },
      {
        id: "understand_reporting_options",
        label: "Understand workplace/housing/school options",
        description: "Start a guided options conversation for this topic.",
      },
      {
        id: "interpreter_guidance",
        label: "Ask for interpreter guidance",
        description: "Open support with interpreter and access needs in mind.",
      },
      {
        id: "start_report",
        label: "Start a report",
        description: "Open the report flow with migrant challenge context.",
      },
      {
        id: "talk_with_assistant",
        label: "Talk with SafeSpeak",
        description: "Start a guided assistant conversation with this topic.",
      },
    ],
    disclaimers: ["This information is general information only."],
  },
  general_assistant: {
    id: "general_assistant",
    title: "Let’s talk with SafeSpeak",
    categoryKey: "general_assistant",
    flowType: "general_assistant",
    targetView: "assistant",
    safetyLevel: "medium",
    nextActions: [],
    disclaimers: ["Choose a topic or start in general conversation."],
  },
  scamshield: {
    id: "scamshield",
    title: "ScamShield",
    categoryKey: "cyber_scam",
    flowType: "scam_analysis",
    targetView: "scamshieldintake",
    starterPrompt:
      "I think I may be dealing with a cyber scam and need help assessing it.",
    safetyLevel: "medium",
    nextActions: [],
    disclaimers: ["Analysis starts only after you submit content for review."],
  },
  resources: {
    id: "resources",
    title: "Resources",
    flowType: "learning",
    targetView: "resources",
    safetyLevel: "low",
    nextActions: [],
    disclaimers: [
      "Browse learning resources without starting an AI or report flow.",
    ],
  },
  local_intelligence: {
    id: "local_intelligence",
    title: "Local Intelligence",
    flowType: "learning",
    targetView: "localintelligence",
    safetyLevel: "low",
    nextActions: [],
    disclaimers: [],
  },
  micro_cards: {
    id: "micro_cards",
    title: "Micro-Cards",
    flowType: "learning",
    targetView: "microcards",
    safetyLevel: "low",
    nextActions: [],
    disclaimers: [],
  },
  workplace_issue: {
    id: "workplace_issue",
    title: "Workplace Issue",
    flowType: "general_assistant",
    targetView: "assistantconversation",
    starterPrompt:
      "I am dealing with a workplace issue and want to understand safe next steps.",
    safetyLevel: "medium",
    nextActions: [],
    disclaimers: ["This information is general information only."],
  },
  school_issue: {
    id: "school_issue",
    title: "School Issue",
    flowType: "general_assistant",
    targetView: "assistantconversation",
    starterPrompt:
      "I am dealing with a school-related issue and want to understand safe next steps.",
    safetyLevel: "medium",
    nextActions: [],
    disclaimers: ["This information is general information only."],
  },
  online_abuse: {
    id: "online_abuse",
    title: "Online Abuse",
    flowType: "general_assistant",
    targetView: "assistantconversation",
    starterPrompt:
      "I am experiencing online abuse and want to understand safe options.",
    safetyLevel: "medium",
    nextActions: [],
    disclaimers: ["This information is general information only."],
  },
  other: {
    id: "other",
    title: "Other",
    flowType: "general_assistant",
    targetView: "assistantconversation",
    starterPrompt:
      "Something happened and I want help understanding my options safely.",
    safetyLevel: "medium",
    nextActions: [],
    disclaimers: ["This information is general information only."],
  },
};

const supportedFlowIds = Object.keys(dashboardCardFlows) as DashboardCardFlowId[];

export function isDashboardCardFlowId(
  value: string | undefined
): value is DashboardCardFlowId {
  return Boolean(value && supportedFlowIds.includes(value as DashboardCardFlowId));
}

export function getDashboardCardFlow(id: DashboardCardFlowId): DashboardCardFlow {
  return dashboardCardFlows[id];
}

export function getDashboardAssistantTopicChips(): DashboardCardFlow[] {
  return [
    dashboardCardFlows.domestic_violence,
    dashboardCardFlows.racial_abuse,
    dashboardCardFlows.cyber_scam,
    dashboardCardFlows.migrant_challenges,
    dashboardCardFlows.workplace_issue,
    dashboardCardFlows.school_issue,
    dashboardCardFlows.online_abuse,
    dashboardCardFlows.other,
  ];
}

export function getDashboardCardEntryHref(id: DashboardCardFlowId): UrlObject {
  const flow = getDashboardCardFlow(id);

  if (flow.targetView === "scamshieldintake") {
    return {
      pathname: "/dashboard",
      query: {
        view: "scamshieldintake",
        topic: flow.id,
        category: flow.categoryKey === "cyber_scam" ? "cyber_scam" : undefined,
      },
    };
  }

  if (flow.targetView === "microeducation") {
    return {
      pathname: "/dashboard",
      query: { view: "microeducation", topic: flow.id },
    };
  }

  if (flow.targetView === "resources") {
    return {
      pathname: "/dashboard",
      query: { view: "resources", topic: flow.id },
    };
  }

  if (flow.targetView === "localintelligence") {
    return {
      pathname: "/dashboard",
      query: { view: "localintelligence", topic: flow.id },
    };
  }

  if (flow.targetView === "microcards") {
    return {
      pathname: "/dashboard",
      query: { view: "microcards", topic: flow.id },
    };
  }

  return {
    pathname: "/dashboard",
    query: {
      view: "assistant",
      topic: flow.id,
      category:
        flow.categoryKey && flow.categoryKey !== "general_assistant"
          ? flow.categoryKey
          : undefined,
    },
  };
}

export function getDashboardAssistantEntryHref(
  id: DashboardCardFlowId
): UrlObject {
  return {
    pathname: "/dashboard",
    query: {
      view: "assistant",
      topic: id,
    },
  };
}

export function getDashboardActionHref(
  flowId: DashboardCardFlowId,
  actionId: DashboardFlowActionId
): UrlObject | null {
  const flow = getDashboardCardFlow(flowId);
  const category =
    flow.categoryKey && flow.categoryKey !== "general_assistant"
      ? flow.categoryKey
      : undefined;
  const message = flow.starterPrompt;

  switch (actionId) {
    case "start_report":
      return {
        pathname: "/dashboard",
        query: {
          view: "reportsubmissiondetails",
          topic: flow.id,
          category,
          message,
        },
      };
    case "find_support":
      return {
        pathname: "/dashboard/explorer",
        query: {
          category,
          topic: flow.id,
        },
      };
    case "safety_plan":
      return {
        pathname: "/dashboard/explorer",
        query: {
          category,
          topic: flow.id,
          focus: "safety_plan",
        },
      };
    case "talk_with_assistant":
      return {
        pathname: "/dashboard",
        query: {
          view: "assistantconversation",
          topic: flow.id,
          category,
          prefillMessage: message,
        },
      };
    case "understand_reporting_options":
      return {
        pathname: "/dashboard",
        query: {
          view: "assistantconversation",
          topic: flow.id,
          category,
          prefillMessage:
            flowId === "racial_abuse"
              ? "I want to understand my safe reporting options after racial abuse."
              : flowId === "migrant_challenges"
                ? "I want to understand my workplace, housing, or school options safely."
                : message,
        },
      };
    case "save_evidence":
      return {
        pathname: "/dashboard",
        query: {
          view: "reportsubmissionevidence",
          topic: flow.id,
          category,
        },
      };
    case "interpreter_guidance":
      return {
        pathname: "/dashboard/explorer",
        query: {
          category,
          topic: flow.id,
          focus: "interpreter_guidance",
        },
      };
    case "quick_exit":
      return null;
  }
}
