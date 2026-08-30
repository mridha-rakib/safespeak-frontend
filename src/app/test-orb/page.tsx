"use client";

import AIOrbAvatar from "@/components/dashboard/AIOrbAvatar";

export default function TestOrbPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0c0c1d 0%, #1a1030 50%, #0d0d1f 100%)",
        gap: "32px",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#e0d0ff",
          fontSize: "24px",
          fontWeight: 300,
          letterSpacing: "0.06em",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        AI Orb Avatar — Test Page
      </h1>

      <AIOrbAvatar
        size="320px"
        showControls
      />

      <p
        style={{
          color: "#8878aa",
          fontSize: "13px",
          textAlign: "center",
          maxWidth: "400px",
          lineHeight: 1.6,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Click &quot;Simulate Voice&quot; below the orb to test audio reactivity.
      </p>
    </div>
  );
}
