import Image from "next/image";

import phoneHand from "@/assets/Hand and iPhone 16 Pro.svg";

export default function ProblemSection() {
  return (
    <section className="bg-[#f6f8fb]">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <div className="w-full">
            <p className="text-xs font-semibold tracking-[0.18em] text-gray-700">WHAT IS SAFESPEAK</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#0f172a] sm:text-4xl lg:text-5xl 2xl:text-6xl">
              THE PROBLEM WE
              <br />
              SOLVE
            </h2>
          </div>

          <div className="mt-10 grid w-full gap-8 md:mt-14 md:grid-cols-2 md:items-center lg:gap-12">
            <div className="flex items-center justify-center md:justify-start">
              <Image
                src={phoneHand}
                alt="SafeSpeak hand with phone"
                width={420}
                height={420}
                className="h-auto w-full max-w-[260px] drop-shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:max-w-[320px] lg:max-w-[380px]"
                priority
              />
            </div>

            <div className="text-[#0f172a]">
              <p className="text-sm font-semibold leading-6 sm:text-base">
                The landscape around discrimination and harassment is complex. Many individuals experience
                workplace abuse, online harassment, or hate speech but feel:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 sm:text-base">
                <li>Isolated and uncertain where to turn</li>
                <li>Confused about their rights and options</li>
                <li>Unable to access culturally sensitive support</li>
                <li>Fearful of reporting without guidance</li>
              </ul>
              <p className="mt-4 text-sm leading-6 sm:text-base">
                SafeSpeak changes that by offering clarity, safety, and community.
              </p>
              <div className="mt-6">
                <button className="rounded-full bg-[#0b6fb2] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg">
                  Report now!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
