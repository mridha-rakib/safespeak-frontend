type ImpactCard = {
  name: string;
  role: string;
  initials: string;
  quote: string;
  highlighted?: boolean;
  avatarTone: string;
};

const impactCards: ImpactCard[] = [
  {
    name: "Alex Rivera",
    role: "SANCTUARY MEMBER",
    initials: "AR",
    quote: "The Scam Shield helped me identify a threat before it was too late. I feel truly protected here.",
    avatarTone: "bg-[#E7C9AD] text-[#23384C]",
  },
  {
    name: "Jordan Keys",
    role: "LEGAL ADVOCATE",
    initials: "JK",
    quote: "SafeSpeak isn't just an app, it's a lifeline. The integration of local intelligence and immediate reporting is game-changing.",
    highlighted: true,
    avatarTone: "bg-[#EBD1B2] text-[#244057]",
  },
  {
    name: "Maria S.",
    role: "COMMUNITY LEADER",
    initials: "MS",
    quote: "The micro-lessons on safety are so accessible. I've shared them with my entire neighborhood group.",
    avatarTone: "bg-[#E4C6A5] text-[#23384C]",
  },
];

export default function CommunityImpact() {
  return (
    <section className="mx-auto w-full max-w-[1440px] bg-[#E1F5FE] px-4 py-14 sm:px-8 sm:py-16 lg:h-[576px] lg:px-20 lg:py-24">
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col">
        <h3 className="text-center text-[40px] font-extrabold leading-[1] text-[#0F172A] sm:text-[44px]">Community Impact</h3>

        <div className="mt-10 grid w-full gap-6 lg:grid-cols-3">
          {impactCards.map((card) => (
            <article
              key={card.name}
              className={`flex min-h-[260px] flex-col rounded-[18px] p-7 transition-transform duration-200 ${
                card.highlighted
                  ? "bg-[#0B5FA6] text-white shadow-[0_16px_30px_rgba(11,95,166,0.34)] lg:-translate-y-4"
                  : "bg-[#F0F4F8] text-[#1F2937]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`${card.avatarTone} inline-flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-extrabold`}
                >
                  {card.initials}
                </span>
                <div>
                  <p className={`text-[11px] font-extrabold leading-none ${card.highlighted ? "text-white" : "text-[#0F172A]"}`}>
                    {card.name}
                  </p>
                  <p
                    className={`mt-1 text-[8px] font-bold uppercase tracking-[0.08em] ${
                      card.highlighted ? "text-[#FDB927]" : "text-[#8B98A9]"
                    }`}
                  >
                    {card.role}
                  </p>
                </div>
              </div>

              <p className={`mt-7 text-[14px] leading-6 ${card.highlighted ? "text-white/95" : "text-[#334155]"}`}>&quot;{card.quote}&quot;</p>

              <div className="mt-auto pt-8">
                <p className="text-[12px] tracking-[0.3em] text-[#FF8A00]">*****</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
