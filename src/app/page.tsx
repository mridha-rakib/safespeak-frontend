import CommunityImpact from "@/components/landing/community-impact";
import FaqSection from "@/components/landing/faq-section";
import FooterSection from "@/components/landing/footer-section";
import Hero from "@/components/landing/hero";
import LandingNavbar from "@/components/landing/navbar";
import LocalIntelligence from "@/components/landing/local-intelligence";
import ProblemSection from "@/components/landing/problem";
import ResourcesSection from "@/components/landing/resources";
import SupportYourWay from "@/components/landing/support-your-way";
import HowItWorks from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <>
      <main>
        <LandingNavbar />
        <Hero />
        <ResourcesSection />
        <ProblemSection />
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
