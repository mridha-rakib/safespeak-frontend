import Image from "next/image";
import Link from "next/link";

import bottomLeft from "@/assets/bottomLeftSM.svg?url";
import bottomRight from "@/assets/bottomRightSM.svg?url";
import topLeftSM from "@/assets/topLeftSM.svg?url";
import topRightSM from "@/assets/topRightSM.svg?url";
import {
  getDashboardAssistantEntryHref,
  getDashboardCardEntryHref,
} from "@/lib/dashboard-card-flows";

import { VoiceAvatarAnimation } from "./voice-avatar-animation";

function SMDasboardHome() {
  const domesticViolenceHref =
    getDashboardAssistantEntryHref("domestic_violence");
  const racialAbuseHref = getDashboardAssistantEntryHref("racial_abuse");
  const cyberScamHref = getDashboardAssistantEntryHref("cyber_scam");
  const migrantChallengesHref =
    getDashboardAssistantEntryHref("migrant_challenges");
  const generalAssistantHref = getDashboardCardEntryHref("general_assistant");

  return (
    <div className="mx-auto w-full px-4 pb-5 pt-2 lg:hidden">
      <div className="relative grid w-full grid-cols-2 gap-4 gap-y-4">
        <Link
          href={domesticViolenceHref}
          className="relative aspect-[172/230] overflow-visible"
          aria-label="Open Domestic Violence support and report guidance"
        >
          <Image
            src={topLeftSM}
            alt="Domestic violence card"
            fill
            className="object-contain"
          />
        </Link>

        <Link
          href={racialAbuseHref}
          className="relative aspect-[172/230] w-full overflow-visible"
          aria-label="Open Racial Abuse support and report guidance"
        >
          <Image
            src={topRightSM}
            alt="Racial abuse card"
            fill
            className="object-contain"
          />
        </Link>

        <Link
          href={cyberScamHref}
          className="relative aspect-[172/230] overflow-visible"
          aria-label="Open Cyber Scam assistant topic"
        >
          <Image
            src={bottomLeft}
            alt="Cyber scam card"
            fill
            className="object-cover"
          />
        </Link>

        <Link
          href={migrantChallengesHref}
          className="relative aspect-[172/230] overflow-visible"
          aria-label="Open Migrant Challenges support guidance"
        >
          <Image
            src={bottomRight}
            alt="Migrant challenges card"
            fill
            className="object-cover"
          />
        </Link>

        <Link
          href={generalAssistantHref}
          className="absolute left-1/2 top-[30%] z-20 flex h-[40%] w-[55%] -translate-x-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f5d9f]"
          aria-label="Talk with SafeSpeak"
        >
          <VoiceAvatarAnimation
            state="idle"
            size="dashboard"
            alt="Talk with SafeSpeak voice assistant"
          />
        </Link>
      </div>
    </div>
  );
}

export default SMDasboardHome;
