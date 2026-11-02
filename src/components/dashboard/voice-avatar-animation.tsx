"use client";

import { IconMicrophone } from "@tabler/icons-react";

import styles from "./voice-avatar-animation.module.css";

export type VoiceAvatarState =
  | "idle"
  | "listening"
  | "processing"
  | "userSpeaking"
  | "aiSpeaking";

type VoiceAvatarAnimationProps = {
  state: VoiceAvatarState;
  size?: "large" | "small" | "dashboard";
  alt?: string;
  className?: string;
  showAmbientEffects?: boolean;
};

const stateLabels: Record<VoiceAvatarState, string> = {
  idle: "SafeSpeak voice assistant ready",
  listening: "SafeSpeak voice assistant listening",
  processing: "SafeSpeak voice assistant processing",
  userSpeaking: "SafeSpeak voice assistant hearing your voice",
  aiSpeaking: "SafeSpeak voice assistant speaking",
};

export function VoiceAvatarAnimation({
  state,
  size = "large",
  alt = "SafeSpeak assistant voice avatar",
  className = "",
  showAmbientEffects = false,
}: VoiceAvatarAnimationProps) {
  const wrapperClassName = [
    styles.avatar,
    styles[size],
    styles[state],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const ariaLabel =
    alt && !/sphere/i.test(alt)
      ? `${alt}: ${stateLabels[state]}`
      : stateLabels[state];

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      data-testid="voice-avatar-animation"
      data-voice-state={state}
      data-voice-size={size}
      className={wrapperClassName}
    >
      <span className={styles.aura} aria-hidden="true" />
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles.ringTwo} aria-hidden="true" />
      <span className={styles.waveform} aria-hidden="true">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index} className={styles.waveBar} />
        ))}
      </span>
      <span className={styles.micShell} aria-hidden="true">
        <span className={styles.micPlate}>
          <IconMicrophone className={styles.micIcon} stroke={2.2} />
        </span>
      </span>
      {showAmbientEffects ? (
        <span className={styles.ambientGlow} aria-hidden="true" />
      ) : null}
    </div>
  );
}

export default VoiceAvatarAnimation;
