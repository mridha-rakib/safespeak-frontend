import DeferredLandingSections from "@/components/landing/deferred-landing-sections";
import Hero from "@/components/landing/hero";
import LandingNavbar from "@/components/landing/navbar";

export default function Home() {
  return (
    <>
      <main>
        <LandingNavbar />
        <Hero />
        <DeferredLandingSections />
      </main>
    </>
  );
}
