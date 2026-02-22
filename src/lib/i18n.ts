"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type SupportedLanguage = "en" | "es";

type LanguageOption = {
  code: SupportedLanguage;
  shortCode: string;
  labelKey: "navbar.language.english" | "navbar.language.spanish";
};

export const LANGUAGE_STORAGE_KEY = "safespeak-language";
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "en",
    shortCode: "US",
    labelKey: "navbar.language.english",
  },
  {
    code: "es",
    shortCode: "ES",
    labelKey: "navbar.language.spanish",
  },
];

const resources = {
  en: {
    translation: {
      navbar: {
        links: {
          whatIsSafeSpeak: "What is SafeSpeak",
          whatYouCanDoWithSafeSpeak: "What You Can Do with SafeSpeak",
          contactUs: "Contact Us",
        },
        login: "Login",
        language: {
          english: "English",
          spanish: "Spanish",
          chooseLanguage: "Choose language",
        },
      },
      hero: {
        titleAccent: "AN APP",
        titleMain: "THAT TALKS FOR YOU",
        titleSecondLine: "EMPOWERS YOU",
        subtitle: "Download the app now from our iOS & Android store.",
        alt: {
          sphere: "SafeSpeak sphere background",
          indicator: "Download indicator arrow",
          appStore: "Download on the App Store",
          googlePlay: "Get it on Google Play",
          qr: "SafeSpeak QR",
          appPreview: "SafeSpeak app preview",
          voicePreview: "SafeSpeak voice preview",
        },
      },
      footer: {
        tagline:
          "Helps you build strength, lose fat, and stay fit with expert guidance and science-backed training designed for lasting results.",
        social: {
          facebook: "Facebook",
          instagram: "Instagram",
          youtube: "YouTube",
        },
        quickLinksTitle: "Quick Links",
        aboutUs: "About us",
        whatDoesItDo: "What does it do",
        testimonials: "Testimonials",
        gallery: "Gallery",
        contactTitle: "Contact",
        addressLine1: "Pure Training West,",
        addressLine2: "SolmsstraBe 18, 60486",
        email: "info@personaltrainer101.com",
        phone: "+49177-384-0426",
        copyright: "(c) 2025 SafeSpeak. All rights reserved.",
        privacyPolicy: "Privacy Policy",
        termsOfUse: "Terms of Use",
      },
      landing: {
        problem: {
          label: "WHAT IS SAFESPEAK",
          titleLine1: "THE PROBLEM WE",
          titleLine2: "SOLVE",
          imageAlt: "SafeSpeak hand with phone",
          description:
            "The landscape around discrimination and harassment is complex. Many individuals experience workplace abuse, online harassment, or hate speech but feel:",
          bullets: {
            0: "Isolated and uncertain where to turn",
            1: "Confused about their rights and options",
            2: "Unable to access culturally sensitive support",
            3: "Fearful of reporting without guidance",
          },
          conclusion:
            "SafeSpeak changes that by offering clarity, safety, and community.",
          reportNow: "Report now!",
        },
        supportYourWay: {
          label: "Resources",
          title: "Support Your Way",
          subtitle:
            "Choose the path that feels right for you. From reporting to reading, we have tools to help.",
          natural: "NATURAL",
          cards: {
            reportIncident: {
              title: "Report an Incident",
              description:
                "Safely submit details about what happened. You can choose to remain anonymous or provide contact details for follow-up.",
              action: "Start Report",
            },
            trackCase: {
              title: "Track Your Case",
              description:
                "Already submitted a report? Use your unique access key to check your status or communicate with investigators.",
              action: "Check Status",
            },
            accessResources: {
              title: "Access Resources",
              description:
                "Browse our library of articles, legal guides, and mental health resources designed to empower you.",
              action: "Browse Library",
            },
            chatCounselor: {
              title: "Chat with a Counselor",
              description:
                "Connect instantly with a trained professional who can offer guidance and emotional support in real-time.",
              action: "Start Chat",
            },
          },
        },
        resources: {
          cards: {
            domesticViolence: {
              title: "Domestic Violence",
              description:
                "Abusive behavior used to control a partner. Find immediate safe shelter and legal protection.",
              badge: "SHIELD PROTECTION",
            },
            cyberProtection: {
              title: "Cyber Protection",
              subtitle: "Scam Shield",
              description:
                "Explore multiple prompt directions with branching to stay ahead of digital threats.",
              footerLeft: "Resources",
              footerRight: "Guidance",
            },
            empowermentLessons: {
              title: "Empowerment Lessons",
              description: "Micro-Cards\n4 Lessons - 21 mins",
              footerLeft: "Start Learning",
            },
          },
        },
        howItWorks: {
          title: "How It Works",
          steps: {
            capture: {
              title: "Capture",
              duration: "30 Seconds",
              description:
                "Quickly document the incident details. Our smart form guides you through the essential information via voice or text without overwhelming you.",
            },
            understand: {
              title: "Understand",
              duration: "1 Minute",
              description:
                "Our system analyzes the report context instantly. We categorize the severity and identify immediate support needs securely.",
            },
            connect: {
              title: "Connect",
              duration: "2 Minutes",
              description:
                "Securely link with the appropriate response team. You receive a unique, anonymous key to follow up without exposing your identity.",
            },
            takeAction: {
              title: "Take Action",
              duration: "1 Minute",
              description:
                "Resolution protocols are activated. The right stakeholders are notified immediately, ensuring swift and effective action.",
            },
          },
        },
        localIntelligence: {
          title: "Local Intelligence",
          currentLocation: "Current Location",
          activeZonesLine1: "3 Active Zones",
          activeZonesLine2: "Nearby",
        },
        communityImpact: {
          title: "Community Impact",
          testimonials: {
            0: {
              role: "Sanctuary Member",
              quote:
                "The Scam Shield helped me identify a threat before it was too late. I feel truly protected here.",
            },
            1: {
              role: "Legal Advocate",
              quote:
                "SafeSpeak isn't just an app, it's a lifeline. The integration of local intelligence and immediate reporting is game-changing.",
            },
            2: {
              role: "Community Leader",
              quote:
                "The micro-lessons on safety are so accessible. I've shared them with my entire neighborhood group.",
            },
          },
        },
        faq: {
          title: "FAQ",
          items: {
            0: {
              question: "How does SafeSpeak protect my identity?",
              answer:
                "SafeSpeak supports anonymous reporting and removes identifying metadata when privacy-safe mode is enabled.",
            },
            1: {
              question: "Can I continue a report later?",
              answer:
                "Yes. You can save a draft and continue anytime using your secure reference key.",
            },
            2: {
              question: "Do I need evidence to submit a report?",
              answer:
                "No. Evidence helps, but you can submit an initial report first and upload documents later.",
            },
            3: {
              question: "Can I use SafeSpeak from mobile?",
              answer:
                "Yes. SafeSpeak is optimized for mobile and desktop experiences.",
            },
            4: {
              question: "Is support available 24/7?",
              answer:
                "Yes. Help and support are available around the clock for urgent and non-urgent concerns.",
            },
          },
        },
      },
      common: {
        cancel: "Cancel",
        back: "Back",
        continue: "Continue",
        details: "Details",
        send: "Send",
        today: "Today",
        past: "Past",
      },
      dashboard: {
        nav: {
          home: "Home",
          explorer: "Explorer",
          notifications: "Notifications",
          settings: "Settings",
        },
        toolbar: {
          emergencyCall: "In case of emergency call (000)",
          quickExit: "Quick Exit",
          welcomeBack: "Welcome Back",
          userName: "Alex Rivera",
        },
        home: {
          cyber: "Cyber",
          scamShield: "SCAM SHIELD",
          legal: "Legal",
          resources: "RESOURCES",
          microCards: "Micro-Cards",
          lessons: "4 Lessons - 12 mins",
          localIntelligence: "Local Intelligence",
          currentLocation: "Current location",
          activeZonesNearby: "3 Active Zones Nearby",
          details: "Details",
        },
        microcards: {
          title: "Micro-Cards",
          cyberBullying: "Cyber Bullying",
          searchPlaceholder: "Search topics, laws, tips...",
          identifyingBullying: "Identifying Bullying",
          documentingEvidence: "Documenting Evidence",
          safeReporting: "Safe Reporting",
          digitalFootprints: "Digital Footprints",
          fourMinRead: "4 min read",
          readMore: "Read More",
        },
        microcardDetail: {
          safeSpeakEducation: "SafeSpeak Education",
          internetHoaxAwareness: "Internet hoax awareness",
          internet: "Internet",
          hoax: "Hoax",
          safetyEssentials: "Safety Essentials",
          stayingSafeOnline: "Staying Safe Online",
          digitalHarassmentOverview: "Digital Harassment Overview",
          overviewParagraph1:
            "Digital harassment includes a wide range of behaviors intended to threaten, intimidate, or harm individuals through electronic means. Recognizing these patterns is the first and most critical step toward regaining your peace of mind and establishing a secure digital environment.",
          keyTakeaway: "Key Takeaway",
          keyTakeawayBody:
            "Understanding the nature of online threats empowers you to take actionable steps to protect your identity and mental well-being.",
          overviewParagraph2:
            "Your safety is the highest priority. Whether it involves blocking suspicious accounts, adjusting privacy settings, or documenting incidents for potential reporting, small, consistent steps lead to significant protection. Remember that you have the right to a safe online experience.",
          previousMicrocards: "Previous Micro-Cards",
          nextMicrocards: "Next Micro-Cards",
          educationalDisclaimer:
            "This is educational information only. Always follow professional advice.",
        },
        microeducation: {
          title: "MicroEducation",
          headline: "Learn. Protect. Thrive.",
          subtitleLine1:
            "Quick lessons on rights, online safety, mental health, and everyday hazards.",
          subtitleLine2:
            "Empowering you with the knowledge to stay safe and secure.",
          allLessons: "All Lessons",
          harassment: "Harassment",
          rights: "Rights",
          safety: "Safety",
          mentalHealth: "Mental Health",
          bullying: "Bullying",
          discrimination: "Discrimination",
          discriminationBody:
            "Discrimination occurs when employees are treated unfairly for personal traits.",
          protection: "Protection",
          onlineSafetyBody:
            "Protect your digital footprint & data from potential online threats.",
          getProtected: "Get Protected",
          migrantStudentRights: "Migrant & Student Rights",
          mental: "Mental",
          mentalHealthTitle: "Mental Health",
          fundamentals: "Fundamentals",
          legalAidBasics: "Legal Aid Basics",
          startNow: "Start Now",
        },
        assistant: {
          timelineBuilder: "Timeline Builder",
          continueToReportSubmission: "Continue to report submission",
          userName: "Raihan",
          greetingPrefix: "Hi",
          greetingSuffix: ", can you remind me, how can I help you today?",
          sphereAlt: "SafeSpeak assistant sphere",
          realTimeTranscript: "Real-Time Transcript",
          listening: "Listening...",
          typeYourResponse: "Type your response...",
          toggleMicrophone: "Toggle microphone",
          stopRecording: "Stop Recording",
          metadataCapture: "Metadata Capture",
          metadataDescription: "GPS & Device Intelligence",
          toggleMetadataCapture: "Toggle metadata capture",
          tapToStartRecording: "Tap to start recording",
          speechNotSupported: "Speech not supported",
          speechErrors: {
            permissionDenied:
              "Microphone access was denied. Please allow microphone permission and try again.",
            noMicrophone:
              "No microphone was found. Please connect a microphone and try again.",
            noSpeech: "No speech detected. Try speaking closer to your microphone.",
            network: "A network issue occurred while processing speech.",
            startFailed: "Voice recording could not be started. Please try again.",
            unsupported: "Speech recognition is not supported in this browser.",
          },
          conversation: {
            botPromptWho:
              "I'm helping you structure your report. Who was involved in this incident?",
            defaultUserReply:
              "It was a manager from the logistics department and two witnesses.",
            botPromptWhere:
              "Thank you. Can you describe where exactly in the office this occurred?",
            liveTimelineBuilder: "Live Timeline Builder",
            updating: "Updating",
            who: "Who",
            whoValue: "Manager & 2 Witnesses",
            what: "What",
            waitingForDetails: "Waiting for details...",
            where: "Where",
            processingFromTranscript: "Processing from transcript...",
            moreFields: "More fields will appear as you chat",
          },
        },
        reportSubmission: {
          reportSubmission: "Report Submission",
          incidentBuilder: "Incident Builder",
          stepOf: "Step {{current}} of {{total}}",
          supportTitle: "Mental Health Support",
          supportSubtitle:
            "We can connect you with the right support while you continue your report.",
          detailsTitle: "Incident Details",
          detailsSubtitle:
            "Capture key facts clearly so the right team can respond quickly.",
          evidenceTitle: "Evidence Upload",
          evidenceSubtitle:
            "Attach photos, videos, or documents to support your report.",
          reviewTitle: "Evidence Review",
          reviewSubtitle: "Review all information before final submission.",
          doneTitle: "Submission Complete",
          doneSubtitle: "Your report has been securely submitted.",
          nextScamShield: "Next: ScamShield",
          nextAddEvidence: "Next: Add evidence",
          nextReview: "Next: Review report",
          submitReport: "Submit report",
          openReports: "Open reports",
          backToDashboard: "Back to dashboard",
          backToConversation: "Back to conversation",
          supportBody:
            "Your safety comes first. If this incident feels overwhelming, you can pause and request immediate guidance from our support network.",
          anonymousSupport: "Anonymous Support",
          anonymousSupportBody:
            "Speak to a trained listener with no identity disclosure.",
          recoveryTools: "Recovery Tools",
          recoveryToolsBody:
            "Access breathing prompts and grounding resources instantly.",
          urgentHelp: "Urgent Help",
          needImmediateSafetyAssistance: "Need immediate safety assistance?",
          urgentHelpBody:
            "If you feel in danger right now, call emergency services first and continue this submission when safe.",
          safetyPlan: "Safety Plan",
          safetyPlanBody: "Create a quick personal safety checklist.",
          saveDraft: "Save Draft",
          saveDraftBody: "Pause now and return with your secure key.",
          crisisContacts: "Crisis Contacts",
          crisisContactsBody: "View trusted local and national hotlines.",
          incidentTitle: "Incident Title",
          incidentTitleValue: "Harassment near main corridor",
          date: "Date",
          location: "Location",
          locationValue: "Building A, Corridor 2",
          summary: "Summary",
          summaryValue:
            "A manager used threatening language and blocked my path near the elevator. Two colleagues witnessed the incident.",
          completeness: "Completeness",
          completed72: "72% completed",
          incidentTypeIdentified: "Incident type identified",
          whoWhatWhereCaptured: "Who/What/Where captured",
          addEvidenceToStrengthenCase: "Add evidence to strengthen case",
          dragFiles: "Drag files here or upload manually",
          uploadLimits: "PNG, JPG, MP4, PDF up to 20MB each",
          uploadEvidence: "Upload Evidence",
          evidenceStatus: "Evidence Status",
          photos: "Photos",
          videos: "Videos",
          documents: "Documents",
          oneAttached: "1 attached",
          zeroAttached: "0 attached",
          incidentSummary: "Incident Summary",
          attachedEvidence: "Attached Evidence",
          finalChecks: "Final Checks",
          personalDataRemoved: "Personally identifying data removed",
          timelineFieldsCompleted: "Timeline fields completed",
          emergencyEscalationNotRequired: "Emergency escalation not required",
          confirmAccuracy:
            "I confirm this report is accurate to the best of my knowledge.",
          reportReceivedSuccessfully: "Report received successfully",
          referenceKeyPrefix: "Your reference key is",
          referenceKeySuffix:
            "Use this key to track status and continue communication.",
          trackSubmission: "Track Submission",
          trackSubmissionBody: "Continue in assistant mode to view timeline updates.",
          needSupport: "Need Support?",
          needSupportBody:
            "Open Help & Support from settings for live assistance.",
        },
        scamShield: {
          brand: "ScamShield",
          journeyReport: "Journey Report",
          journeyReportSubtitle:
            "Tell us what happened and include any screenshots or files.",
          scamRiskResults: "Scam Risk Results",
          scamRiskResultsSubtitle:
            "Automated analysis highlights immediate protective actions.",
          nextSteps: "Next Steps",
          nextStepsSubtitle:
            "Secure your assets and report this incident with guided actions.",
          agencyReport: "Agency Report",
          agencyReportSubtitle:
            "Review and submit a prefilled report package.",
          analyzeRisk: "Analyze Risk",
          reportThisIncident: "Report This Incident",
          nextAgencyReport: "Next: Agency Report",
          submitPackage: "Submit Package",
          journeyNarrativeSample:
            "I received a call from someone pretending to be from my bank. They requested a one-time passcode, then attempted to access my account via a fake verification page.",
          autoDetectHint:
            "We automatically detect key scam signals and route this report to the right response team.",
          uploadScreenshots: "Upload screenshots",
          addScreenshot: "Add Screenshot",
          add: "+ Add",
          safetyReminder: "Safety Reminder",
          safetyReminderBody: "Never share PINs, OTPs, or passwords while reporting.",
          highFraudRisk: "High Fraud Risk",
          highFraudRiskBody:
            "This conversation pattern strongly matches known account-takeover scams.",
          urgentLanguageUsage: "Urgent language usage",
          urgentLanguageUsageBody:
            "Caller pressured immediate verification and demanded one-time codes.",
          repeatedContactBehavior: "Repeated contact behavior",
          repeatedContactBehaviorBody:
            "Multiple calls came from near-identical numbers in a short window.",
          credentialHarvestIndicators: "Credential harvest indicators",
          credentialHarvestIndicatorsBody:
            "A fake verification link collected account details.",
          immediateActions: "Immediate actions",
          immediateAction1: "1. Freeze cards and reset account password.",
          immediateAction2: "2. Enable MFA and sign out of unknown sessions.",
          immediateAction3: "3. Notify bank fraud team with this report ID.",
          secureAssetsTitle: "Secure your assets & report the incident",
          secureAssetsSubtitle: "Complete these steps before final submission.",
          contactYourBank: "Contact Your Bank",
          contactYourBankBody: "Freeze transactions and request a fraud hold.",
          markAsCompleted: "Mark as Completed",
          reportToAccc: "Report to ACCC Scamwatch",
          reportToAcccBody: "Register this event in the national scam database.",
          reportToEmergencyCyberTeam: "Report to Emergency Cyber Team",
          reportToEmergencyCyberTeamBody:
            "Request urgent cyber assistance if account compromise is active.",
          prefilledAgencyReports: "Prefilled Agency Reports",
          prefilledAgencyReportsBody:
            "Our system prepared fields from your narrative. Please verify details.",
          scamNarrative: "Scam Narrative",
          scamNarrativeBody:
            "Phone impersonation + fake verification link + OTP harvesting.",
          impactedAssets: "Impacted Assets",
          impactedAssetsBody:
            "Primary bank account, card ending 1042, online banking credentials.",
          bankSecurityStep: "Bank Security Step",
          bankSecurityStepBody: "Bank notified and temporary hold activated.",
          submissionChecklist: "Submission Checklist",
          identitySafeModeEnabled: "Identity-safe mode enabled",
          evidencePackageAttached: "Evidence package attached",
          timelineAndMetadataVerified: "Timeline and metadata verified",
          privacyTier: "Privacy Tier",
          anonymousReporting: "Anonymous Reporting",
        },
        reports: {
          yourReports: "Your Reports",
          yourIncidentHistory: "Your Incident History",
          secureRecords: "SafeSpeak Secure Records",
          searchPlaceholder: "Search by report title, date, or status",
          allReports: "All Reports",
          drafts: "Drafts",
          inReview: "In Review",
          totalReports: "Total reports",
          resolvedCases: "Resolved cases",
          reportOverview: "Report Overview",
          incidentNarrative: "Incident Narrative",
          reportId: "Report ID",
          created: "Created",
          status: "Status",
          reportMetadata: "Report Metadata",
          lastUpdate: "Last Update",
          supportKey: "Support Key",
          location: "Location",
          editReport: "Edit report",
          proceedToSubmission: "Proceed to submission",
          statusSubmitted: "Submitted",
          statusDraft: "Draft",
          statusInReview: "In Review",
          impactHighPriority: "High Priority",
          impactModerate: "Moderate",
          impactLow: "Low",
          sampleTitles: {
            "SS-2026-0421": "Harassment Incident - Wing A",
            "SS-2026-0379": "Wellbeing Support Request",
            "SS-2026-0316": "Safety Concern - Main Entry",
          },
          sampleNarratives: {
            "SS-2026-0421":
              "I was walking through the gate area around 8:30 PM when I noticed two individuals following me closely. They were making comments in a low voice and later approached near Exit C.",
            "SS-2026-0379":
              "I am submitting an early support request related to repeated verbal pressure from a supervisor. This report is currently saved as a draft.",
            "SS-2026-0316":
              "Suspicious loitering behavior was observed near the main entry. I submitted this report with timestamps and a brief witness summary.",
          },
          sampleLocations: {
            "SS-2026-0421": "Terminal C, Gate 14",
            "SS-2026-0379": "Online submission",
            "SS-2026-0316": "Main Entry Hall",
          },
        },
        explorer: {
          safeConnections: "Safe Connections",
          title: "Find the support you need",
          subtitle:
            "Find organizations and services that can help. You decide who to contact and how.",
          searchPlaceholder: "Search by name, topic, or type...",
          filterLanguage: "Language",
          filterRegion: "Region",
          filterServiceType: "Service Type",
          legalAid: "Legal Aid",
          legalAidSubtitle: "Legal advice and rights information",
          communitySupport: "Community Support",
          communitySupportSubtitle: "Local groups and peer assistance",
          counselling: "Counselling",
          counsellingSubtitle: "Mental health support",
          healthServices: "Health Services",
          healthServicesSubtitle: "Nearest clinics and resources",
          elderSupport: "Elder Support",
          elderSupportSubtitle: "Care and welfare",
          crisisSupport: "Crisis Support",
          crisisSupportSubtitle: "Immediate help",
          onlineSafety: "Online Safety",
          onlineSafetySubtitle:
            "Private legal digital safety from online harassment",
        },
        notifications: {
          notification: "Notification",
          today: "Today",
          past: "Past",
          viewEarlier: "View earlier notifications",
          unreadMessagesTitle: "Unread AI Chatbot Messages",
          unreadMessagesSubtitle: "{{count}} new messages from Uplift.ai",
          weeklySummary: "Weekly Safety Summary",
          weeklySummarySubtitle: "Your report insights are ready",
          timelineReminder: "Case Timeline Reminder",
          timelineReminderSubtitle: "Continue your draft report",
          yesterday: "Yesterday",
        },
        settings: {
          profileSettings: "Profile Settings",
          heyAlex: "Hey Alex!",
          secureSpace: "Your space is safe and secure.",
          culturalFaithProfile: "Cultural & Faith Profile",
          culturalPreference:
            "Your cultural preferences help us tailor the support we provide to ensure it aligns with your values.",
          change: "Change",
          language: "Language",
          english: "English",
          emailSecurity: "Email & Security",
          activeSecure: "Active & Secure",
          accountSettings: "Account Settings",
          manageProfileDetails: "Manage your profile details",
          update: "Update",
          manage: "Manage",
          editProfile: "Edit Profile",
          faqs: "FAQs",
          faqDescription:
            "Find quick answers to common questions about safety and privacy.",
          viewAll: "View All",
          helpSupport: "Help & Support",
          helpSupportDescription:
            "Need immediate assistance? Our support team is available 24/7 to help you with any concerns.",
          chatNow: "Chat Now",
          supportHeading: "Hello, how can we assist you?",
          supportSubheading:
            "Our team is ready to help you resolve any issues promptly.",
          supportTitleLabel: "Title",
          supportTitlePlaceholder: "Enter the title of your issue",
          supportMessageLabel: "Write in below box",
          supportMessagePlaceholder: "Write here...",
          send: "Send",
          privacyPolicyTitle: "Privacy Policy",
          privacyEffectiveDate: "EFFECTIVE DATE: OCTOBER 24, 2023",
          privacyAgreement: "SafeSpeak Privacy Agreement",
          privacyIntro:
            "Please read our privacy policy carefully to understand how we collect, use, and protect your personal information.",
          privacyItems: {
            0: "We collect only the minimum details needed to review and process your report safely and accurately.",
            1: "You can submit reports anonymously; personally identifying fields are optional where supported.",
            2: "Uploaded evidence and metadata are encrypted in transit and stored with access controls.",
            3: "Only authorized support and response teams can access report information on a need-to-know basis.",
            4: "You may request updates or deletion of eligible data under applicable privacy regulations.",
          },
          decline: "Decline",
          acceptContinue: "Accept & Continue",
        },
      },
      auth: {
        shell: {
          userAccess: "User Access",
          newAccount: "New Account",
          backToHome: "Back to Home",
        },
        login: {
          title: "Welcome Back",
          description:
            "Sign in to your SafeSpeak account and continue your reports and safety tools.",
          footerPrefix: "New to SafeSpeak?",
          footerLinkLabel: "Create an account",
          email: "Email",
          password: "Password",
          passwordPlaceholder: "Enter your password",
          rememberMe: "Remember me",
          forgotPassword: "Forgot password?",
          submitting: "Signing in...",
          submit: "Sign in",
          success: "Login successful.",
          error: "Login failed.",
        },
        register: {
          title: "Create Your Account",
          description:
            "Register as a SafeSpeak user to report incidents securely and track your submissions.",
          footerPrefix: "Already registered?",
          footerLinkLabel: "Go to login",
          fullName: "Full Name",
          fullNamePlaceholder: "Your full name",
          email: "Email",
          password: "Password",
          passwordPlaceholder: "Minimum 8 characters",
          confirmPassword: "Confirm Password",
          confirmPasswordPlaceholder: "Re-enter your password",
          terms: "I agree to the Terms of Use and Privacy Policy.",
          submitting: "Creating account...",
          submit: "Create account",
          passwordMinError: "Password must be at least 8 characters.",
          passwordMatchError: "Password and confirm password must match.",
          acceptTermsError: "Please accept the terms to continue.",
          success:
            "Registration submitted. You can now sign in from the login page.",
          error: "Registration failed.",
        },
      },
    },
  },
  es: {
    translation: {
      navbar: {
        links: {
          whatIsSafeSpeak: "Que es SafeSpeak",
          whatYouCanDoWithSafeSpeak: "Lo que puedes hacer con SafeSpeak",
          contactUs: "Contactanos",
        },
        login: "Iniciar sesion",
        language: {
          english: "Ingles",
          spanish: "Espanol",
          chooseLanguage: "Elegir idioma",
        },
      },
      hero: {
        titleAccent: "UNA APP",
        titleMain: "QUE HABLA POR TI",
        titleSecondLine: "TE DA PODER",
        subtitle: "Descarga la app ahora en nuestra tienda de iOS y Android.",
        alt: {
          sphere: "Fondo de esfera de SafeSpeak",
          indicator: "Flecha de descarga",
          appStore: "Descargar en App Store",
          googlePlay: "Disponible en Google Play",
          qr: "Codigo QR de SafeSpeak",
          appPreview: "Vista previa de la app SafeSpeak",
          voicePreview: "Vista previa de voz de SafeSpeak",
        },
      },
      footer: {
        tagline:
          "Te ayuda a ganar fuerza, perder grasa y mantenerte en forma con guia experta y entrenamiento respaldado por la ciencia para resultados duraderos.",
        social: {
          facebook: "Facebook",
          instagram: "Instagram",
          youtube: "YouTube",
        },
        quickLinksTitle: "Enlaces rapidos",
        aboutUs: "Sobre nosotros",
        whatDoesItDo: "Que hace",
        testimonials: "Testimonios",
        gallery: "Galeria",
        contactTitle: "Contacto",
        addressLine1: "Pure Training West,",
        addressLine2: "SolmsstraBe 18, 60486",
        email: "info@personaltrainer101.com",
        phone: "+49177-384-0426",
        copyright: "(c) 2025 SafeSpeak. Todos los derechos reservados.",
        privacyPolicy: "Politica de privacidad",
        termsOfUse: "Terminos de uso",
      },
      landing: {
        problem: {
          label: "QUE ES SAFESPEAK",
          titleLine1: "EL PROBLEMA QUE",
          titleLine2: "RESOLVEMOS",
          imageAlt: "Mano de SafeSpeak con telefono",
          description:
            "El contexto de la discriminacion y el acoso es complejo. Muchas personas viven abuso laboral, acoso en linea o discursos de odio y se sienten:",
          bullets: {
            0: "Aisladas y sin saber a donde acudir",
            1: "Confundidas sobre sus derechos y opciones",
            2: "Sin acceso a apoyo culturalmente sensible",
            3: "Con miedo a reportar sin orientacion",
          },
          conclusion:
            "SafeSpeak cambia eso al ofrecer claridad, seguridad y comunidad.",
          reportNow: "Reportar ahora!",
        },
        supportYourWay: {
          label: "Recursos",
          title: "Apoyo a tu manera",
          subtitle:
            "Elige el camino que te resulte adecuado. Desde reportar hasta aprender, tenemos herramientas para ayudarte.",
          natural: "NATURAL",
          cards: {
            reportIncident: {
              title: "Reportar un incidente",
              description:
                "Envia de forma segura los detalles de lo ocurrido. Puedes mantenerte anonimo o dejar contacto para seguimiento.",
              action: "Iniciar reporte",
            },
            trackCase: {
              title: "Seguir tu caso",
              description:
                "Ya enviaste un reporte? Usa tu clave unica para revisar estado o comunicarte con el equipo.",
              action: "Ver estado",
            },
            accessResources: {
              title: "Acceder a recursos",
              description:
                "Explora nuestra biblioteca de articulos, guias legales y recursos de salud mental para empoderarte.",
              action: "Ver biblioteca",
            },
            chatCounselor: {
              title: "Hablar con consejero",
              description:
                "Conecta al instante con un profesional capacitado para orientacion y apoyo emocional en tiempo real.",
              action: "Iniciar chat",
            },
          },
        },
        resources: {
          cards: {
            domesticViolence: {
              title: "Violencia domestica",
              description:
                "Conducta abusiva para controlar a la pareja. Encuentra refugio seguro y proteccion legal inmediata.",
              badge: "PROTECCION ESCUDO",
            },
            cyberProtection: {
              title: "Proteccion cibernetica",
              subtitle: "Escudo Antiestafa",
              description:
                "Explora diferentes rutas de ayuda para adelantarte a amenazas digitales.",
              footerLeft: "Recursos",
              footerRight: "Guia",
            },
            empowermentLessons: {
              title: "Lecciones de empoderamiento",
              description: "Micro-Tarjetas\n4 lecciones - 21 min",
              footerLeft: "Comenzar",
            },
          },
        },
        howItWorks: {
          title: "Como funciona",
          steps: {
            capture: {
              title: "Capturar",
              duration: "30 segundos",
              description:
                "Documenta rapidamente los detalles del incidente. Nuestro formulario inteligente te guia por voz o texto sin abrumarte.",
            },
            understand: {
              title: "Entender",
              duration: "1 minuto",
              description:
                "El sistema analiza el contexto al instante. Categorizamos gravedad e identificamos apoyo inmediato de forma segura.",
            },
            connect: {
              title: "Conectar",
              duration: "2 minutos",
              description:
                "Conecta de forma segura con el equipo adecuado. Recibes una clave anonima unica para seguimiento sin exponer identidad.",
            },
            takeAction: {
              title: "Actuar",
              duration: "1 minuto",
              description:
                "Se activan protocolos de resolucion. Se notifica a las partes correctas para una accion rapida y eficaz.",
            },
          },
        },
        localIntelligence: {
          title: "Inteligencia local",
          currentLocation: "Ubicacion actual",
          activeZonesLine1: "3 zonas activas",
          activeZonesLine2: "cercanas",
        },
        communityImpact: {
          title: "Impacto en la comunidad",
          testimonials: {
            0: {
              role: "Miembro de refugio",
              quote:
                "El Escudo Antiestafa me ayudo a identificar una amenaza a tiempo. Me siento realmente protegido aqui.",
            },
            1: {
              role: "Defensor legal",
              quote:
                "SafeSpeak no es solo una app, es una red de apoyo. La integracion de inteligencia local y reporte inmediato cambia todo.",
            },
            2: {
              role: "Lider comunitaria",
              quote:
                "Las micro-lecciones de seguridad son muy accesibles. Las comparti con todo mi grupo vecinal.",
            },
          },
        },
        faq: {
          title: "Preguntas frecuentes",
          items: {
            0: {
              question: "Como protege SafeSpeak mi identidad?",
              answer:
                "SafeSpeak permite reportes anonimos y elimina metadatos identificables cuando el modo de privacidad segura esta activo.",
            },
            1: {
              question: "Puedo continuar un reporte mas tarde?",
              answer:
                "Si. Puedes guardar un borrador y continuarlo cuando quieras con tu clave segura.",
            },
            2: {
              question: "Necesito evidencia para enviar un reporte?",
              answer:
                "No. La evidencia ayuda, pero puedes enviar un reporte inicial y adjuntar documentos despues.",
            },
            3: {
              question: "Puedo usar SafeSpeak en movil?",
              answer:
                "Si. SafeSpeak esta optimizado para experiencias moviles y de escritorio.",
            },
            4: {
              question: "Hay soporte disponible 24/7?",
              answer:
                "Si. Ayuda y soporte estan disponibles todo el tiempo para casos urgentes y no urgentes.",
            },
          },
        },
      },
      common: {
        cancel: "Cancelar",
        back: "Atras",
        continue: "Continuar",
        details: "Detalles",
        send: "Enviar",
        today: "Hoy",
        past: "Anteriores",
      },
      dashboard: {
        nav: {
          home: "Inicio",
          explorer: "Explorar",
          notifications: "Notificaciones",
          settings: "Configuracion",
        },
        toolbar: {
          emergencyCall: "En caso de emergencia llama al (000)",
          quickExit: "Salida rapida",
          welcomeBack: "Bienvenido de nuevo",
          userName: "Alex Rivera",
        },
        home: {
          cyber: "Ciber",
          scamShield: "ESCUDO ANTIESTAFA",
          legal: "Legal",
          resources: "RECURSOS",
          microCards: "Micro-Tarjetas",
          lessons: "4 Lecciones - 12 min",
          localIntelligence: "Inteligencia Local",
          currentLocation: "Ubicacion actual",
          activeZonesNearby: "3 zonas activas cercanas",
          details: "Detalles",
        },
        microcards: {
          title: "Micro-Tarjetas",
          cyberBullying: "Ciberacoso",
          searchPlaceholder: "Buscar temas, leyes o consejos...",
          identifyingBullying: "Identificar acoso",
          documentingEvidence: "Documentar evidencia",
          safeReporting: "Reporte seguro",
          digitalFootprints: "Huellas digitales",
          fourMinRead: "4 min de lectura",
          readMore: "Leer mas",
        },
        microcardDetail: {
          safeSpeakEducation: "Educacion SafeSpeak",
          internetHoaxAwareness: "Concienciacion sobre engano en internet",
          internet: "Internet",
          hoax: "Engano",
          safetyEssentials: "Esenciales de seguridad",
          stayingSafeOnline: "Mantente seguro en linea",
          digitalHarassmentOverview: "Resumen de acoso digital",
          overviewParagraph1:
            "El acoso digital incluye una amplia gama de comportamientos destinados a amenazar, intimidar o danar a personas por medios electronicos. Reconocer estos patrones es el primer y mas importante paso para recuperar la tranquilidad y establecer un entorno digital seguro.",
          keyTakeaway: "Idea clave",
          keyTakeawayBody:
            "Comprender la naturaleza de las amenazas en linea te permite tomar medidas para proteger tu identidad y bienestar mental.",
          overviewParagraph2:
            "Tu seguridad es la prioridad. Ya sea bloquear cuentas sospechosas, ajustar privacidad o documentar incidentes, los pasos pequenos y constantes brindan gran proteccion. Tienes derecho a una experiencia en linea segura.",
          previousMicrocards: "Micro-Tarjetas anteriores",
          nextMicrocards: "Siguientes Micro-Tarjetas",
          educationalDisclaimer:
            "Esto es solo informacion educativa. Sigue siempre consejo profesional.",
        },
        microeducation: {
          title: "MicroEducacion",
          headline: "Aprende. Protegete. Avanza.",
          subtitleLine1:
            "Lecciones rapidas sobre derechos, seguridad en linea, salud mental y riesgos diarios.",
          subtitleLine2:
            "Te empoderamos con conocimiento para mantenerte seguro.",
          allLessons: "Todas las lecciones",
          harassment: "Acoso",
          rights: "Derechos",
          safety: "Seguridad",
          mentalHealth: "Salud mental",
          bullying: "Acoso",
          discrimination: "Discriminacion",
          discriminationBody:
            "La discriminacion ocurre cuando se trata injustamente a empleados por rasgos personales.",
          protection: "Proteccion",
          onlineSafetyBody:
            "Protege tu huella digital y datos frente a amenazas en linea.",
          getProtected: "Protegerme",
          migrantStudentRights: "Derechos de migrantes y estudiantes",
          mental: "Mental",
          mentalHealthTitle: "Salud mental",
          fundamentals: "Fundamentos",
          legalAidBasics: "Bases de ayuda legal",
          startNow: "Comenzar ahora",
        },
        assistant: {
          timelineBuilder: "Constructor de linea de tiempo",
          continueToReportSubmission: "Continuar al envio del reporte",
          userName: "Raihan",
          greetingPrefix: "Hola",
          greetingSuffix: ", puedes recordarme, como puedo ayudarte hoy?",
          sphereAlt: "Esfera asistente de SafeSpeak",
          realTimeTranscript: "Transcripcion en tiempo real",
          listening: "Escuchando...",
          typeYourResponse: "Escribe tu respuesta...",
          toggleMicrophone: "Alternar microfono",
          stopRecording: "Detener grabacion",
          metadataCapture: "Captura de metadatos",
          metadataDescription: "GPS e inteligencia del dispositivo",
          toggleMetadataCapture: "Alternar captura de metadatos",
          tapToStartRecording: "Toca para comenzar a grabar",
          speechNotSupported: "Voz no compatible",
          speechErrors: {
            permissionDenied:
              "Se nego el acceso al microfono. Permite el permiso e intentalo de nuevo.",
            noMicrophone:
              "No se encontro microfono. Conecta un microfono e intentalo de nuevo.",
            noSpeech: "No se detecto voz. Habla mas cerca del microfono.",
            network: "Ocurrio un problema de red al procesar la voz.",
            startFailed: "No se pudo iniciar la grabacion. Intentalo de nuevo.",
            unsupported: "El reconocimiento de voz no es compatible en este navegador.",
          },
          conversation: {
            botPromptWho:
              "Te ayudo a estructurar tu reporte. Quien estuvo involucrado en este incidente?",
            defaultUserReply:
              "Fue un gerente del departamento de logistica y dos testigos.",
            botPromptWhere:
              "Gracias. Puedes describir exactamente donde ocurrio en la oficina?",
            liveTimelineBuilder: "Constructor de linea de tiempo en vivo",
            updating: "Actualizando",
            who: "Quien",
            whoValue: "Gerente y 2 testigos",
            what: "Que",
            waitingForDetails: "Esperando detalles...",
            where: "Donde",
            processingFromTranscript: "Procesando desde la transcripcion...",
            moreFields: "Apareceran mas campos mientras conversas",
          },
        },
        reportSubmission: {
          reportSubmission: "Envio de reporte",
          incidentBuilder: "Constructor de incidente",
          stepOf: "Paso {{current}} de {{total}}",
          supportTitle: "Apoyo de salud mental",
          supportSubtitle:
            "Podemos conectarte con el apoyo correcto mientras continuas tu reporte.",
          detailsTitle: "Detalles del incidente",
          detailsSubtitle:
            "Captura datos clave para que el equipo correcto responda rapido.",
          evidenceTitle: "Carga de evidencia",
          evidenceSubtitle:
            "Adjunta fotos, videos o documentos para respaldar tu reporte.",
          reviewTitle: "Revision de evidencia",
          reviewSubtitle: "Revisa toda la informacion antes del envio final.",
          doneTitle: "Envio completado",
          doneSubtitle: "Tu reporte fue enviado de forma segura.",
          nextScamShield: "Siguiente: ScamShield",
          nextAddEvidence: "Siguiente: agregar evidencia",
          nextReview: "Siguiente: revisar reporte",
          submitReport: "Enviar reporte",
          openReports: "Abrir reportes",
          backToDashboard: "Volver al panel",
          backToConversation: "Volver a la conversacion",
          supportBody:
            "Tu seguridad es primero. Si este incidente te sobrepasa, puedes pausar y solicitar orientacion inmediata de nuestra red de apoyo.",
          anonymousSupport: "Apoyo anonimo",
          anonymousSupportBody:
            "Habla con una persona capacitada sin revelar tu identidad.",
          recoveryTools: "Herramientas de recuperacion",
          recoveryToolsBody:
            "Accede al instante a ejercicios de respiracion y recursos de regulacion.",
          urgentHelp: "Ayuda urgente",
          needImmediateSafetyAssistance: "Necesitas asistencia de seguridad inmediata?",
          urgentHelpBody:
            "Si sientes peligro ahora, llama primero a emergencias y continua el envio cuando estes a salvo.",
          safetyPlan: "Plan de seguridad",
          safetyPlanBody: "Crea una lista rapida de seguridad personal.",
          saveDraft: "Guardar borrador",
          saveDraftBody: "Pausa ahora y vuelve con tu clave segura.",
          crisisContacts: "Contactos de crisis",
          crisisContactsBody: "Ver lineas de ayuda locales y nacionales confiables.",
          incidentTitle: "Titulo del incidente",
          incidentTitleValue: "Acoso cerca del pasillo principal",
          date: "Fecha",
          location: "Ubicacion",
          locationValue: "Edificio A, Pasillo 2",
          summary: "Resumen",
          summaryValue:
            "Un gerente uso lenguaje amenazante y bloqueo mi paso cerca del elevador. Dos colegas presenciaron el incidente.",
          completeness: "Completitud",
          completed72: "72% completado",
          incidentTypeIdentified: "Tipo de incidente identificado",
          whoWhatWhereCaptured: "Quien/Que/Donde capturado",
          addEvidenceToStrengthenCase: "Agregar evidencia para fortalecer el caso",
          dragFiles: "Arrastra archivos aqui o sube manualmente",
          uploadLimits: "PNG, JPG, MP4, PDF hasta 20MB cada uno",
          uploadEvidence: "Subir evidencia",
          evidenceStatus: "Estado de evidencia",
          photos: "Fotos",
          videos: "Videos",
          documents: "Documentos",
          oneAttached: "1 adjunto",
          zeroAttached: "0 adjuntos",
          incidentSummary: "Resumen del incidente",
          attachedEvidence: "Evidencia adjunta",
          finalChecks: "Revisiones finales",
          personalDataRemoved: "Datos personales identificables eliminados",
          timelineFieldsCompleted: "Campos de linea de tiempo completos",
          emergencyEscalationNotRequired: "Escalamiento de emergencia no requerido",
          confirmAccuracy:
            "Confirmo que este reporte es preciso segun mi mejor conocimiento.",
          reportReceivedSuccessfully: "Reporte recibido correctamente",
          referenceKeyPrefix: "Tu clave de referencia es",
          referenceKeySuffix:
            "Usa esta clave para seguir el estado y continuar la comunicacion.",
          trackSubmission: "Seguimiento del envio",
          trackSubmissionBody:
            "Continua en modo asistente para ver actualizaciones de la linea de tiempo.",
          needSupport: "Necesitas apoyo?",
          needSupportBody:
            "Abre Ayuda y soporte desde configuracion para asistencia en vivo.",
        },
        scamShield: {
          brand: "ScamShield",
          journeyReport: "Reporte del recorrido",
          journeyReportSubtitle:
            "Cuéntanos que paso e incluye capturas o archivos.",
          scamRiskResults: "Resultados de riesgo de estafa",
          scamRiskResultsSubtitle:
            "El analisis automatico destaca acciones de proteccion inmediatas.",
          nextSteps: "Siguientes pasos",
          nextStepsSubtitle:
            "Asegura tus activos y reporta este incidente con acciones guiadas.",
          agencyReport: "Reporte para agencia",
          agencyReportSubtitle:
            "Revisa y envia un paquete de reporte prellenado.",
          analyzeRisk: "Analizar riesgo",
          reportThisIncident: "Reportar este incidente",
          nextAgencyReport: "Siguiente: reporte de agencia",
          submitPackage: "Enviar paquete",
          journeyNarrativeSample:
            "Recibi una llamada de alguien que fingia ser de mi banco. Solicito un codigo de un solo uso e intento acceder a mi cuenta mediante una pagina falsa de verificacion.",
          autoDetectHint:
            "Detectamos automaticamente senales clave de estafa y enviamos este reporte al equipo de respuesta adecuado.",
          uploadScreenshots: "Subir capturas",
          addScreenshot: "Agregar captura",
          add: "+ Agregar",
          safetyReminder: "Recordatorio de seguridad",
          safetyReminderBody: "Nunca compartas PIN, OTP o contrasenas al reportar.",
          highFraudRisk: "Alto riesgo de fraude",
          highFraudRiskBody:
            "Este patron de conversacion coincide fuertemente con estafas de toma de cuenta.",
          urgentLanguageUsage: "Uso de lenguaje urgente",
          urgentLanguageUsageBody:
            "La persona presiono por verificacion inmediata y pidio codigos de un solo uso.",
          repeatedContactBehavior: "Comportamiento de contacto repetido",
          repeatedContactBehaviorBody:
            "Se recibieron varias llamadas de numeros casi identicos en poco tiempo.",
          credentialHarvestIndicators: "Indicadores de robo de credenciales",
          credentialHarvestIndicatorsBody:
            "Un enlace falso de verificacion recolecto datos de cuenta.",
          immediateActions: "Acciones inmediatas",
          immediateAction1: "1. Congela tarjetas y restablece la contrasena.",
          immediateAction2: "2. Activa MFA y cierra sesiones desconocidas.",
          immediateAction3: "3. Notifica al equipo antifraude del banco con este ID.",
          secureAssetsTitle: "Asegura tus activos y reporta el incidente",
          secureAssetsSubtitle: "Completa estos pasos antes del envio final.",
          contactYourBank: "Contacta a tu banco",
          contactYourBankBody: "Congela transacciones y solicita bloqueo por fraude.",
          markAsCompleted: "Marcar como completado",
          reportToAccc: "Reportar a ACCC Scamwatch",
          reportToAcccBody: "Registra este evento en la base nacional de estafas.",
          reportToEmergencyCyberTeam: "Reportar al equipo ciber de emergencia",
          reportToEmergencyCyberTeamBody:
            "Solicita ayuda ciber urgente si hay compromiso activo de cuenta.",
          prefilledAgencyReports: "Reportes de agencia prellenados",
          prefilledAgencyReportsBody:
            "El sistema preparo campos desde tu narrativa. Verifica los detalles.",
          scamNarrative: "Narrativa de estafa",
          scamNarrativeBody:
            "Suplantacion telefonica + enlace falso de verificacion + robo de OTP.",
          impactedAssets: "Activos afectados",
          impactedAssetsBody:
            "Cuenta bancaria principal, tarjeta terminada en 1042 y credenciales de banca en linea.",
          bankSecurityStep: "Paso de seguridad bancaria",
          bankSecurityStepBody: "Banco notificado y retencion temporal activada.",
          submissionChecklist: "Lista de verificacion de envio",
          identitySafeModeEnabled: "Modo seguro de identidad activado",
          evidencePackageAttached: "Paquete de evidencia adjunto",
          timelineAndMetadataVerified: "Linea de tiempo y metadatos verificados",
          privacyTier: "Nivel de privacidad",
          anonymousReporting: "Reporte anonimo",
        },
        reports: {
          yourReports: "Tus reportes",
          yourIncidentHistory: "Tu historial de incidentes",
          secureRecords: "Registros seguros de SafeSpeak",
          searchPlaceholder: "Buscar por titulo, fecha o estado",
          allReports: "Todos los reportes",
          drafts: "Borradores",
          inReview: "En revision",
          totalReports: "Total de reportes",
          resolvedCases: "Casos resueltos",
          reportOverview: "Resumen del reporte",
          incidentNarrative: "Narrativa del incidente",
          reportId: "ID del reporte",
          created: "Creado",
          status: "Estado",
          reportMetadata: "Metadatos del reporte",
          lastUpdate: "Ultima actualizacion",
          supportKey: "Clave de soporte",
          location: "Ubicacion",
          editReport: "Editar reporte",
          proceedToSubmission: "Continuar al envio",
          statusSubmitted: "Enviado",
          statusDraft: "Borrador",
          statusInReview: "En revision",
          impactHighPriority: "Alta prioridad",
          impactModerate: "Moderado",
          impactLow: "Bajo",
          sampleTitles: {
            "SS-2026-0421": "Incidente de acoso - Ala A",
            "SS-2026-0379": "Solicitud de apoyo de bienestar",
            "SS-2026-0316": "Preocupacion de seguridad - Entrada principal",
          },
          sampleNarratives: {
            "SS-2026-0421":
              "Caminaba por la zona de puertas alrededor de las 8:30 PM cuando note a dos personas siguiendome de cerca. Hacian comentarios en voz baja y luego se acercaron cerca de la salida C.",
            "SS-2026-0379":
              "Estoy enviando una solicitud temprana de apoyo por presion verbal repetida de un supervisor. Este reporte esta guardado como borrador.",
            "SS-2026-0316":
              "Se observo conducta sospechosa de merodeo cerca de la entrada principal. Envie este reporte con marcas de tiempo y un breve resumen de testigos.",
          },
          sampleLocations: {
            "SS-2026-0421": "Terminal C, Puerta 14",
            "SS-2026-0379": "Envio en linea",
            "SS-2026-0316": "Hall de entrada principal",
          },
        },
        explorer: {
          safeConnections: "Conexiones seguras",
          title: "Encuentra el apoyo que necesitas",
          subtitle:
            "Encuentra organizaciones y servicios que pueden ayudarte. Tu decides a quien contactar y como.",
          searchPlaceholder: "Buscar por nombre, tema o tipo...",
          filterLanguage: "Idioma",
          filterRegion: "Region",
          filterServiceType: "Tipo de servicio",
          legalAid: "Asistencia legal",
          legalAidSubtitle: "Asesoria legal e informacion de derechos",
          communitySupport: "Apoyo comunitario",
          communitySupportSubtitle: "Grupos locales y apoyo entre pares",
          counselling: "Consejeria",
          counsellingSubtitle: "Apoyo de salud mental",
          healthServices: "Servicios de salud",
          healthServicesSubtitle: "Clinicas y recursos cercanos",
          elderSupport: "Apoyo a mayores",
          elderSupportSubtitle: "Cuidado y bienestar",
          crisisSupport: "Apoyo en crisis",
          crisisSupportSubtitle: "Ayuda inmediata",
          onlineSafety: "Seguridad en linea",
          onlineSafetySubtitle:
            "Seguridad digital y legal privada contra el acoso en linea",
        },
        notifications: {
          notification: "Notificacion",
          today: "Hoy",
          past: "Anteriores",
          viewEarlier: "Ver notificaciones anteriores",
          unreadMessagesTitle: "Mensajes no leidos del chatbot de IA",
          unreadMessagesSubtitle: "{{count}} mensajes nuevos de Uplift.ai",
          weeklySummary: "Resumen semanal de seguridad",
          weeklySummarySubtitle: "Tus analisis de reporte estan listos",
          timelineReminder: "Recordatorio de linea de tiempo",
          timelineReminderSubtitle: "Continua tu borrador de reporte",
          yesterday: "Ayer",
        },
        settings: {
          profileSettings: "Configuracion del perfil",
          heyAlex: "Hola Alex!",
          secureSpace: "Tu espacio es seguro y protegido.",
          culturalFaithProfile: "Perfil cultural y de fe",
          culturalPreference:
            "Tus preferencias culturales nos ayudan a adaptar el apoyo para que este alineado con tus valores.",
          change: "Cambiar",
          language: "Idioma",
          english: "Ingles",
          emailSecurity: "Correo y seguridad",
          activeSecure: "Activo y seguro",
          accountSettings: "Configuracion de cuenta",
          manageProfileDetails: "Administra los detalles de tu perfil",
          update: "Actualizar",
          manage: "Gestionar",
          editProfile: "Editar perfil",
          faqs: "Preguntas frecuentes",
          faqDescription:
            "Encuentra respuestas rapidas a preguntas comunes de seguridad y privacidad.",
          viewAll: "Ver todo",
          helpSupport: "Ayuda y soporte",
          helpSupportDescription:
            "Necesitas ayuda inmediata? Nuestro equipo esta disponible 24/7 para ayudarte.",
          chatNow: "Chatear ahora",
          supportHeading: "Hola, como podemos ayudarte?",
          supportSubheading:
            "Nuestro equipo esta listo para ayudarte a resolver cualquier problema.",
          supportTitleLabel: "Titulo",
          supportTitlePlaceholder: "Escribe el titulo de tu problema",
          supportMessageLabel: "Escribe en el cuadro",
          supportMessagePlaceholder: "Escribe aqui...",
          send: "Enviar",
          privacyPolicyTitle: "Politica de privacidad",
          privacyEffectiveDate: "FECHA DE VIGENCIA: 24 DE OCTUBRE DE 2023",
          privacyAgreement: "Acuerdo de privacidad de SafeSpeak",
          privacyIntro:
            "Lee atentamente nuestra politica de privacidad para entender como recopilamos, usamos y protegemos tu informacion personal.",
          privacyItems: {
            0: "Recopilamos solo la informacion minima necesaria para revisar y procesar tu reporte de forma segura y precisa.",
            1: "Puedes enviar reportes de forma anonima; los campos de identificacion personal son opcionales donde aplique.",
            2: "La evidencia y metadatos cargados se cifran en transito y se almacenan con controles de acceso.",
            3: "Solo equipos autorizados de soporte y respuesta pueden acceder a la informacion del reporte segun necesidad.",
            4: "Puedes solicitar actualizaciones o eliminacion de datos elegibles segun regulaciones de privacidad aplicables.",
          },
          decline: "Rechazar",
          acceptContinue: "Aceptar y continuar",
        },
      },
      auth: {
        shell: {
          userAccess: "Acceso de usuario",
          newAccount: "Nueva cuenta",
          backToHome: "Volver al inicio",
        },
        login: {
          title: "Bienvenido de nuevo",
          description:
            "Inicia sesion en tu cuenta SafeSpeak y continua tus reportes y herramientas de seguridad.",
          footerPrefix: "Nuevo en SafeSpeak?",
          footerLinkLabel: "Crear una cuenta",
          email: "Correo",
          password: "Contrasena",
          passwordPlaceholder: "Ingresa tu contrasena",
          rememberMe: "Recordarme",
          forgotPassword: "Olvidaste la contrasena?",
          submitting: "Iniciando sesion...",
          submit: "Iniciar sesion",
          success: "Inicio de sesion exitoso.",
          error: "Error al iniciar sesion.",
        },
        register: {
          title: "Crea tu cuenta",
          description:
            "Registrate como usuario de SafeSpeak para reportar incidentes de forma segura y seguir tus envios.",
          footerPrefix: "Ya estas registrado?",
          footerLinkLabel: "Ir a iniciar sesion",
          fullName: "Nombre completo",
          fullNamePlaceholder: "Tu nombre completo",
          email: "Correo",
          password: "Contrasena",
          passwordPlaceholder: "Minimo 8 caracteres",
          confirmPassword: "Confirmar contrasena",
          confirmPasswordPlaceholder: "Vuelve a ingresar tu contrasena",
          terms: "Acepto los Terminos de uso y la Politica de privacidad.",
          submitting: "Creando cuenta...",
          submit: "Crear cuenta",
          passwordMinError: "La contrasena debe tener al menos 8 caracteres.",
          passwordMatchError:
            "La contrasena y la confirmacion deben coincidir.",
          acceptTermsError: "Acepta los terminos para continuar.",
          success:
            "Registro enviado. Ahora puedes iniciar sesion desde la pagina de acceso.",
          error: "Error en el registro.",
        },
      },
    },
  },
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return LANGUAGE_OPTIONS.some((option) => option.code === value);
}

export default i18n;
