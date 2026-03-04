import { Plus_Jakarta_Sans } from "next/font/google";

import { IconQuote } from "@tabler/icons-react";

const storiesHeadingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

type Story = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarTone: string;
};

const stories: Story[] = [
  {
    quote:
      "I didn't know who to turn to. SafeSpeak gave me a way to document what was happening without fear.",
    name: "Indu",
    role: "Community Member",
    initials: "I",
    avatarTone: "bg-[#193E62]",
  },
  {
    quote:
      "The guidance I received helped me understand my rights. I finally felt like I had someone in my corner.",
    name: "David",
    role: "University Student",
    initials: "D",
    avatarTone: "bg-[#D7DDE4] text-[#264653]",
  },
  {
    quote:
      "Accessing support in my own language made all the difference. It felt human, not bureaucratic.",
    name: "Aisha",
    role: "Teacher",
    initials: "A",
    avatarTone: "bg-[#E8D3AF] text-[#264653]",
  },
];

export default function RealStoriesSupport() {
  return (
    <section className="mx-auto w-full max-w-[1440px] bg-white px-4 py-16 sm:px-8 sm:py-20 lg:h-[732px] lg:px-8 lg:py-[120px]">
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col">
        <header className="mx-auto flex flex-col items-center gap-4 text-center">
          <h3
            className={`${storiesHeadingFont.className} mx-auto w-full max-w-[432.38px] text-[36px] font-bold leading-[40px] text-[#264653]`}
          >
            Real stories, real support
          </h3>
          <p className="mx-auto h-[28px] w-full max-w-[583.89px] text-center text-[18px] font-normal leading-[28px] text-[#6B7280]">
            See how others found their voice and safety through our community.
          </p>
        </header>

        <div className="mt-12 grid w-full gap-4 lg:grid-cols-3">
          {stories.map((story, index) => (
            <article
              key={story.name}
              className={`flex min-h-[220px] flex-col justify-between rounded-[16px] bg-[#3678AF] p-8 shadow-[0_10px_26px_rgba(18,74,122,0.2)] ${
                index === 1
                  ? "-translate-y-4 transition-transform duration-200 sm:translate-y-0 lg:-translate-y-4"
                  : ""
              }`}
            >
              <div>
                <span className="inline-flex h-5 w-5 items-center justify-center text-[#FFB000]">
                  <IconQuote size={18} stroke={2.2} />
                </span>
                <p className="mt-4 max-w-[320px] text-[18px] leading-[32px] text-white/95">
                  &quot;{story.quote}&quot;
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <span
                  className={`${story.avatarTone} inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white`}
                >
                  {story.initials}
                </span>
                <div>
                  <p className="text-[13px] font-semibold leading-none text-white">
                    {story.name}
                  </p>
                  <p className="mt-1 text-[10px] leading-none text-[#B8D2E7]">
                    {story.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
