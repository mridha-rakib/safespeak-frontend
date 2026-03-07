const adminSections = [
  {
    title: "Security & Compliance",
    items: [
      "Identity and access controls",
      "Consent and privacy controls",
      "Audit logs and evidence chain visibility",
    ],
  },
  {
    title: "Taxonomies & Routing",
    items: [
      "Incident type categories",
      "Destination management",
      "Cultural profile templates",
    ],
  },
  {
    title: "Integrations",
    items: [
      "Partner endpoint configuration",
      "Delivery status monitor",
      "Fallback channel setup",
    ],
  },
  {
    title: "AI Operations",
    items: [
      "Model quality dashboard",
      "Guardrail and bias monitoring",
      "Language quality checks",
    ],
  },
  {
    title: "Content & Localization",
    items: [
      "Micro-education content manager",
      "Language pack workflow",
      "Community validation queue",
    ],
  },
  {
    title: "Crisis & Safety",
    items: [
      "Safety alert monitor",
      "Quick Exit analytics",
      "Covert mode usage trends",
    ],
  },
];

export default function AdminPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1200px] px-4 py-8 sm:px-6">
      <header className="rounded-2xl border border-[#d7e2ef] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#0f5d9f]">
          Admin Console
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#1f2a3a]">
          SafeSpeak Operations Dashboard
        </h1>
        <p className="mt-2 max-w-[780px] text-sm text-[#64748b]">
          Frontend shell for the scope-required admin modules. Data integrations
          and workflows will connect to Express APIs.
        </p>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {adminSections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-[#d7e2ef] bg-[#f8fbff] p-4"
          >
            <h2 className="text-lg font-bold text-[#1f2a3a]">{section.title}</h2>
            <ul className="mt-2 space-y-1 text-sm text-[#475569]">
              {section.items.map((item) => (
                <li key={item} className="rounded-lg bg-white px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}

