type Testimonial = {
  name: string;
  role: string;
  quote: string;
  featured?: boolean;
};

const testimonials: Testimonial[] = [
  {
    name: "Alex Rivera",
    role: "Sanctuary Member",
    quote: "The Scam Shield helped me identify a threat before it was too late. I feel truly protected here.",
  },
  {
    name: "Jordan Keys",
    role: "Legal Advocate",
    quote:
      "SafeSpeak isn't just an app, it's a lifeline. The integration of local intelligence and immediate reporting is game-changing.",
    featured: true,
  },
  {
    name: "Maria S.",
    role: "Community Leader",
    quote: "The micro-lessons on safety are so accessible. I've shared them with my entire neighborhood group.",
  },
];

function Stars() {
  return <p className="text-sm tracking-[0.28em] text-[#ff8f00]">*****</p>;
}

export default function CommunityImpact() {
  return (
    <section className="bg-[#d9e8f3]">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <h3 className="text-center text-3xl font-extrabold text-[#0f172a] sm:text-4xl lg:text-5xl 2xl:text-6xl">
            Community Impact
          </h3>

          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className={`rounded-3xl p-5 sm:p-6 ${
                  item.featured
                    ? "bg-[#0b5fa6] text-white shadow-[0_18px_40px_rgba(11,95,166,0.35)]"
                    : "bg-white/70 text-[#0f172a]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      item.featured ? "bg-white/25 text-white" : "bg-[#e7eef6] text-[#0f172a]"
                    }`}
                  >
                    {item.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{item.name}</p>
                    <p
                      className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                        item.featured ? "text-[#ffb347]" : "text-[#64748b]"
                      }`}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>

                <p className={`mt-5 text-sm leading-7 sm:text-[15px] ${item.featured ? "text-white/95" : "text-[#1f2937]"}`}>
                  &quot;{item.quote}&quot;
                </p>

                <div className="mt-6">
                  <Stars />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
