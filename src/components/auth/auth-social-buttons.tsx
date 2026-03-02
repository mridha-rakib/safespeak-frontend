"use client";

import {
  IconBrandApple,
  IconBrandFacebook,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type { SocialAuthProvider } from "@/lib/auth";
import { cn } from "@/lib/utils";

type AuthSocialButtonsProps = {
  onProviderClick: (provider: SocialAuthProvider) => void | Promise<void>;
  activeProvider?: SocialAuthProvider | null;
  disabled?: boolean;
  className?: string;
};

type SocialProviderConfig = {
  key: SocialAuthProvider;
  labelKey:
    | "auth.social.continueWithGoogle"
    | "auth.social.continueWithFacebook"
    | "auth.social.continueWithApple";
  icon: typeof IconBrandGoogle;
};

const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    key: "google",
    labelKey: "auth.social.continueWithGoogle",
    icon: IconBrandGoogle,
  },
  {
    key: "facebook",
    labelKey: "auth.social.continueWithFacebook",
    icon: IconBrandFacebook,
  },
  {
    key: "apple",
    labelKey: "auth.social.continueWithApple",
    icon: IconBrandApple,
  },
];

export function AuthSocialButtons({
  onProviderClick,
  activeProvider = null,
  disabled = false,
  className,
}: AuthSocialButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-white/25" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/75">
          {t("auth.social.divider")}
        </span>
        <span className="h-px flex-1 bg-white/25" />
      </div>

      <div className="space-y-2">
        {SOCIAL_PROVIDERS.map(({ key, labelKey, icon: Icon }) => (
          <Button
            key={key}
            type="button"
            variant="light"
            size="lg"
            aria-busy={activeProvider === key}
            disabled={disabled || activeProvider !== null}
            onClick={() => {
              void onProviderClick(key);
            }}
            className={cn(
              "h-11 w-full justify-center gap-2 rounded-md border border-white/35 px-4 text-[#0b3152] shadow-none hover:bg-white",
              activeProvider === key && "border-white/50"
            )}
          >
            <Icon size={18} stroke={1.9} />
            {activeProvider === key ? t("auth.social.pending") : t(labelKey)}
          </Button>
        ))}
      </div>
    </div>
  );
}
