"use client";

import { useEffect, useMemo, useState } from "react";

import {
  IconArrowUpRight,
  IconCopy,
  IconPhoneFilled,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { useSafeSpeakProfile } from "@/hooks/use-safespeak-profile";
import {
  buildSmartDialerScript,
  smartDialerContacts,
  type SmartDialerContactId,
} from "@/lib/smart-dialer";
import { cn } from "@/lib/utils";

export function SmartDialerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { i18n } = useTranslation();
  const { profile } = useSafeSpeakProfile();
  const [selectedContactId, setSelectedContactId] =
    useState<SmartDialerContactId>("respect");
  const [copied, setCopied] = useState(false);
  const locale =
    (i18n.resolvedLanguage ?? i18n.language ?? "en").toLowerCase() === "es"
      ? "es"
      : "en";
  const copy = locale === "es"
    ? {
        title: "Marcacion segura",
        subtitle:
          "Usa numeros verificados y guiones cortos para pedir ayuda o un interprete sin explicar todo otra vez.",
        close: "Cerrar",
        callNow: "Llamar ahora",
        copyScript: "Copiar guion",
        copied: "Guion copiado",
        officialSource: "Fuente oficial",
        scriptTitle: "Guion sugerido",
        scriptHint:
          "Ajusta el guion segun tu situacion. Si no es seguro hablar mucho, dilo al principio.",
        interpreterTitle: "Idioma del interprete",
        interpreterHint:
          "Los guiones incluyen tu preferencia guardada para pedir un interprete mas rapido.",
      }
    : {
        title: "Smart dialler",
        subtitle:
          "Use verified numbers and short call scripts to ask for help or an interpreter without retelling the whole story.",
        close: "Close",
        callNow: "Call now",
        copyScript: "Copy script",
        copied: "Script copied",
        officialSource: "Official source",
        scriptTitle: "Suggested script",
        scriptHint:
          "Adjust the script to fit your situation. If it is unsafe to speak for long, say that first.",
        interpreterTitle: "Interpreter language",
        interpreterHint:
          "Scripts include your saved preference so you can ask for an interpreter faster.",
      };

  const selectedContact =
    smartDialerContacts.find((contact) => contact.id === selectedContactId) ??
    smartDialerContacts[0];
  const scriptLines = useMemo(
    () =>
      buildSmartDialerScript(
        selectedContact.id,
        profile.interpreterLanguage,
        locale
      ),
    [locale, profile.interpreterLanguage, selectedContact.id]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const copyScript = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(scriptLines.join(" "));
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[130] bg-[#041321]/55 p-3 backdrop-blur-[2px] sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="smart-dialer-title"
        className="mx-auto flex h-full w-full max-w-[1120px] flex-col overflow-hidden rounded-[28px] border border-[#dce5f1] bg-[#f8fbff] shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#d9e2ee] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f5d9f]">
              {copy.title}
            </p>
            <h2
              id="smart-dialer-title"
              className="mt-1 text-2xl font-extrabold leading-tight text-[#1f2a3a]"
            >
              {selectedContact.label}
            </h2>
            <p className="mt-2 max-w-[760px] text-sm text-[#5f7189]">
              {copy.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe4ef] bg-white text-[#50627a]"
            aria-label={copy.close}
          >
            <IconX size={16} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="min-h-0 overflow-y-auto border-b border-[#d9e2ee] p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <div className="grid gap-3">
              {smartDialerContacts.map((contact) => {
                const isSelected = contact.id === selectedContactId;

                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedContactId(contact.id)}
                    className={cn(
                      "rounded-[20px] border px-4 py-4 text-left transition",
                      isSelected
                        ? "border-[#0f5d9f] bg-[#eef6ff] shadow-[0_10px_24px_rgba(15,93,159,0.12)]"
                        : "border-[#dbe4ef] bg-white"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white",
                            contact.accentClassName
                          )}
                        >
                          {contact.availability}
                        </span>
                        <p className="mt-3 text-lg font-extrabold text-[#1f2a3a]">
                          {contact.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#0f5d9f]">
                          {contact.numberDisplay}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#60728a]">
                          {contact.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="min-h-0 overflow-y-auto p-4 sm:p-5">
            <div className="rounded-[24px] border border-[#dbe4ef] bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0f5d9f]">
                    {copy.scriptTitle}
                  </p>
                  <p className="mt-1 text-[28px] font-extrabold leading-none text-[#1f2a3a]">
                    {selectedContact.numberDisplay}
                  </p>
                  <p className="mt-2 text-sm text-[#60728a]">
                    {copy.scriptHint}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${selectedContact.numberDial}`}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold text-white",
                      selectedContact.accentClassName
                    )}
                  >
                    <IconPhoneFilled size={12} />
                    {copy.callNow}
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyScript()}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dbe4ef] bg-white px-4 text-xs font-semibold text-[#334155]"
                  >
                    <IconCopy size={12} />
                    {copied ? copy.copied : copy.copyScript}
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {scriptLines.map((line, index) => (
                  <div
                    key={`${selectedContact.id}-${index}`}
                    className="rounded-[16px] bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-[#334155]"
                  >
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f1ff] text-[10px] font-bold text-[#0f5d9f]">
                      {index + 1}
                    </span>
                    {line}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[18px] border border-[#dbe4ef] bg-[#f8fbff] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0f5d9f]">
                  {copy.interpreterTitle}
                </p>
                <p className="mt-2 text-lg font-extrabold text-[#1f2a3a]">
                  {profile.interpreterLanguage}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#60728a]">
                  {copy.interpreterHint}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-[#dbe4ef] bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0f5d9f]">
                {copy.officialSource}
              </p>
              <a
                href={selectedContact.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0f5d9f]"
              >
                {selectedContact.sourceLabel}
                <IconArrowUpRight size={14} />
              </a>
              <p className="mt-2 text-xs leading-5 text-[#60728a]">
                {selectedContact.description}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
