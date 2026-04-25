"use client";

import dynamic from "next/dynamic";

const sectionLoader = () => <div className="min-h-24 bg-white" aria-hidden />;

const ResourcesSection = dynamic(() => import("./resources"), {
  loading: sectionLoader,
});
const DigitalSanctuary = dynamic(() => import("./digital-sanctuary"), {
  loading: sectionLoader,
});
const ProblemSection = dynamic(() => import("./problem"), {
  loading: sectionLoader,
});
const PillarsVariant = dynamic(() => import("./pillars-variant"), {
  loading: sectionLoader,
});
const RealStoriesSupport = dynamic(() => import("./real-stories-support"), {
  loading: sectionLoader,
});
const HowItWorks = dynamic(() => import("./how-it-works"), {
  loading: sectionLoader,
});
const LocalIntelligence = dynamic(() => import("./local-intelligence"), {
  loading: sectionLoader,
});
const CommunityImpact = dynamic(() => import("./community-impact"), {
  loading: sectionLoader,
});
const SupportYourWay = dynamic(() => import("./support-your-way"), {
  loading: sectionLoader,
});
const FaqSection = dynamic(() => import("./faq-section"), {
  loading: sectionLoader,
});
const FooterSection = dynamic(() => import("./footer-section"), {
  loading: sectionLoader,
});

export default function DeferredLandingSections() {
  return (
    <>
      <ResourcesSection />
      <DigitalSanctuary />
      <ProblemSection />
      <PillarsVariant />
      <RealStoriesSupport />
      <HowItWorks />
      <LocalIntelligence />
      <CommunityImpact />
      <SupportYourWay />
      <FaqSection />
      <FooterSection />
    </>
  );
}
