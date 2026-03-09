(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_LANGUAGE",
    ()=>DEFAULT_LANGUAGE,
    "LANGUAGE_OPTIONS",
    ()=>LANGUAGE_OPTIONS,
    "LANGUAGE_STORAGE_KEY",
    ()=>LANGUAGE_STORAGE_KEY,
    "default",
    ()=>__TURBOPACK__default__export__,
    "isSupportedLanguage",
    ()=>isSupportedLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18next/dist/esm/i18next.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/initReactI18next.js [app-client] (ecmascript)");
"use client";
;
;
const LANGUAGE_STORAGE_KEY = "safespeak-language";
const DEFAULT_LANGUAGE = "en";
const LANGUAGE_OPTIONS = [
    {
        code: "en",
        shortCode: "US",
        labelKey: "navbar.language.english"
    },
    {
        code: "es",
        shortCode: "ES",
        labelKey: "navbar.language.spanish"
    }
];
const resources = {
    en: {
        translation: {
            navbar: {
                links: {
                    whatIsSafeSpeak: "What is SafeSpeak",
                    whatYouCanDoWithSafeSpeak: "What You Can Do with SafeSpeak",
                    contactUs: "Contact Us"
                },
                login: "Start Secure Report",
                language: {
                    english: "English",
                    spanish: "Spanish",
                    chooseLanguage: "Choose language"
                }
            },
            hero: {
                titleAccent: "REPORT RACISM",
                titleMain: "SAFELY",
                titleSecondLine: "& ANONYMOUSLY",
                subtitle: "Your voice matters. Your privacy is protected.",
                alt: {
                    sphere: "SafeSpeak sphere background",
                    indicator: "Download indicator arrow",
                    appStore: "Download on the App Store",
                    googlePlay: "Get it on Google Play",
                    qr: "SafeSpeak QR",
                    appPreview: "SafeSpeak app preview",
                    voicePreview: "SafeSpeak voice preview"
                }
            },
            footer: {
                tagline: "SafeSpeak helps you report safely, understand your options, and connect with support without exposing your identity.",
                social: {
                    facebook: "Facebook",
                    instagram: "Instagram",
                    youtube: "YouTube"
                },
                quickLinksTitle: "Quick Links",
                aboutUs: "About us",
                whatDoesItDo: "Safety features",
                testimonials: "Stories",
                gallery: "How it works",
                contactTitle: "Contact",
                addressLine1: "SafeSpeak NSW,",
                addressLine2: "Sydney, Australia",
                email: "support@safespeak.au",
                phone: "+61 1800 737 732",
                copyright: "(c) 2025 SafeSpeak. All rights reserved.",
                privacyPolicy: "Privacy Policy",
                termsOfUse: "Terms of Use"
            },
            landing: {
                problem: {
                    label: "WHAT IS SAFESPEAK",
                    titleLine1: "THE PROBLEM WE",
                    titleLine2: "SOLVE",
                    imageAlt: "SafeSpeak hand with phone",
                    description: "The landscape around discrimination and harassment is complex. Many individuals experience workplace abuse, online harassment, or hate speech but feel:",
                    bullets: {
                        0: "Isolated and uncertain where to turn",
                        1: "Confused about their rights and options",
                        2: "Unable to access culturally sensitive support",
                        3: "Fearful of reporting without guidance"
                    },
                    conclusion: "SafeSpeak changes that by offering clarity, safety, and community.",
                    reportNow: "Report now!"
                },
                supportYourWay: {
                    label: "Resources",
                    title: "Support Your Way",
                    subtitle: "Choose the path that feels right for you. From reporting to reading, we have tools to help.",
                    natural: "NATURAL",
                    cards: {
                        reportIncident: {
                            title: "Report an Incident",
                            description: "Safely submit details about what happened. You can choose to remain anonymous or provide contact details for follow-up.",
                            action: "Start Report"
                        },
                        trackCase: {
                            title: "Track Your Case",
                            description: "Already submitted a report? Use your unique access key to check your status or communicate with investigators.",
                            action: "Check Status"
                        },
                        accessResources: {
                            title: "Access Resources",
                            description: "Browse our library of articles, legal guides, and mental health resources designed to empower you.",
                            action: "Browse Library"
                        },
                        chatCounselor: {
                            title: "Chat with a Counselor",
                            description: "Connect instantly with a trained professional who can offer guidance and emotional support in real-time.",
                            action: "Start Chat"
                        }
                    }
                },
                resources: {
                    cards: {
                        multiLingual: {
                            title: "Multilingual Support",
                            description: "Culturally responsive guidance in English and Spanish today, with additional language support planned.",
                            languageTag: "EN"
                        },
                        quickExit: {
                            title: "Quick Exit + Safety Mode",
                            description: "Instant disguise mode, covert state, and rapid exit controls that protect privacy when someone needs to leave fast.",
                            action: "Covert mode ready"
                        },
                        multiInput: {
                            title: "Multi-Input Reporting",
                            description: "Capture incidents using text, voice notes, or images so users can report in the format that feels safest."
                        },
                        guidedTriage: {
                            title: "Guided Triage & Referrals",
                            description: "Trauma-informed pathways that help users understand urgency, next steps, and relevant support connections."
                        }
                    }
                },
                howItWorks: {
                    title: "How It Works",
                    steps: {
                        capture: {
                            title: "Capture",
                            duration: "30 Seconds",
                            description: "Quickly document the incident details. Our smart form guides you through the essential information via voice or text without overwhelming you."
                        },
                        understand: {
                            title: "Understand",
                            duration: "1 Minute",
                            description: "Our system analyzes the report context instantly. We categorize the severity and identify immediate support needs securely."
                        },
                        connect: {
                            title: "Connect",
                            duration: "2 Minutes",
                            description: "Securely link with the appropriate response team. You receive a unique, anonymous key to follow up without exposing your identity."
                        },
                        takeAction: {
                            title: "Take Action",
                            duration: "1 Minute",
                            description: "Resolution protocols are activated. The right stakeholders are notified immediately, ensuring swift and effective action."
                        }
                    }
                },
                localIntelligence: {
                    title: "Local Intelligence",
                    currentLocation: "Current Location",
                    activeZonesLine1: "3 Active Zones",
                    activeZonesLine2: "Nearby"
                },
                communityImpact: {
                    title: "Community Impact",
                    testimonials: {
                        0: {
                            role: "Sanctuary Member",
                            quote: "The Scam Shield helped me identify a threat before it was too late. I feel truly protected here."
                        },
                        1: {
                            role: "Legal Advocate",
                            quote: "SafeSpeak isn't just an app, it's a lifeline. The integration of local intelligence and immediate reporting is game-changing."
                        },
                        2: {
                            role: "Community Leader",
                            quote: "The micro-lessons on safety are so accessible. I've shared them with my entire neighborhood group."
                        }
                    }
                },
                faq: {
                    title: "FAQ",
                    heading: "Help & FAQ",
                    emergencyNotice: "Emergency & Legal Notice",
                    immediateDanger: "In immediate danger, call",
                    emergencyNumber: "000",
                    supportLabel: "24/7 support",
                    supportNumber: "1800RESPECT",
                    disclaimer: "This platform provides information only, not legal advice. If you need legal help, contact a qualified solicitor or legal aid service in your state or territory. If using a shared device, use Quick Exit when needed.",
                    ctaTag: "Secure & Anonymous",
                    ctaTitle: "Get Started Today",
                    ctaDescription: "Your voice matters. Together, we can advocate for a safer community with the privacy you deserve.",
                    appStore: "App Store",
                    android: "Android",
                    webVersion: "Access Web Version",
                    items: {
                        0: {
                            question: "How does SafeSpeak protect my identity?",
                            answer: "SafeSpeak supports anonymous reporting and removes identifying metadata when privacy-safe mode is enabled."
                        },
                        1: {
                            question: "Can I continue a report later?",
                            answer: "Yes. You can save a draft and continue anytime using your secure reference key."
                        },
                        2: {
                            question: "Do I need evidence to submit a report?",
                            answer: "No. Evidence helps, but you can submit an initial report first and upload documents later."
                        },
                        3: {
                            question: "Can I use SafeSpeak from mobile?",
                            answer: "Yes. SafeSpeak is optimized for mobile and desktop experiences."
                        },
                        4: {
                            question: "Is support available 24/7?",
                            answer: "Yes. Help and support are available around the clock for urgent and non-urgent concerns."
                        }
                    }
                }
            },
            common: {
                cancel: "Cancel",
                back: "Back",
                continue: "Continue",
                details: "Details",
                send: "Send",
                today: "Today",
                past: "Past"
            },
            dashboard: {
                nav: {
                    home: "Home",
                    explorer: "Explorer",
                    notifications: "Notifications",
                    settings: "Settings"
                },
                toolbar: {
                    emergencyCall: "Emergency: 000",
                    quickExit: "Covert Exit",
                    welcomeBack: "Welcome Back",
                    userName: "Alex Rivera"
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
                    details: "Details"
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
                    readMore: "Read More"
                },
                microcardDetail: {
                    safeSpeakEducation: "SafeSpeak Education",
                    internetHoaxAwareness: "Internet hoax awareness",
                    internet: "Internet",
                    hoax: "Hoax",
                    safetyEssentials: "Safety Essentials",
                    stayingSafeOnline: "Staying Safe Online",
                    digitalHarassmentOverview: "Digital Harassment Overview",
                    overviewParagraph1: "Digital harassment includes a wide range of behaviors intended to threaten, intimidate, or harm individuals through electronic means. Recognizing these patterns is the first and most critical step toward regaining your peace of mind and establishing a secure digital environment.",
                    keyTakeaway: "Key Takeaway",
                    keyTakeawayBody: "Understanding the nature of online threats empowers you to take actionable steps to protect your identity and mental well-being.",
                    overviewParagraph2: "Your safety is the highest priority. Whether it involves blocking suspicious accounts, adjusting privacy settings, or documenting incidents for potential reporting, small, consistent steps lead to significant protection. Remember that you have the right to a safe online experience.",
                    previousMicrocards: "Previous Micro-Cards",
                    nextMicrocards: "Next Micro-Cards",
                    educationalDisclaimer: "This is educational information only. Always follow professional advice."
                },
                microeducation: {
                    title: "MicroEducation",
                    headline: "Learn. Protect. Thrive.",
                    subtitleLine1: "Quick lessons on rights, online safety, mental health, and everyday hazards.",
                    subtitleLine2: "Empowering you with the knowledge to stay safe and secure.",
                    allLessons: "All Lessons",
                    harassment: "Harassment",
                    rights: "Rights",
                    safety: "Safety",
                    mentalHealth: "Mental Health",
                    bullying: "Bullying",
                    discrimination: "Discrimination",
                    discriminationBody: "Discrimination occurs when employees are treated unfairly for personal traits.",
                    protection: "Protection",
                    onlineSafetyBody: "Protect your digital footprint & data from potential online threats.",
                    getProtected: "Get Protected",
                    migrantStudentRights: "Migrant & Student Rights",
                    mental: "Mental",
                    mentalHealthTitle: "Mental Health",
                    fundamentals: "Fundamentals",
                    legalAidBasics: "Legal Aid Basics",
                    startNow: "Start Now"
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
                        permissionDenied: "Microphone access was denied. Please allow microphone permission and try again.",
                        noMicrophone: "No microphone was found. Please connect a microphone and try again.",
                        noSpeech: "No speech detected. Try speaking closer to your microphone.",
                        network: "A network issue occurred while processing speech.",
                        startFailed: "Voice recording could not be started. Please try again.",
                        unsupported: "Speech recognition is not supported in this browser."
                    },
                    conversation: {
                        botPromptWho: "I'm helping you structure your report. Who was involved in this incident?",
                        defaultUserReply: "It was a manager from the logistics department and two witnesses.",
                        botPromptWhere: "Thank you. Can you describe where exactly in the office this occurred?",
                        liveTimelineBuilder: "Live Timeline Builder",
                        updating: "Updating",
                        who: "Who",
                        whoValue: "Manager & 2 Witnesses",
                        what: "What",
                        waitingForDetails: "Waiting for details...",
                        where: "Where",
                        processingFromTranscript: "Processing from transcript...",
                        moreFields: "More fields will appear as you chat"
                    },
                    triage: {
                        title: "Triage Explanation",
                        subtitle: "Understanding your current status and next steps.",
                        specialtyTag: "cardiology",
                        incidentClassification: "Incident Classification",
                        supportType: "Mental Health Support",
                        assessmentBody: "Based on your inputs, we have identified a need for emotional support and resources.",
                        assessmentNote: "This is an AI assessment and not a clinical diagnosis.",
                        legalInfo: "This is information only and not legal advice. Please consult with a professional for legal representation.",
                        recommendedSteps: "Recommended Steps",
                        saveToHistory: "Save to history",
                        primaryStepTitle: "I'm feeling stressed",
                        primaryStepBody: "Mindfulness & grounding techniques",
                        worriedOthersTitle: "Worried for others?",
                        worriedOthersBody: "How to ask & help",
                        selfHelpTitle: "Self-Help Library",
                        selfHelpBody: "Tools & guides",
                        unsafeTitle: "I don't feel safe",
                        unsafeBody: "If you are in immediate danger, connect now.",
                        callEmergency: "CALL 000",
                        tapForFullScreen: "Tap for full screen",
                        additionalResources: "Additional Safety Resources",
                        resourceEsafetyTitle: "eSafety",
                        resourceEsafetyBody: "Online abuse removal",
                        resourceCounsellingTitle: "Counselling",
                        resourceCounsellingBody: "24/7 Crisis Support",
                        footerNote: "This tool provides information and support options but is not a substitute for professional medical, legal, or treatment advice.",
                        recommendations: {
                            title: "Recommendations",
                            subtitle: "Based on your answers, here are the recommended next steps to ensure your safety. We prioritize these actions based on urgency.",
                            immediateDangerTitle: "Immediate Danger",
                            immediateDangerBody: "If you or someone else is in immediate danger, please contact the police immediately. Do not hesitate.",
                            contactPolice: "Contact Police (000)",
                            esafetyTitle: "eSafety Commissioner",
                            esafetyBody: "File a formal report regarding online abuse or cyberbullying to get content removed quickly.",
                            reportToEsafety: "Report to eSafety",
                            counsellingTitle: "Counselling Support",
                            counsellingBody: "Speak confidentially with a crisis counselor available 24/7 for mental health support and guidance.",
                            callLifeline: "Call Lifeline",
                            readMore: "Read More Detailed Explanations"
                        }
                    }
                },
                reportSubmission: {
                    reportSubmission: "Report Submission",
                    incidentBuilder: "Incident Builder",
                    stepOf: "Step {{current}} of {{total}}",
                    supportTitle: "Mental Health Support",
                    supportSubtitle: "We can connect you with the right support while you continue your report.",
                    detailsTitle: "Incident Details",
                    detailsSubtitle: "Capture key facts clearly so the right team can respond quickly.",
                    evidenceTitle: "Evidence Upload",
                    evidenceSubtitle: "Attach photos, videos, or documents to support your report.",
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
                    supportBody: "Your safety comes first. If this incident feels overwhelming, you can pause and request immediate guidance from our support network.",
                    anonymousSupport: "Anonymous Support",
                    anonymousSupportBody: "Speak to a trained listener with no identity disclosure.",
                    recoveryTools: "Recovery Tools",
                    recoveryToolsBody: "Access breathing prompts and grounding resources instantly.",
                    urgentHelp: "Urgent Help",
                    needImmediateSafetyAssistance: "Need immediate safety assistance?",
                    urgentHelpBody: "If you feel in danger right now, call emergency services first and continue this submission when safe.",
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
                    summaryValue: "A manager used threatening language and blocked my path near the elevator. Two colleagues witnessed the incident.",
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
                    confirmAccuracy: "I confirm this report is accurate to the best of my knowledge.",
                    reportReceivedSuccessfully: "Report received successfully",
                    referenceKeyPrefix: "Your reference key is",
                    referenceKeySuffix: "Use this key to track status and continue communication.",
                    trackSubmission: "Track Submission",
                    trackSubmissionBody: "Continue in assistant mode to view timeline updates.",
                    needSupport: "Need Support?",
                    needSupportBody: "Open Help & Support from settings for live assistance."
                },
                scamShield: {
                    brand: "ScamShield",
                    analyzeMessage: "Analyze Message",
                    messageContent: "Message Content",
                    messageContentPlaceholder: "Paste SMS, Email, or Web link text here...",
                    journeyReport: "Journey Report",
                    journeyReportSubtitle: "Tell us what happened and include any screenshots or files.",
                    uploadScreenshotTitle: "Upload Screenshot",
                    uploadScreenshotDescription: "Drag & drop your screenshots here or click to browse files.",
                    selectFiles: "Select Files",
                    attachedEvidence: "Attached Evidence",
                    addMore: "Add More",
                    readyForAnalysis: "2 items ready for analysis",
                    analyzeNow: "Analyze Now",
                    highRiskLabel: "High Risk",
                    highRiskDetected: "High Risk Detected",
                    highRiskDetectedBody: "This communication matches known scam patterns. We strongly advise against clicking any links or providing personal information.",
                    detectedRedFlags: "Detected Red Flags",
                    twoFound: "2 Found",
                    urgentLanguage: "Urgent Language",
                    urgentLanguageBody: "The message uses high-pressure tactics to force immediate action.",
                    suspiciousSender: "Suspicious Sender",
                    suspiciousSenderBody: "The sender's domain (noreply-security.net) does not match the official source.",
                    howToStaySafe: "How to stay safe",
                    stayProtected: "Stay Protected",
                    stayProtectedBody: "Always verify communications through official channels. When in doubt, contact the organization directly using their official contact information found on their website.",
                    infoDisclaimer: "This is informational, not legal advice.",
                    scamRiskResults: "Scam Risk Results",
                    scamRiskResultsSubtitle: "Automated analysis highlights immediate protective actions.",
                    nextSteps: "Next Steps",
                    nextStepsSubtitle: "Secure your assets and report this incident with guided actions.",
                    agencyReport: "Agency Report",
                    agencyReportSubtitle: "Review and submit a prefilled report package.",
                    analyzeRisk: "Analyze Risk",
                    reportThisIncident: "Report This Incident",
                    nextAgencyReport: "Next: Agency Report",
                    submitPackage: "Submit Package",
                    journeyNarrativeSample: "I received a call from someone pretending to be from my bank. They requested a one-time passcode, then attempted to access my account via a fake verification page.",
                    autoDetectHint: "We automatically detect key scam signals and route this report to the right response team.",
                    uploadScreenshots: "Upload screenshots",
                    addScreenshot: "Add Screenshot",
                    add: "+ Add",
                    safetyReminder: "Safety Reminder",
                    safetyReminderBody: "Never share PINs, OTPs, or passwords while reporting.",
                    highFraudRisk: "High Fraud Risk",
                    highFraudRiskBody: "This conversation pattern strongly matches known account-takeover scams.",
                    urgentLanguageUsage: "Urgent language usage",
                    urgentLanguageUsageBody: "Caller pressured immediate verification and demanded one-time codes.",
                    repeatedContactBehavior: "Repeated contact behavior",
                    repeatedContactBehaviorBody: "Multiple calls came from near-identical numbers in a short window.",
                    credentialHarvestIndicators: "Credential harvest indicators",
                    credentialHarvestIndicatorsBody: "A fake verification link collected account details.",
                    immediateActions: "Immediate actions",
                    immediateAction1: "1. Freeze cards and reset account password.",
                    immediateAction2: "2. Enable MFA and sign out of unknown sessions.",
                    immediateAction3: "3. Notify bank fraud team with this report ID.",
                    secureAssetsTitle: "Secure your assets & report the incident",
                    secureAssetsSubtitle: "Complete these steps before final submission.",
                    assetActionIntro: "Follow these critical actions based on your incident report. We've prepared the necessary information for each step.",
                    contactYourBank: "Contact Your Bank",
                    contactYourBankBody: "Freeze transactions and request a fraud hold.",
                    contactYourBankDetailed: "If you have lost money, shared your card details, or think someone can access your account, contact your bank immediately to freeze your accounts.",
                    callFraudDepartment: "Call Fraud Department",
                    markAsCompleted: "Mark as Completed",
                    reportToAcccScamwatch: "Report to ACCC Scamwatch",
                    communityPrevention: "Community Prevention",
                    reportToAcccDetailed: "Choose this if you have not lost money, but want the government to be aware of a scam.",
                    communityPreventionBody: "Crucial for preventing scams in the community.",
                    launchReportTool: "Launch Report Tool",
                    reportToReportCyber: "Report to ReportCyber",
                    reportToReportCyberBody: "Report here if you clicked a link, shared personal details, lost money, or believe your identity or accounts are at risk.",
                    reportToAccc: "Report to ACCC Scamwatch",
                    reportToAcccBody: "Register this event in the national scam database.",
                    reportToEmergencyCyberTeam: "Report to Emergency Cyber Team",
                    reportToEmergencyCyberTeamBody: "Request urgent cyber assistance if account compromise is active.",
                    prefilledAgencyReports: "Prefilled Agency Reports",
                    prefilledAgencyReportsBody: "Our system prepared fields from your narrative. Please verify details.",
                    safeSpeakAnalyzer: "SafeSpeak Analyzer",
                    prefilledAgencyReportsAnalyzerBody: "Our AI has prefilled these forms based on your conversation analysis. Please review each section carefully before submitting to the relevant authorities.",
                    prefilledDetails: "Prefilled Details",
                    senderName: "Sender Name",
                    prefilledSenderName: "Unknown/PayPal Spoof",
                    scamCategory: "Scam Category",
                    prefilledScamCategory: "Phishing / Identity Theft",
                    platform: "Platform",
                    prefilledPlatform: "Email / Gmail",
                    reportCyberAcsc: "ReportCyber (ACSC)",
                    reportCyberPanelBody: "This form is prefilled for cybercrime reporting and can be submitted directly to ReportCyber.",
                    bankSecurityDept: "Bank Security Dept",
                    bankSecurityPanelBody: "Bank contact details and incident notes are prepared for immediate escalation to your bank security team.",
                    privacyConsent: "Privacy Consent",
                    privacyConsentBody: "I authorize SafeSpeak to securely transmit this data to the selected agencies in accordance with the Privacy Policy.",
                    submitAllReports: "Submit All Reports",
                    encryptedSubmissionNotice: "End-to-end encrypted submission",
                    scamNarrative: "Scam Narrative",
                    scamNarrativeBody: "Phone impersonation + fake verification link + OTP harvesting.",
                    impactedAssets: "Impacted Assets",
                    impactedAssetsBody: "Primary bank account, card ending 1042, online banking credentials.",
                    bankSecurityStep: "Bank Security Step",
                    bankSecurityStepBody: "Bank notified and temporary hold activated.",
                    submissionChecklist: "Submission Checklist",
                    identitySafeModeEnabled: "Identity-safe mode enabled",
                    evidencePackageAttached: "Evidence package attached",
                    timelineAndMetadataVerified: "Timeline and metadata verified",
                    privacyTier: "Privacy Tier",
                    anonymousReporting: "Anonymous Reporting"
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
                        "SS-2026-0316": "Safety Concern - Main Entry"
                    },
                    sampleNarratives: {
                        "SS-2026-0421": "I was walking through the gate area around 8:30 PM when I noticed two individuals following me closely. They were making comments in a low voice and later approached near Exit C.",
                        "SS-2026-0379": "I am submitting an early support request related to repeated verbal pressure from a supervisor. This report is currently saved as a draft.",
                        "SS-2026-0316": "Suspicious loitering behavior was observed near the main entry. I submitted this report with timestamps and a brief witness summary."
                    },
                    sampleLocations: {
                        "SS-2026-0421": "Terminal C, Gate 14",
                        "SS-2026-0379": "Online submission",
                        "SS-2026-0316": "Main Entry Hall"
                    }
                },
                explorer: {
                    safeConnections: "Safe Connections",
                    title: "Find the support you need",
                    subtitle: "Find organizations and services that can help. You decide who to contact and how.",
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
                    onlineSafetySubtitle: "Private legal digital safety from online harassment",
                    serviceDetails: {
                        title: "Service Details",
                        availableNow: "Available Now",
                        contactInformation: "Contact Information",
                        phone: "Phone",
                        email: "Email",
                        languages: "Languages",
                        phoneValue: "(02) 5550 0123",
                        emailValue: "contact@clc.org.au",
                        languagesValue: "English, Arabic, Mandarin",
                        warmReferral: "Warm Referral",
                        warmReferralDescription: "A warm referral ensures the provider has the context they need to help you immediately without repeating your story. This secure transfer of information helps build trust and accelerates the support process.",
                        includeIncidentSummary: "Include Incident Summary",
                        includeIncidentSummaryHelp: "Shares your recent report securely.",
                        sendReferral: "Send Referral",
                        relevantResources: "Relevant Resources"
                    }
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
                    yesterday: "Yesterday"
                },
                settings: {
                    profileSettings: "Profile Settings",
                    heyAlex: "Hey Alex!",
                    secureSpace: "Your space is safe and secure.",
                    culturalFaithProfile: "Cultural & Faith Profile",
                    culturalPreference: "Your cultural preferences help us tailor the support we provide to ensure it aligns with your values.",
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
                    faqDescription: "Find quick answers to common questions about safety and privacy.",
                    viewAll: "View All",
                    helpSupport: "Help & Support",
                    helpSupportDescription: "Need immediate assistance? Our support team is available 24/7 to help you with any concerns.",
                    chatNow: "Chat Now",
                    supportHeading: "Hello, how can we assist you?",
                    supportSubheading: "Our team is ready to help you resolve any issues promptly.",
                    supportTitleLabel: "Title",
                    supportTitlePlaceholder: "Enter the title of your issue",
                    supportMessageLabel: "Write in below box",
                    supportMessagePlaceholder: "Write here...",
                    send: "Send",
                    privacyPolicyTitle: "Privacy Policy",
                    privacyEffectiveDate: "EFFECTIVE DATE: OCTOBER 24, 2023",
                    privacyAgreement: "SafeSpeak Privacy Agreement",
                    privacyIntro: "Please read our privacy policy carefully to understand how we collect, use, and protect your personal information.",
                    privacyItems: {
                        0: "We collect only the minimum details needed to review and process your report safely and accurately.",
                        1: "You can submit reports anonymously; personally identifying fields are optional where supported.",
                        2: "Uploaded evidence and metadata are encrypted in transit and stored with access controls.",
                        3: "Only authorized support and response teams can access report information on a need-to-know basis.",
                        4: "You may request updates or deletion of eligible data under applicable privacy regulations."
                    },
                    decline: "Decline",
                    acceptContinue: "Accept & Continue"
                }
            },
            auth: {
                shell: {
                    userAccess: "User Access",
                    newAccount: "New Account",
                    backToHome: "Back to Home"
                },
                social: {
                    divider: "Or continue with",
                    continueWithGoogle: "Continue with Google",
                    continueWithFacebook: "Continue with Facebook",
                    continueWithApple: "Sign in with Apple",
                    pending: "Connecting...",
                    placeholderSuccess: "{{provider}} sign-in will be available soon.",
                    placeholderError: "Unable to start {{provider}} sign-in right now.",
                    providers: {
                        google: "Google",
                        facebook: "Facebook",
                        apple: "Apple"
                    }
                },
                login: {
                    title: "Welcome Back",
                    description: "Sign in to your SafeSpeak account and continue your reports and safety tools.",
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
                    error: "Login failed."
                },
                register: {
                    title: "Create Your Account",
                    description: "Register as a SafeSpeak user to report incidents securely and track your submissions.",
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
                    success: "Registration submitted. You can now sign in from the login page.",
                    error: "Registration failed."
                }
            }
        }
    },
    es: {
        translation: {
            navbar: {
                links: {
                    whatIsSafeSpeak: "Que es SafeSpeak",
                    whatYouCanDoWithSafeSpeak: "Lo que puedes hacer con SafeSpeak",
                    contactUs: "Contactanos"
                },
                login: "Iniciar reporte seguro",
                language: {
                    english: "Ingles",
                    spanish: "Espanol",
                    chooseLanguage: "Elegir idioma"
                }
            },
            hero: {
                titleAccent: "REPORTA RACISMO",
                titleMain: "DE FORMA SEGURA",
                titleSecondLine: "Y ANONIMA",
                subtitle: "Tu voz importa. Tu privacidad esta protegida.",
                alt: {
                    sphere: "Fondo de esfera de SafeSpeak",
                    indicator: "Flecha de descarga",
                    appStore: "Descargar en App Store",
                    googlePlay: "Disponible en Google Play",
                    qr: "Codigo QR de SafeSpeak",
                    appPreview: "Vista previa de la app SafeSpeak",
                    voicePreview: "Vista previa de voz de SafeSpeak"
                }
            },
            footer: {
                tagline: "SafeSpeak te ayuda a reportar de forma segura, entender tus opciones y conectar con apoyo sin exponer tu identidad.",
                social: {
                    facebook: "Facebook",
                    instagram: "Instagram",
                    youtube: "YouTube"
                },
                quickLinksTitle: "Enlaces rapidos",
                aboutUs: "Sobre nosotros",
                whatDoesItDo: "Funciones de seguridad",
                testimonials: "Historias",
                gallery: "Como funciona",
                contactTitle: "Contacto",
                addressLine1: "SafeSpeak NSW,",
                addressLine2: "Sydney, Australia",
                email: "support@safespeak.au",
                phone: "+61 1800 737 732",
                copyright: "(c) 2025 SafeSpeak. Todos los derechos reservados.",
                privacyPolicy: "Politica de privacidad",
                termsOfUse: "Terminos de uso"
            },
            landing: {
                problem: {
                    label: "QUE ES SAFESPEAK",
                    titleLine1: "EL PROBLEMA QUE",
                    titleLine2: "RESOLVEMOS",
                    imageAlt: "Mano de SafeSpeak con telefono",
                    description: "El contexto de la discriminacion y el acoso es complejo. Muchas personas viven abuso laboral, acoso en linea o discursos de odio y se sienten:",
                    bullets: {
                        0: "Aisladas y sin saber a donde acudir",
                        1: "Confundidas sobre sus derechos y opciones",
                        2: "Sin acceso a apoyo culturalmente sensible",
                        3: "Con miedo a reportar sin orientacion"
                    },
                    conclusion: "SafeSpeak cambia eso al ofrecer claridad, seguridad y comunidad.",
                    reportNow: "Reportar ahora!"
                },
                supportYourWay: {
                    label: "Recursos",
                    title: "Apoyo a tu manera",
                    subtitle: "Elige el camino que te resulte adecuado. Desde reportar hasta aprender, tenemos herramientas para ayudarte.",
                    natural: "NATURAL",
                    cards: {
                        reportIncident: {
                            title: "Reportar un incidente",
                            description: "Envia de forma segura los detalles de lo ocurrido. Puedes mantenerte anonimo o dejar contacto para seguimiento.",
                            action: "Iniciar reporte"
                        },
                        trackCase: {
                            title: "Seguir tu caso",
                            description: "Ya enviaste un reporte? Usa tu clave unica para revisar estado o comunicarte con el equipo.",
                            action: "Ver estado"
                        },
                        accessResources: {
                            title: "Acceder a recursos",
                            description: "Explora nuestra biblioteca de articulos, guias legales y recursos de salud mental para empoderarte.",
                            action: "Ver biblioteca"
                        },
                        chatCounselor: {
                            title: "Hablar con consejero",
                            description: "Conecta al instante con un profesional capacitado para orientacion y apoyo emocional en tiempo real.",
                            action: "Iniciar chat"
                        }
                    }
                },
                resources: {
                    cards: {
                        multiLingual: {
                            title: "Soporte multilingue",
                            description: "Orientacion culturalmente sensible en ingles y espanol hoy, con mas idiomas planificados.",
                            languageTag: "ES"
                        },
                        quickExit: {
                            title: "Salida rapida + modo seguro",
                            description: "Modo encubierto instantaneo, estado discreto y controles de salida rapida para proteger la privacidad cuando alguien necesita salir rapido.",
                            action: "Modo encubierto listo"
                        },
                        multiInput: {
                            title: "Reporte multientrada",
                            description: "Registra incidentes con texto, notas de voz o imagenes para que cada persona reporte en el formato que le resulte mas seguro."
                        },
                        guidedTriage: {
                            title: "Triaje guiado y derivaciones",
                            description: "Rutas informadas por trauma que ayudan a entender la urgencia, los siguientes pasos y las conexiones de apoyo relevantes."
                        }
                    }
                },
                howItWorks: {
                    title: "Como funciona",
                    steps: {
                        capture: {
                            title: "Capturar",
                            duration: "30 segundos",
                            description: "Documenta rapidamente los detalles del incidente. Nuestro formulario inteligente te guia por voz o texto sin abrumarte."
                        },
                        understand: {
                            title: "Entender",
                            duration: "1 minuto",
                            description: "El sistema analiza el contexto al instante. Categorizamos gravedad e identificamos apoyo inmediato de forma segura."
                        },
                        connect: {
                            title: "Conectar",
                            duration: "2 minutos",
                            description: "Conecta de forma segura con el equipo adecuado. Recibes una clave anonima unica para seguimiento sin exponer identidad."
                        },
                        takeAction: {
                            title: "Actuar",
                            duration: "1 minuto",
                            description: "Se activan protocolos de resolucion. Se notifica a las partes correctas para una accion rapida y eficaz."
                        }
                    }
                },
                localIntelligence: {
                    title: "Inteligencia local",
                    currentLocation: "Ubicacion actual",
                    activeZonesLine1: "3 zonas activas",
                    activeZonesLine2: "cercanas"
                },
                communityImpact: {
                    title: "Impacto en la comunidad",
                    testimonials: {
                        0: {
                            role: "Miembro de refugio",
                            quote: "El Escudo Antiestafa me ayudo a identificar una amenaza a tiempo. Me siento realmente protegido aqui."
                        },
                        1: {
                            role: "Defensor legal",
                            quote: "SafeSpeak no es solo una app, es una red de apoyo. La integracion de inteligencia local y reporte inmediato cambia todo."
                        },
                        2: {
                            role: "Lider comunitaria",
                            quote: "Las micro-lecciones de seguridad son muy accesibles. Las comparti con todo mi grupo vecinal."
                        }
                    }
                },
                faq: {
                    title: "Preguntas frecuentes",
                    heading: "Ayuda y FAQ",
                    emergencyNotice: "Aviso de emergencia y legal",
                    immediateDanger: "En peligro inmediato, llama al",
                    emergencyNumber: "000",
                    supportLabel: "Apoyo 24/7",
                    supportNumber: "1800RESPECT",
                    disclaimer: "Esta plataforma ofrece solo informacion, no asesoria legal. Si necesitas ayuda legal, contacta a un abogado calificado o servicio de asistencia legal de tu estado o territorio. Si usas un dispositivo compartido, usa Salida rapida cuando sea necesario.",
                    ctaTag: "Seguro y anonimo",
                    ctaTitle: "Comienza hoy",
                    ctaDescription: "Tu voz importa. Juntos podemos impulsar una comunidad mas segura con la privacidad que mereces.",
                    appStore: "App Store",
                    android: "Android",
                    webVersion: "Acceder version web",
                    items: {
                        0: {
                            question: "Como protege SafeSpeak mi identidad?",
                            answer: "SafeSpeak permite reportes anonimos y elimina metadatos identificables cuando el modo de privacidad segura esta activo."
                        },
                        1: {
                            question: "Puedo continuar un reporte mas tarde?",
                            answer: "Si. Puedes guardar un borrador y continuarlo cuando quieras con tu clave segura."
                        },
                        2: {
                            question: "Necesito evidencia para enviar un reporte?",
                            answer: "No. La evidencia ayuda, pero puedes enviar un reporte inicial y adjuntar documentos despues."
                        },
                        3: {
                            question: "Puedo usar SafeSpeak en movil?",
                            answer: "Si. SafeSpeak esta optimizado para experiencias moviles y de escritorio."
                        },
                        4: {
                            question: "Hay soporte disponible 24/7?",
                            answer: "Si. Ayuda y soporte estan disponibles todo el tiempo para casos urgentes y no urgentes."
                        }
                    }
                }
            },
            common: {
                cancel: "Cancelar",
                back: "Atras",
                continue: "Continuar",
                details: "Detalles",
                send: "Enviar",
                today: "Hoy",
                past: "Anteriores"
            },
            dashboard: {
                nav: {
                    home: "Inicio",
                    explorer: "Explorar",
                    notifications: "Notificaciones",
                    settings: "Configuracion"
                },
                toolbar: {
                    emergencyCall: "Emergencia: 000",
                    quickExit: "Salida encubierta",
                    welcomeBack: "Bienvenido de nuevo",
                    userName: "Alex Rivera"
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
                    details: "Detalles"
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
                    readMore: "Leer mas"
                },
                microcardDetail: {
                    safeSpeakEducation: "Educacion SafeSpeak",
                    internetHoaxAwareness: "Concienciacion sobre engano en internet",
                    internet: "Internet",
                    hoax: "Engano",
                    safetyEssentials: "Esenciales de seguridad",
                    stayingSafeOnline: "Mantente seguro en linea",
                    digitalHarassmentOverview: "Resumen de acoso digital",
                    overviewParagraph1: "El acoso digital incluye una amplia gama de comportamientos destinados a amenazar, intimidar o danar a personas por medios electronicos. Reconocer estos patrones es el primer y mas importante paso para recuperar la tranquilidad y establecer un entorno digital seguro.",
                    keyTakeaway: "Idea clave",
                    keyTakeawayBody: "Comprender la naturaleza de las amenazas en linea te permite tomar medidas para proteger tu identidad y bienestar mental.",
                    overviewParagraph2: "Tu seguridad es la prioridad. Ya sea bloquear cuentas sospechosas, ajustar privacidad o documentar incidentes, los pasos pequenos y constantes brindan gran proteccion. Tienes derecho a una experiencia en linea segura.",
                    previousMicrocards: "Micro-Tarjetas anteriores",
                    nextMicrocards: "Siguientes Micro-Tarjetas",
                    educationalDisclaimer: "Esto es solo informacion educativa. Sigue siempre consejo profesional."
                },
                microeducation: {
                    title: "MicroEducacion",
                    headline: "Aprende. Protegete. Avanza.",
                    subtitleLine1: "Lecciones rapidas sobre derechos, seguridad en linea, salud mental y riesgos diarios.",
                    subtitleLine2: "Te empoderamos con conocimiento para mantenerte seguro.",
                    allLessons: "Todas las lecciones",
                    harassment: "Acoso",
                    rights: "Derechos",
                    safety: "Seguridad",
                    mentalHealth: "Salud mental",
                    bullying: "Acoso",
                    discrimination: "Discriminacion",
                    discriminationBody: "La discriminacion ocurre cuando se trata injustamente a empleados por rasgos personales.",
                    protection: "Proteccion",
                    onlineSafetyBody: "Protege tu huella digital y datos frente a amenazas en linea.",
                    getProtected: "Protegerme",
                    migrantStudentRights: "Derechos de migrantes y estudiantes",
                    mental: "Mental",
                    mentalHealthTitle: "Salud mental",
                    fundamentals: "Fundamentos",
                    legalAidBasics: "Bases de ayuda legal",
                    startNow: "Comenzar ahora"
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
                        permissionDenied: "Se nego el acceso al microfono. Permite el permiso e intentalo de nuevo.",
                        noMicrophone: "No se encontro microfono. Conecta un microfono e intentalo de nuevo.",
                        noSpeech: "No se detecto voz. Habla mas cerca del microfono.",
                        network: "Ocurrio un problema de red al procesar la voz.",
                        startFailed: "No se pudo iniciar la grabacion. Intentalo de nuevo.",
                        unsupported: "El reconocimiento de voz no es compatible en este navegador."
                    },
                    conversation: {
                        botPromptWho: "Te ayudo a estructurar tu reporte. Quien estuvo involucrado en este incidente?",
                        defaultUserReply: "Fue un gerente del departamento de logistica y dos testigos.",
                        botPromptWhere: "Gracias. Puedes describir exactamente donde ocurrio en la oficina?",
                        liveTimelineBuilder: "Constructor de linea de tiempo en vivo",
                        updating: "Actualizando",
                        who: "Quien",
                        whoValue: "Gerente y 2 testigos",
                        what: "Que",
                        waitingForDetails: "Esperando detalles...",
                        where: "Donde",
                        processingFromTranscript: "Procesando desde la transcripcion...",
                        moreFields: "Apareceran mas campos mientras conversas"
                    },
                    triage: {
                        title: "Explicacion de triaje",
                        subtitle: "Comprende tu estado actual y los siguientes pasos.",
                        specialtyTag: "cardiologia",
                        incidentClassification: "Clasificacion del incidente",
                        supportType: "Apoyo de salud mental",
                        assessmentBody: "Segun tus respuestas, identificamos una necesidad de apoyo emocional y recursos.",
                        assessmentNote: "Esta es una evaluacion de IA y no un diagnostico clinico.",
                        legalInfo: "Esta informacion es orientativa y no constituye asesoria legal. Consulta a un profesional para representacion legal.",
                        recommendedSteps: "Pasos recomendados",
                        saveToHistory: "Guardar en historial",
                        primaryStepTitle: "Me siento estresado",
                        primaryStepBody: "Mindfulness y tecnicas de regulacion",
                        worriedOthersTitle: "Preocupado por otros?",
                        worriedOthersBody: "Como preguntar y ayudar",
                        selfHelpTitle: "Biblioteca de autoayuda",
                        selfHelpBody: "Herramientas y guias",
                        unsafeTitle: "No me siento seguro",
                        unsafeBody: "Si estas en peligro inmediato, conecta ahora.",
                        callEmergency: "LLAMAR 000",
                        tapForFullScreen: "Toca para pantalla completa",
                        additionalResources: "Recursos adicionales de seguridad",
                        resourceEsafetyTitle: "eSafety",
                        resourceEsafetyBody: "Eliminacion de abuso en linea",
                        resourceCounsellingTitle: "Consejeria",
                        resourceCounsellingBody: "Apoyo de crisis 24/7",
                        footerNote: "Esta herramienta brinda informacion y opciones de apoyo, pero no reemplaza consejo medico, legal o terapeutico profesional.",
                        recommendations: {
                            title: "Recomendaciones",
                            subtitle: "Segun tus respuestas, aqui tienes los siguientes pasos recomendados para tu seguridad. Priorizamos estas acciones segun urgencia.",
                            immediateDangerTitle: "Peligro inmediato",
                            immediateDangerBody: "Si tu u otra persona esta en peligro inmediato, contacta a la policia de inmediato. No lo dudes.",
                            contactPolice: "Contactar policia (000)",
                            esafetyTitle: "Comision eSafety",
                            esafetyBody: "Presenta un reporte formal por abuso en linea o ciberacoso para retirar contenido rapidamente.",
                            reportToEsafety: "Reportar a eSafety",
                            counsellingTitle: "Apoyo de consejeria",
                            counsellingBody: "Habla de forma confidencial con un consejero de crisis disponible 24/7 para apoyo y orientacion en salud mental.",
                            callLifeline: "Llamar Lifeline",
                            readMore: "Leer explicaciones detalladas"
                        }
                    }
                },
                reportSubmission: {
                    reportSubmission: "Envio de reporte",
                    incidentBuilder: "Constructor de incidente",
                    stepOf: "Paso {{current}} de {{total}}",
                    supportTitle: "Apoyo de salud mental",
                    supportSubtitle: "Podemos conectarte con el apoyo correcto mientras continuas tu reporte.",
                    detailsTitle: "Detalles del incidente",
                    detailsSubtitle: "Captura datos clave para que el equipo correcto responda rapido.",
                    evidenceTitle: "Carga de evidencia",
                    evidenceSubtitle: "Adjunta fotos, videos o documentos para respaldar tu reporte.",
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
                    supportBody: "Tu seguridad es primero. Si este incidente te sobrepasa, puedes pausar y solicitar orientacion inmediata de nuestra red de apoyo.",
                    anonymousSupport: "Apoyo anonimo",
                    anonymousSupportBody: "Habla con una persona capacitada sin revelar tu identidad.",
                    recoveryTools: "Herramientas de recuperacion",
                    recoveryToolsBody: "Accede al instante a ejercicios de respiracion y recursos de regulacion.",
                    urgentHelp: "Ayuda urgente",
                    needImmediateSafetyAssistance: "Necesitas asistencia de seguridad inmediata?",
                    urgentHelpBody: "Si sientes peligro ahora, llama primero a emergencias y continua el envio cuando estes a salvo.",
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
                    summaryValue: "Un gerente uso lenguaje amenazante y bloqueo mi paso cerca del elevador. Dos colegas presenciaron el incidente.",
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
                    confirmAccuracy: "Confirmo que este reporte es preciso segun mi mejor conocimiento.",
                    reportReceivedSuccessfully: "Reporte recibido correctamente",
                    referenceKeyPrefix: "Tu clave de referencia es",
                    referenceKeySuffix: "Usa esta clave para seguir el estado y continuar la comunicacion.",
                    trackSubmission: "Seguimiento del envio",
                    trackSubmissionBody: "Continua en modo asistente para ver actualizaciones de la linea de tiempo.",
                    needSupport: "Necesitas apoyo?",
                    needSupportBody: "Abre Ayuda y soporte desde configuracion para asistencia en vivo."
                },
                scamShield: {
                    brand: "ScamShield",
                    analyzeMessage: "Analizar mensaje",
                    messageContent: "Contenido del mensaje",
                    messageContentPlaceholder: "Pega aqui texto de SMS, correo o enlace web...",
                    journeyReport: "Reporte del recorrido",
                    journeyReportSubtitle: "Cuéntanos que paso e incluye capturas o archivos.",
                    uploadScreenshotTitle: "Subir captura",
                    uploadScreenshotDescription: "Arrastra y suelta tus capturas aqui o haz clic para buscarlas.",
                    selectFiles: "Seleccionar archivos",
                    attachedEvidence: "Evidencia adjunta",
                    addMore: "Agregar mas",
                    readyForAnalysis: "2 elementos listos para analizar",
                    analyzeNow: "Analizar ahora",
                    highRiskLabel: "Alto riesgo",
                    highRiskDetected: "Alto riesgo detectado",
                    highRiskDetectedBody: "Esta comunicacion coincide con patrones conocidos de estafa. Recomendamos no hacer clic en enlaces ni compartir informacion personal.",
                    detectedRedFlags: "Senales de riesgo detectadas",
                    twoFound: "2 encontradas",
                    urgentLanguage: "Lenguaje urgente",
                    urgentLanguageBody: "El mensaje usa tacticas de alta presion para forzar accion inmediata.",
                    suspiciousSender: "Remitente sospechoso",
                    suspiciousSenderBody: "El dominio del remitente (noreply-security.net) no coincide con la fuente oficial.",
                    howToStaySafe: "Como mantenerte seguro",
                    stayProtected: "Mantente protegido",
                    stayProtectedBody: "Verifica siempre las comunicaciones por canales oficiales. Si tienes dudas, contacta directamente a la organizacion usando la informacion de contacto oficial en su sitio web.",
                    infoDisclaimer: "Esto es informativo, no asesoramiento legal.",
                    scamRiskResults: "Resultados de riesgo de estafa",
                    scamRiskResultsSubtitle: "El analisis automatico destaca acciones de proteccion inmediatas.",
                    nextSteps: "Siguientes pasos",
                    nextStepsSubtitle: "Asegura tus activos y reporta este incidente con acciones guiadas.",
                    agencyReport: "Reporte para agencia",
                    agencyReportSubtitle: "Revisa y envia un paquete de reporte prellenado.",
                    analyzeRisk: "Analizar riesgo",
                    reportThisIncident: "Reportar este incidente",
                    nextAgencyReport: "Siguiente: reporte de agencia",
                    submitPackage: "Enviar paquete",
                    journeyNarrativeSample: "Recibi una llamada de alguien que fingia ser de mi banco. Solicito un codigo de un solo uso e intento acceder a mi cuenta mediante una pagina falsa de verificacion.",
                    autoDetectHint: "Detectamos automaticamente senales clave de estafa y enviamos este reporte al equipo de respuesta adecuado.",
                    uploadScreenshots: "Subir capturas",
                    addScreenshot: "Agregar captura",
                    add: "+ Agregar",
                    safetyReminder: "Recordatorio de seguridad",
                    safetyReminderBody: "Nunca compartas PIN, OTP o contrasenas al reportar.",
                    highFraudRisk: "Alto riesgo de fraude",
                    highFraudRiskBody: "Este patron de conversacion coincide fuertemente con estafas de toma de cuenta.",
                    urgentLanguageUsage: "Uso de lenguaje urgente",
                    urgentLanguageUsageBody: "La persona presiono por verificacion inmediata y pidio codigos de un solo uso.",
                    repeatedContactBehavior: "Comportamiento de contacto repetido",
                    repeatedContactBehaviorBody: "Se recibieron varias llamadas de numeros casi identicos en poco tiempo.",
                    credentialHarvestIndicators: "Indicadores de robo de credenciales",
                    credentialHarvestIndicatorsBody: "Un enlace falso de verificacion recolecto datos de cuenta.",
                    immediateActions: "Acciones inmediatas",
                    immediateAction1: "1. Congela tarjetas y restablece la contrasena.",
                    immediateAction2: "2. Activa MFA y cierra sesiones desconocidas.",
                    immediateAction3: "3. Notifica al equipo antifraude del banco con este ID.",
                    secureAssetsTitle: "Asegura tus activos y reporta el incidente",
                    secureAssetsSubtitle: "Completa estos pasos antes del envio final.",
                    assetActionIntro: "Sigue estas acciones criticas segun tu reporte. Preparamos la informacion necesaria para cada paso.",
                    contactYourBank: "Contacta a tu banco",
                    contactYourBankBody: "Congela transacciones y solicita bloqueo por fraude.",
                    contactYourBankDetailed: "Si perdiste dinero, compartiste datos de tu tarjeta o crees que alguien puede acceder a tu cuenta, contacta de inmediato a tu banco para congelar tus cuentas.",
                    callFraudDepartment: "Llamar al departamento de fraude",
                    markAsCompleted: "Marcar como completado",
                    reportToAcccScamwatch: "Reportar a ACCC Scamwatch",
                    communityPrevention: "Prevencion comunitaria",
                    reportToAcccDetailed: "Elige esto si no perdiste dinero, pero quieres que el gobierno conozca la estafa.",
                    communityPreventionBody: "Clave para prevenir estafas en la comunidad.",
                    launchReportTool: "Abrir herramienta de reporte",
                    reportToReportCyber: "Reportar a ReportCyber",
                    reportToReportCyberBody: "Reporta aqui si hiciste clic en un enlace, compartiste datos personales, perdiste dinero o crees que tu identidad o cuentas estan en riesgo.",
                    reportToAccc: "Reportar a ACCC Scamwatch",
                    reportToAcccBody: "Registra este evento en la base nacional de estafas.",
                    reportToEmergencyCyberTeam: "Reportar al equipo ciber de emergencia",
                    reportToEmergencyCyberTeamBody: "Solicita ayuda ciber urgente si hay compromiso activo de cuenta.",
                    prefilledAgencyReports: "Reportes de agencia prellenados",
                    prefilledAgencyReportsBody: "El sistema preparo campos desde tu narrativa. Verifica los detalles.",
                    safeSpeakAnalyzer: "Analizador de SafeSpeak",
                    prefilledAgencyReportsAnalyzerBody: "Nuestra IA ha prellenado estos formularios segun tu analisis de conversacion. Revisa cada seccion con cuidado antes de enviarla a las autoridades correspondientes.",
                    prefilledDetails: "Detalles prellenados",
                    senderName: "Nombre del remitente",
                    prefilledSenderName: "Desconocido/PayPal falso",
                    scamCategory: "Categoria de estafa",
                    prefilledScamCategory: "Phishing / Robo de identidad",
                    platform: "Plataforma",
                    prefilledPlatform: "Correo / Gmail",
                    reportCyberAcsc: "ReportCyber (ACSC)",
                    reportCyberPanelBody: "Este formulario esta prellenado para reportar ciberdelitos y puede enviarse directamente a ReportCyber.",
                    bankSecurityDept: "Departamento de seguridad bancaria",
                    bankSecurityPanelBody: "Los datos de contacto bancario y las notas del incidente estan preparados para una escalacion inmediata con tu equipo de seguridad bancaria.",
                    privacyConsent: "Consentimiento de privacidad",
                    privacyConsentBody: "Autorizo a SafeSpeak a transmitir de forma segura estos datos a las agencias seleccionadas conforme a la Politica de privacidad.",
                    submitAllReports: "Enviar todos los reportes",
                    encryptedSubmissionNotice: "Envio cifrado de extremo a extremo",
                    scamNarrative: "Narrativa de estafa",
                    scamNarrativeBody: "Suplantacion telefonica + enlace falso de verificacion + robo de OTP.",
                    impactedAssets: "Activos afectados",
                    impactedAssetsBody: "Cuenta bancaria principal, tarjeta terminada en 1042 y credenciales de banca en linea.",
                    bankSecurityStep: "Paso de seguridad bancaria",
                    bankSecurityStepBody: "Banco notificado y retencion temporal activada.",
                    submissionChecklist: "Lista de verificacion de envio",
                    identitySafeModeEnabled: "Modo seguro de identidad activado",
                    evidencePackageAttached: "Paquete de evidencia adjunto",
                    timelineAndMetadataVerified: "Linea de tiempo y metadatos verificados",
                    privacyTier: "Nivel de privacidad",
                    anonymousReporting: "Reporte anonimo"
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
                        "SS-2026-0316": "Preocupacion de seguridad - Entrada principal"
                    },
                    sampleNarratives: {
                        "SS-2026-0421": "Caminaba por la zona de puertas alrededor de las 8:30 PM cuando note a dos personas siguiendome de cerca. Hacian comentarios en voz baja y luego se acercaron cerca de la salida C.",
                        "SS-2026-0379": "Estoy enviando una solicitud temprana de apoyo por presion verbal repetida de un supervisor. Este reporte esta guardado como borrador.",
                        "SS-2026-0316": "Se observo conducta sospechosa de merodeo cerca de la entrada principal. Envie este reporte con marcas de tiempo y un breve resumen de testigos."
                    },
                    sampleLocations: {
                        "SS-2026-0421": "Terminal C, Puerta 14",
                        "SS-2026-0379": "Envio en linea",
                        "SS-2026-0316": "Hall de entrada principal"
                    }
                },
                explorer: {
                    safeConnections: "Conexiones seguras",
                    title: "Encuentra el apoyo que necesitas",
                    subtitle: "Encuentra organizaciones y servicios que pueden ayudarte. Tu decides a quien contactar y como.",
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
                    onlineSafetySubtitle: "Seguridad digital y legal privada contra el acoso en linea",
                    serviceDetails: {
                        title: "Detalles del servicio",
                        availableNow: "Disponible ahora",
                        contactInformation: "Informacion de contacto",
                        phone: "Telefono",
                        email: "Correo",
                        languages: "Idiomas",
                        phoneValue: "(02) 5550 0123",
                        emailValue: "contact@clc.org.au",
                        languagesValue: "Ingles, Arabe, Mandarin",
                        warmReferral: "Derivacion asistida",
                        warmReferralDescription: "Una derivacion asistida asegura que el proveedor tenga el contexto necesario para ayudarte de inmediato sin repetir tu historia. Esta transferencia segura de informacion fortalece la confianza y acelera el proceso de apoyo.",
                        includeIncidentSummary: "Incluir resumen del incidente",
                        includeIncidentSummaryHelp: "Comparte tu reporte reciente de forma segura.",
                        sendReferral: "Enviar derivacion",
                        relevantResources: "Recursos relevantes"
                    }
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
                    yesterday: "Ayer"
                },
                settings: {
                    profileSettings: "Configuracion del perfil",
                    heyAlex: "Hola Alex!",
                    secureSpace: "Tu espacio es seguro y protegido.",
                    culturalFaithProfile: "Perfil cultural y de fe",
                    culturalPreference: "Tus preferencias culturales nos ayudan a adaptar el apoyo para que este alineado con tus valores.",
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
                    faqDescription: "Encuentra respuestas rapidas a preguntas comunes de seguridad y privacidad.",
                    viewAll: "Ver todo",
                    helpSupport: "Ayuda y soporte",
                    helpSupportDescription: "Necesitas ayuda inmediata? Nuestro equipo esta disponible 24/7 para ayudarte.",
                    chatNow: "Chatear ahora",
                    supportHeading: "Hola, como podemos ayudarte?",
                    supportSubheading: "Nuestro equipo esta listo para ayudarte a resolver cualquier problema.",
                    supportTitleLabel: "Titulo",
                    supportTitlePlaceholder: "Escribe el titulo de tu problema",
                    supportMessageLabel: "Escribe en el cuadro",
                    supportMessagePlaceholder: "Escribe aqui...",
                    send: "Enviar",
                    privacyPolicyTitle: "Politica de privacidad",
                    privacyEffectiveDate: "FECHA DE VIGENCIA: 24 DE OCTUBRE DE 2023",
                    privacyAgreement: "Acuerdo de privacidad de SafeSpeak",
                    privacyIntro: "Lee atentamente nuestra politica de privacidad para entender como recopilamos, usamos y protegemos tu informacion personal.",
                    privacyItems: {
                        0: "Recopilamos solo la informacion minima necesaria para revisar y procesar tu reporte de forma segura y precisa.",
                        1: "Puedes enviar reportes de forma anonima; los campos de identificacion personal son opcionales donde aplique.",
                        2: "La evidencia y metadatos cargados se cifran en transito y se almacenan con controles de acceso.",
                        3: "Solo equipos autorizados de soporte y respuesta pueden acceder a la informacion del reporte segun necesidad.",
                        4: "Puedes solicitar actualizaciones o eliminacion de datos elegibles segun regulaciones de privacidad aplicables."
                    },
                    decline: "Rechazar",
                    acceptContinue: "Aceptar y continuar"
                }
            },
            auth: {
                shell: {
                    userAccess: "Acceso de usuario",
                    newAccount: "Nueva cuenta",
                    backToHome: "Volver al inicio"
                },
                social: {
                    divider: "O continua con",
                    continueWithGoogle: "Continuar con Google",
                    continueWithFacebook: "Continuar con Facebook",
                    continueWithApple: "Iniciar con Apple",
                    pending: "Conectando...",
                    placeholderSuccess: "El acceso con {{provider}} estara disponible pronto.",
                    placeholderError: "No se pudo iniciar el acceso con {{provider}} en este momento.",
                    providers: {
                        google: "Google",
                        facebook: "Facebook",
                        apple: "Apple"
                    }
                },
                login: {
                    title: "Bienvenido de nuevo",
                    description: "Inicia sesion en tu cuenta SafeSpeak y continua tus reportes y herramientas de seguridad.",
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
                    error: "Error al iniciar sesion."
                },
                register: {
                    title: "Crea tu cuenta",
                    description: "Registrate como usuario de SafeSpeak para reportar incidentes de forma segura y seguir tus envios.",
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
                    passwordMatchError: "La contrasena y la confirmacion deben coincidir.",
                    acceptTermsError: "Acepta los terminos para continuar.",
                    success: "Registro enviado. Ahora puedes iniciar sesion desde la pagina de acceso.",
                    error: "Error en el registro."
                }
            }
        }
    }
};
if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isInitialized) {
    void __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initReactI18next"]).init({
        resources,
        lng: DEFAULT_LANGUAGE,
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });
}
function isSupportedLanguage(value) {
    return LANGUAGE_OPTIONS.some((option)=>option.code === value);
}
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/providers/i18n-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nProvider",
    ()=>I18nProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function I18nProvider(param) {
    let { children } = param;
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "I18nProvider.useEffect": ()=>{
            const savedLanguage = window.localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_STORAGE_KEY"]);
            if (savedLanguage && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupportedLanguage"])(savedLanguage)) {
                void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].changeLanguage(savedLanguage);
                document.documentElement.lang = savedLanguage;
                return;
            }
            window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_STORAGE_KEY"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LANGUAGE"]);
            document.documentElement.lang = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LANGUAGE"];
        }
    }["I18nProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(I18nProvider, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = I18nProvider;
var _c;
__turbopack_context__.k.register(_c, "I18nProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthSession",
    ()=>clearAuthSession,
    "getAuthSession",
    ()=>getAuthSession,
    "loginAgent",
    ()=>loginAgent,
    "saveAuthSession",
    ()=>saveAuthSession,
    "startSocialAuth",
    ()=>startSocialAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const AUTH_SESSION_KEY = "safespeak_auth_session";
function getApiBaseUrl(explicit) {
    var _ref;
    // eslint-disable-next-line n/no-process-env
    const value = (_ref = explicit !== null && explicit !== void 0 ? explicit : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL) !== null && _ref !== void 0 ? _ref : "";
    const trimmed = value.trim();
    if (!trimmed) {
        throw new Error("Missing API base URL. Set NEXT_PUBLIC_API_BASE_URL or enter Base URL.");
    }
    return trimmed.replace(/\/+$/, "");
}
async function parseJsonSafe(response) {
    try {
        return await response.json();
    } catch (e) {
        return null;
    }
}
function saveAuthSession(session) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}
function getAuthSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        window.localStorage.removeItem(AUTH_SESSION_KEY);
        return null;
    }
}
function clearAuthSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.removeItem(AUTH_SESSION_KEY);
}
async function startSocialAuth(provider) {
    // Placeholder flow so UI wiring is ready before OAuth providers are connected.
    await new Promise((resolve)=>{
        setTimeout(resolve, 400);
    });
    void provider;
}
async function loginAgent(input) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _payload_data, _payload_data1;
    const baseUrl = getApiBaseUrl(options.baseUrl);
    var _options_persistSession;
    const persistSession = (_options_persistSession = options.persistSession) !== null && _options_persistSession !== void 0 ? _options_persistSession : true;
    const response = await fetch("".concat(baseUrl, "/auth/login"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const payload = await parseJsonSafe(response);
    var _payload_message;
    const message = (_payload_message = payload === null || payload === void 0 ? void 0 : payload.message) !== null && _payload_message !== void 0 ? _payload_message : "Login failed";
    if (!response.ok || !(payload === null || payload === void 0 ? void 0 : payload.success) || !(payload === null || payload === void 0 ? void 0 : (_payload_data = payload.data) === null || _payload_data === void 0 ? void 0 : _payload_data.user) || !(payload === null || payload === void 0 ? void 0 : (_payload_data1 = payload.data) === null || _payload_data1 === void 0 ? void 0 : _payload_data1.profile)) {
        throw new Error(message);
    }
    var _payload_message1, _payload_timestamp;
    const normalized = {
        success: true,
        message: (_payload_message1 = payload.message) !== null && _payload_message1 !== void 0 ? _payload_message1 : "Login successful",
        data: payload.data,
        timestamp: (_payload_timestamp = payload.timestamp) !== null && _payload_timestamp !== void 0 ? _payload_timestamp : new Date().toISOString()
    };
    if (persistSession) {
        saveAuthSession({
            ...normalized.data,
            timestamp: normalized.timestamp
        });
    }
    return normalized;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/safety.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COVERT_MODE_KEY",
    ()=>COVERT_MODE_KEY,
    "EMERGENCY_NUMBER",
    ()=>EMERGENCY_NUMBER,
    "NEUTRAL_ROUTE",
    ()=>NEUTRAL_ROUTE,
    "QUICK_EXIT_BODY_CLASS",
    ()=>QUICK_EXIT_BODY_CLASS,
    "SAFETY_GATE_ACK_KEY",
    ()=>SAFETY_GATE_ACK_KEY,
    "SUPPORT_NUMBER_DIAL",
    ()=>SUPPORT_NUMBER_DIAL,
    "SUPPORT_NUMBER_DISPLAY",
    ()=>SUPPORT_NUMBER_DISPLAY,
    "applyCovertSafetyPresentation",
    ()=>applyCovertSafetyPresentation,
    "applyDefaultSafetyPresentation",
    ()=>applyDefaultSafetyPresentation,
    "launchEmergencyCall",
    ()=>launchEmergencyCall,
    "launchSupportCall",
    ()=>launchSupportCall,
    "syncSafetyPresentation",
    ()=>syncSafetyPresentation,
    "triggerQuickExit",
    ()=>triggerQuickExit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
;
const SAFETY_GATE_ACK_KEY = "safespeak_safety_gate_ack";
const COVERT_MODE_KEY = "safespeak_covert_mode";
const EMERGENCY_NUMBER = "000";
const SUPPORT_NUMBER_DISPLAY = "1800RESPECT";
const SUPPORT_NUMBER_DIAL = "1800737732";
const NEUTRAL_ROUTE = "/neutral";
const QUICK_EXIT_BODY_CLASS = "quick-exit-active";
const DEFAULT_DOCUMENT_TITLE = "SafeSpeak";
const COVERT_DOCUMENT_TITLE = "Calculator";
const DEFAULT_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3ES%3C/text%3E%3C/svg%3E";
const COVERT_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect x='8' y='6' width='48' height='52' rx='10' fill='%23e2e8f0'/%3E%3Crect x='16' y='14' width='32' height='10' rx='4' fill='%2394a3b8'/%3E%3Cg fill='%2364748b'%3E%3Crect x='16' y='30' width='8' height='8' rx='2'/%3E%3Crect x='28' y='30' width='8' height='8' rx='2'/%3E%3Crect x='40' y='30' width='8' height='8' rx='2'/%3E%3Crect x='16' y='42' width='8' height='8' rx='2'/%3E%3Crect x='28' y='42' width='20' height='8' rx='2'/%3E%3C/g%3E%3C/svg%3E";
function telUri(phone) {
    return "tel:".concat(phone.replace(/\s+/g, ""));
}
function setFavicon(href) {
    if (typeof document === "undefined") return;
    let faviconLink = document.querySelector("link[rel='icon']");
    if (!faviconLink) {
        faviconLink = document.createElement("link");
        faviconLink.rel = "icon";
        document.head.appendChild(faviconLink);
    }
    faviconLink.href = href;
}
function setDocumentShell(title, favicon, blurActive) {
    if (typeof document === "undefined") return;
    document.title = title;
    setFavicon(favicon);
    document.body.classList.toggle(QUICK_EXIT_BODY_CLASS, blurActive);
}
function applyDefaultSafetyPresentation() {
    if (typeof document === "undefined") return;
    setDocumentShell(DEFAULT_DOCUMENT_TITLE, DEFAULT_FAVICON, false);
}
function applyCovertSafetyPresentation() {
    let { blurActive = false } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (typeof document === "undefined") return;
    setDocumentShell(COVERT_DOCUMENT_TITLE, COVERT_FAVICON, blurActive);
}
function syncSafetyPresentation(pathname) {
    if (typeof document === "undefined") return;
    if (pathname.startsWith(NEUTRAL_ROUTE)) {
        applyCovertSafetyPresentation();
        return;
    }
    applyDefaultSafetyPresentation();
}
function launchEmergencyCall() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.location.href = telUri(EMERGENCY_NUMBER);
}
function launchSupportCall() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.location.href = telUri(SUPPORT_NUMBER_DIAL);
}
function triggerQuickExit() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const savedLanguage = window.localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_STORAGE_KEY"]);
    const savedTheme = window.localStorage.getItem("theme");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthSession"])();
    Object.keys(window.localStorage).forEach((key)=>{
        if (key.startsWith("safespeak_") && key !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_STORAGE_KEY"]) {
            window.localStorage.removeItem(key);
        }
    });
    if (savedLanguage) {
        window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_STORAGE_KEY"], savedLanguage);
    }
    if (savedTheme) {
        window.localStorage.setItem("theme", savedTheme);
    }
    window.sessionStorage.removeItem(SAFETY_GATE_ACK_KEY);
    window.sessionStorage.setItem(COVERT_MODE_KEY, "1");
    applyCovertSafetyPresentation({
        blurActive: true
    });
    window.setTimeout(()=>{
        window.location.replace(NEUTRAL_ROUTE);
    }, 90);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/safety/safety-gate.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SafetyGate",
    ()=>SafetyGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/safety.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function isHiddenRoute(pathname) {
    return pathname.startsWith("/neutral");
}
function SafetyGate() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSafeToContinue, setIsSafeToContinue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SafetyGate.useEffect": ()=>{
            if (isHiddenRoute(pathname)) {
                setIsOpen(false);
                return;
            }
            const hasAcknowledged = window.sessionStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAFETY_GATE_ACK_KEY"]) === "1";
            setIsOpen(!hasAcknowledged);
        }
    }["SafetyGate.useEffect"], [
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SafetyGate.useEffect": ()=>{
            if (!isOpen) return;
            const { overflow } = document.body.style;
            document.body.style.overflow = "hidden";
            return ({
                "SafetyGate.useEffect": ()=>{
                    document.body.style.overflow = overflow;
                }
            })["SafetyGate.useEffect"];
        }
    }["SafetyGate.useEffect"], [
        isOpen
    ]);
    const continueSafely = ()=>{
        if (!isSafeToContinue) return;
        window.sessionStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAFETY_GATE_ACK_KEY"], "1");
        setIsOpen(false);
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[120] bg-[#0b1725]/80 p-4 backdrop-blur-[2px]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "safety-gate-title",
            className: "mx-auto mt-8 w-full max-w-xl rounded-2xl border border-[#ffcf99] bg-white p-5 text-[#172233] shadow-[0_20px_48px_rgba(0,0,0,0.35)] sm:mt-12 sm:p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[11px] font-bold uppercase tracking-[0.1em] text-[#0f5d9f]",
                    children: "Safety Gate"
                }, void 0, false, {
                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    id: "safety-gate-title",
                    className: "mt-1 text-2xl font-extrabold leading-tight text-[#1f2a3a]",
                    children: "Before you continue"
                }, void 0, false, {
                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 space-y-3 rounded-xl border border-[#f2dae0] bg-[#fff7f7] p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-semibold text-[#8b2131]",
                            children: [
                                "If you are in immediate danger, call ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMERGENCY_NUMBER"],
                                " now."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/safety/safety-gate.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-[#334155]",
                            children: [
                                "If it is safe, contact ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORT_NUMBER_DISPLAY"],
                                " (24/7) for support."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/safety/safety-gate.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "tel:".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMERGENCY_NUMBER"]),
                                    className: "inline-flex h-11 items-center rounded-full bg-[#dc2626] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white",
                                    children: [
                                        "Emergency ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMERGENCY_NUMBER"]
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                                    lineNumber: 81,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "tel:".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORT_NUMBER_DIAL"]),
                                    className: "inline-flex h-11 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORT_NUMBER_DISPLAY"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                                    lineNumber: 87,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerQuickExit"],
                                    className: "inline-flex h-11 items-center rounded-full bg-[#111827] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white",
                                    children: "Covert Exit"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                                    lineNumber: 93,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/safety/safety-gate.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "mt-4 flex items-start gap-2 rounded-xl border border-[#d9e2ee] bg-[#f8fbff] p-3 text-sm text-[#334155]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "checkbox",
                            checked: isSafeToContinue,
                            onChange: (event)=>setIsSafeToContinue(event.target.checked),
                            className: "mt-0.5 h-4 w-4 rounded border-[#c6d0df] accent-[#0f5d9f]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-gate.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        "I am in a safe place and want to continue."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 flex flex-wrap justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerQuickExit"],
                            className: "inline-flex h-11 items-center rounded-full border border-[#d6deea] bg-white px-5 text-xs font-semibold text-[#334155]",
                            children: "Exit to neutral screen"
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-gate.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: continueSafely,
                            disabled: !isSafeToContinue,
                            className: "inline-flex h-11 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-50",
                            children: "Continue safely"
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-gate.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/safety/safety-gate.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/safety/safety-gate.tsx",
            lineNumber: 56,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/safety/safety-gate.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(SafetyGate, "nKT+AYb7zMGwRFe0JTu8h0nGa10=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SafetyGate;
var _c;
__turbopack_context__.k.register(_c, "SafetyGate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/safety/safety-rail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SafetyRail",
    ()=>SafetyRail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconLanguage$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconLanguage$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconLanguage.mjs [app-client] (ecmascript) <export default as IconLanguage>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconShieldFilled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconShieldFilled$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconShieldFilled.mjs [app-client] (ecmascript) <export default as IconShieldFilled>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/safety.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function isHiddenRoute(pathname) {
    return pathname.startsWith("/neutral");
}
function isDashboardRoute(pathname) {
    return pathname.startsWith("/dashboard");
}
function SafetyRail() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { i18n } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [isCovertModeActive, setIsCovertModeActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SafetyRail.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const covertMode = window.sessionStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COVERT_MODE_KEY"]) === "1";
            setIsCovertModeActive(covertMode);
        }
    }["SafetyRail.useEffect"], [
        pathname
    ]);
    const currentLanguage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SafetyRail.useMemo[currentLanguage]": ()=>{
            var _i18n_resolvedLanguage;
            const language = (_i18n_resolvedLanguage = i18n.resolvedLanguage) !== null && _i18n_resolvedLanguage !== void 0 ? _i18n_resolvedLanguage : i18n.language;
            return language === "es" ? "ES" : "EN";
        }
    }["SafetyRail.useMemo[currentLanguage]"], [
        i18n.language,
        i18n.resolvedLanguage
    ]);
    const toggleLanguage = async ()=>{
        const nextLanguage = currentLanguage === "EN" ? "es" : "en";
        await i18n.changeLanguage(nextLanguage);
        window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_STORAGE_KEY"], nextLanguage);
        document.documentElement.lang = nextLanguage;
    };
    if (isHiddenRoute(pathname)) return null;
    const railClassName = isDashboardRoute(pathname) ? "dashboard-safety-rail fixed bottom-3 z-[110]" : "fixed bottom-3 left-1/2 z-[110] w-[calc(100%-1rem)] max-w-[980px] -translate-x-1/2";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        "aria-label": "Safety controls",
        className: railClassName,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-[#1f2937]/50 bg-[#0b1725]/95 px-3 py-3 text-white shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-black uppercase tracking-[0.14em] text-[#facc15]",
                            children: "In an Emergency"
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center rounded-full bg-[#7f1d1d]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white",
                                    children: [
                                        "Emergency Services: ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMERGENCY_NUMBER"]
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/safety/safety-rail.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center rounded-full bg-[#0f5d9f]/65 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white",
                                    children: [
                                        "Domestic Violence Support: ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORT_NUMBER_DISPLAY"],
                                        " (24/7)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/safety/safety-rail.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "max-w-3xl text-[11px] font-semibold leading-4 text-white/90",
                            children: "SafeSpeak is a triage and intelligence platform. It is not a substitute for legal or medical advice."
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "max-w-3xl text-[11px] leading-4 text-white/80",
                            children: "Information provided is educational only. Always prioritize your immediate safety and seek professional guidance."
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/safety/safety-rail.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 flex flex-wrap items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "tel:".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMERGENCY_NUMBER"]),
                            className: "inline-flex h-10 items-center rounded-full bg-[#dc2626] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white",
                            children: [
                                "Emergency ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMERGENCY_NUMBER"]
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "tel:".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORT_NUMBER_DIAL"]),
                            className: "inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORT_NUMBER_DISPLAY"]
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerQuickExit"],
                            className: "inline-flex h-10 items-center rounded-full bg-[#111827] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white",
                            children: "Covert Exit"
                        }, void 0, false, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>void toggleLanguage(),
                            className: "inline-flex h-10 items-center gap-1 rounded-full border border-white/35 bg-transparent px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white",
                            "aria-label": "Toggle language",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconLanguage$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconLanguage$3e$__["IconLanguage"], {
                                    size: 12
                                }, void 0, false, {
                                    fileName: "[project]/src/components/safety/safety-rail.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                currentLanguage
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex h-10 items-center gap-1 rounded-full border border-[#35a463]/40 bg-[#0b2a1f] px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9de6ba]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconShieldFilled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconShieldFilled$3e$__["IconShieldFilled"], {
                                    size: 11
                                }, void 0, false, {
                                    fileName: "[project]/src/components/safety/safety-rail.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                isCovertModeActive ? "Covert mode on" : "Covert mode ready"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/safety/safety-rail.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/safety/safety-rail.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/safety/safety-rail.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/safety/safety-rail.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(SafetyRail, "SnjLBdhyzpRdmbNralg5sIZAnIY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = SafetyRail;
var _c;
__turbopack_context__.k.register(_c, "SafetyRail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/safety/safety-experience.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SafetyExperience",
    ()=>SafetyExperience
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/safety.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$safety$2f$safety$2d$gate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/safety/safety-gate.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$safety$2f$safety$2d$rail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/safety/safety-rail.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function SafetyExperience() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SafetyExperience.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safety$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncSafetyPresentation"])(pathname);
        }
    }["SafetyExperience.useEffect"], [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$safety$2f$safety$2d$gate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SafetyGate"], {}, void 0, false, {
                fileName: "[project]/src/components/safety/safety-experience.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$safety$2f$safety$2d$rail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SafetyRail"], {}, void 0, false, {
                fileName: "[project]/src/components/safety/safety-experience.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(SafetyExperience, "V/ldUoOTYUs0Cb2F6bbxKSn7KxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SafetyExperience;
var _c;
__turbopack_context__.k.register(_c, "SafetyExperience");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d658532f._.js.map