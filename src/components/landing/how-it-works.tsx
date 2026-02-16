import { IconCircleCheck, IconMicrophone, IconShield, IconUsers } from "@tabler/icons-react";

type Step = {
  number: string;
  title: string;
  duration: string;
  description: string;
  icon: "mic" | "shield" | "users" | "check";
};

const steps: Step[] = [
  {
    number: "01",
    title: "Capture",
    duration: "30 Seconds",
    description:
      "Quickly document the incident details. Our smart form guides you through the essential information via voice or text without overwhelming you.",
    icon: "mic",
  },
  {
    number: "02",
    title: "Understand",
    duration: "1 Minute",
    description:
      "Our system analyzes the report context instantly. We categorize the severity and identify immediate support needs securely.",
    icon: "shield",
  },
  {
    number: "03",
    title: "Connect",
    duration: "2 Minutes",
    description:
      "Securely link with the appropriate response team. You receive a unique, anonymous key to follow up without exposing your identity.",
    icon: "users",
  },
  {
    number: "04",
    title: "Take Action",
    duration: "1 Minute",
    description:
      "Resolution protocols are activated. The right stakeholders are notified immediately, ensuring swift and effective action.",
    icon: "check",
  },
];

function StepIcon({ icon }: { icon: Step["icon"] }) {
  const common = "h-5 w-5 text-[#0b5fa6]";
  if (icon === "mic") return <IconMicrophone className={common} stroke={2} />;
  if (icon === "shield") return <IconShield className={common} stroke={2} />;
  if (icon === "users") return <IconUsers className={common} stroke={2} />;
  return <IconCircleCheck className={common} stroke={2} />;
}

export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <h3 className="text-center text-3xl font-semibold text-[#1f2937] sm:text-4xl lg:text-5xl 2xl:text-6xl">
            How It Works
          </h3>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-[#d9e4ef] bg-[#f8fbff] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0b5fa6]/30 bg-white">
                    <StepIcon icon={step.icon} />
                  </div>
                  <span className="text-4xl font-extrabold leading-none text-[#0b5fa6]/20 sm:text-5xl">
                    {step.number}
                  </span>
                </div>

                <h4 className="mt-4 text-2xl font-semibold text-[#1f2937]">{step.title}</h4>
                <span className="mt-2 inline-block rounded-full bg-[#d9efff] px-3 py-1 text-sm font-semibold text-[#0b5fa6]">
                  {step.duration}
                </span>
                <p className="mt-3 text-sm leading-6 text-[#5f6f84] sm:text-base">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
