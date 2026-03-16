import type { SafeSpeakInterpreterLanguage } from "./safespeak-profile";

export type SmartDialerContactId =
  | "emergency"
  | "policeAssistance"
  | "respect"
  | "lifeline"
  | "kidsHelpline"
  | "lawAccess"
  | "tisNational";

export interface SmartDialerContact {
  id: SmartDialerContactId;
  label: string;
  description: string;
  numberDisplay: string;
  numberDial: string;
  availability: string;
  sourceLabel: string;
  sourceUrl: string;
  accentClassName: string;
}

export const smartDialerContacts: SmartDialerContact[] = [
  {
    id: "emergency",
    label: "Emergency",
    description: "Triple Zero for urgent police, ambulance, or fire support.",
    numberDisplay: "000",
    numberDial: "000",
    availability: "24/7",
    sourceLabel: "NSW Police",
    sourceUrl: "https://www.police.nsw.gov.au/safety_and_prevention/emergency_management/in_an_emergency",
    accentClassName: "bg-[#dc2626]",
  },
  {
    id: "policeAssistance",
    label: "Police Assistance Line",
    description: "Non-urgent police help in NSW.",
    numberDisplay: "131 444",
    numberDial: "131444",
    availability: "24/7",
    sourceLabel: "NSW Police",
    sourceUrl: "https://www.police.nsw.gov.au/contact_us",
    accentClassName: "bg-[#0f5d9f]",
  },
  {
    id: "respect",
    label: "1800RESPECT",
    description:
      "Domestic, family, and sexual violence counselling, information, and support.",
    numberDisplay: "1800 737 732",
    numberDial: "1800737732",
    availability: "24/7",
    sourceLabel: "1800RESPECT",
    sourceUrl: "https://1800respect.org.au/calling-1800respect",
    accentClassName: "bg-[#0f5d9f]",
  },
  {
    id: "lifeline",
    label: "Lifeline",
    description: "Crisis support and suicide prevention.",
    numberDisplay: "13 11 14",
    numberDial: "131114",
    availability: "24/7",
    sourceLabel: "Lifeline",
    sourceUrl: "https://www.lifeline.org.au/131114/",
    accentClassName: "bg-[#15803d]",
  },
  {
    id: "kidsHelpline",
    label: "Kids Helpline",
    description: "Counselling for children and young people.",
    numberDisplay: "1800 55 1800",
    numberDial: "1800551800",
    availability: "24/7",
    sourceLabel: "Kids Helpline",
    sourceUrl: "https://kidshelpline.com.au/",
    accentClassName: "bg-[#7c3aed]",
  },
  {
    id: "lawAccess",
    label: "LawAccess NSW",
    description: "Legal information and referral for NSW.",
    numberDisplay: "1300 888 529",
    numberDial: "1300888529",
    availability: "Mon-Fri, 9am-5pm",
    sourceLabel: "Legal Aid NSW",
    sourceUrl: "https://www.legalaid.nsw.gov.au/contact-us",
    accentClassName: "bg-[#f59e0b]",
  },
  {
    id: "tisNational",
    label: "TIS National",
    description: "Immediate phone interpreter connection within Australia.",
    numberDisplay: "131 450",
    numberDial: "131450",
    availability: "24/7",
    sourceLabel: "TIS National",
    sourceUrl: "https://www.tisnational.gov.au/en/Contact-us",
    accentClassName: "bg-[#111827]",
  },
];

function interpreterLine(
  interpreterLanguage: SafeSpeakInterpreterLanguage,
  locale: "en" | "es"
): string {
  if (interpreterLanguage === "English") {
    return locale === "es"
      ? "Puedo continuar en espanol si es posible."
      : "I can continue in English.";
  }

  return locale === "es"
    ? `Necesito un interprete en ${interpreterLanguage}. Si hace falta, conecten TIS National al 131 450.`
    : `I need an interpreter in ${interpreterLanguage}. If needed, please connect TIS National on 131 450.`;
}

export function buildSmartDialerScript(
  contactId: SmartDialerContactId,
  interpreterLanguage: SafeSpeakInterpreterLanguage,
  locale: "en" | "es"
): string[] {
  const isSpanish = locale === "es";
  const interpreter = interpreterLine(interpreterLanguage, locale);

  if (contactId === "emergency") {
    return isSpanish
      ? [
          "Hola. Necesito ayuda urgente ahora mismo.",
          "Mi ubicacion es: [agrega tu direccion o punto de referencia].",
          "No es seguro para mi hablar mucho tiempo.",
          interpreter,
        ]
      : [
          "Hello. I need urgent help right now.",
          "My location is: [add your address or nearest landmark].",
          "It is not safe for me to speak for long.",
          interpreter,
        ];
  }

  if (contactId === "policeAssistance") {
    return isSpanish
      ? [
          "Quiero reportar un incidente que no es una emergencia.",
          "Necesito orientacion sobre la forma mas segura de documentarlo.",
          interpreter,
        ]
      : [
          "I need to report a non-emergency incident.",
          "I need guidance on the safest way to document and report it.",
          interpreter,
        ];
  }

  if (contactId === "respect") {
    return isSpanish
      ? [
          "Necesito apoyo confidencial y planificacion de seguridad.",
          "Puede que no sea seguro para mi hablar mucho tiempo.",
          interpreter,
        ]
      : [
          "I need confidential support and safety planning.",
          "It may not be safe for me to stay on the phone for long.",
          interpreter,
        ];
  }

  if (contactId === "lifeline") {
    return isSpanish
      ? [
          "Necesito apoyo emocional urgente ahora.",
          "No estoy en peligro fisico inmediato, pero necesito hablar con alguien.",
          interpreter,
        ]
      : [
          "I need urgent emotional support right now.",
          "I am not in immediate physical danger, but I need to speak with someone urgently.",
          interpreter,
        ];
  }

  if (contactId === "kidsHelpline") {
    return isSpanish
      ? [
          "Soy joven y necesito hablar con alguien de forma segura.",
          "Necesito apoyo confidencial y no se cual es el siguiente paso.",
          interpreter,
        ]
      : [
          "I am young and I need to speak with someone safely.",
          "I need confidential support and I am not sure what the next safe step is.",
          interpreter,
        ];
  }

  if (contactId === "lawAccess") {
    return isSpanish
      ? [
          "Necesito informacion sobre mis opciones en Nueva Gales del Sur.",
          "No busco consejo legal definitivo en esta llamada; necesito entender mis proximos pasos.",
          interpreter,
        ]
      : [
          "I need information about my options in New South Wales.",
          "I am not seeking final legal advice on this call; I need to understand my next steps.",
          interpreter,
        ];
  }

  return isSpanish
    ? [
        "Necesito un interprete por telefono.",
        `Conectenme en ${interpreterLanguage}.`,
        "Despues, por favor llamen al servicio que necesito.",
      ]
    : [
        "I need a phone interpreter.",
        `Please connect me in ${interpreterLanguage}.`,
        "After that, please call the service I need.",
      ];
}
