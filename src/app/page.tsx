import CommunityImpact from "@/components/landing/community-impact";
import DigitalSanctuary from "@/components/landing/digital-sanctuary";
import FaqSection from "@/components/landing/faq-section";
import FooterSection from "@/components/landing/footer-section";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import LocalIntelligence from "@/components/landing/local-intelligence";
import LandingNavbar from "@/components/landing/navbar";
import PillarsVariant from "@/components/landing/pillars-variant";
import ProblemSection from "@/components/landing/problem";
import RealStoriesSupport from "@/components/landing/real-stories-support";
import ResourcesSection from "@/components/landing/resources";
import SupportYourWay from "@/components/landing/support-your-way";

export default function Home() {
  return (
    <>
      <main>
        <LandingNavbar />
        <Hero />
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
      </main>
    </>
  );
}
