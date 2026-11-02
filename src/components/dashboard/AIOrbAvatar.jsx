"use client";

/**
 * AIOrbAvatar — Elite Tier-1 Volumetric Plasma Orb AI Avatar
 *
 * Designed and engineered using React Three Fiber (R3F) and advanced GLSL.
 * Custom built for perfect mathematical edge smoothing, volumetric transparency,
 * and high-fidelity fluid motion of stardust particles.
 */

import { useMemo, useRef, useState } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════
// GLSL — 3D Simplex & fBM Noise Engine
// ═══════════════════════════════════════════════════════════════════
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(p);
    p *= 2.08;
    amplitude *= 0.48;
  }
  return value;
}
`;

// ═══════════════════════════════════════════════════════════════════
// GLSL — Volumetric Core Vertex Shader
// ═══════════════════════════════════════════════════════════════════
const CORE_VERTEX = /* glsl */ `
${NOISE_GLSL}

uniform float u_time;
uniform float u_audio_intensity;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vNoise;

void main() {
  float t = u_time * 0.16;

  // Multi-frequency surface displacement (fBM)
  vec3 noiseCoord = position * 1.8 + vec3(0.0, t * 0.8, t * 0.5);
  float n = fbm(noiseCoord);

  // Audio-reactive scale pulse + surface breathing
  float pulse = 1.0 + u_audio_intensity * 0.09 * sin(u_time * 5.0);
  float displacement = n * (0.07 + u_audio_intensity * 0.06);
  vec3 newPosition = position * pulse + normal * displacement;

  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(newPosition, 1.0)).xyz;
  vNoise = n;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

// ═══════════════════════════════════════════════════════════════════
// GLSL — Volumetric Core Fragment Shader
// ═══════════════════════════════════════════════════════════════════
const CORE_FRAGMENT = /* glsl */ `
${NOISE_GLSL}


uniform float u_time;
uniform float u_audio_intensity;
uniform vec3 u_color_deep;      // Deep ocean abyss navy/indigo
uniform vec3 u_color_mid;       // Vibrant azure blue
uniform vec3 u_color_accent;    // Electric cyan / aqua
uniform vec3 u_color_fire;      // Glowing turquoise / soft white flare

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vNoise;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 normalVec = normalize(vNormal);

  // ── Fresnel Rim calculation for volumetric outer transparency ──
  float fresnel = pow(1.0 - max(dot(viewDir, normalVec), 0.0), 3.0);
  float edgeGlow = smoothstep(0.0, 1.0, fresnel);

  // ── Absolute Edge Alpha Falloff (Hard constraint for perfect circular edges) ──
  float ndotv = max(dot(viewDir, normalVec), 0.0);
  float edgeFade = smoothstep(0.0, 0.08, ndotv);

  // ── Multi-octave Volumetric Plasma Noise ──
  float t = u_time * 0.16;
  vec3 p1 = vWorldPos * 2.5 + vec3(0.0, t * 0.6, t * 0.3);
  float l1 = fbm(p1);
  vec3 p2 = vWorldPos * 4.2 - vec3(t * 0.3, t * 0.5, 0.0);
  float l2 = fbm(p2) * 0.55;
  float combinedNoise = l1 + l2;

  // ── Color blend math: deep indigo → vibrant azure blue → electric cyan ──
  float colorMixVal = smoothstep(-0.4, 0.35, combinedNoise);
  vec3 color = mix(u_color_deep, u_color_mid, colorMixVal);

  float cyanMixVal = smoothstep(0.2, 0.8, combinedNoise);
  color = mix(color, u_color_accent, cyanMixVal * 0.65);

  // ── Glowing aqua/white hotspots at noise peaks & bottom hemisphere ──
  float fireHeight = smoothstep(0.1, -0.6, vWorldPos.y); // concentrated at bottom
  float fireNoise = smoothstep(0.48, 0.88, combinedNoise);
  float fireIntensity = max(fireHeight * 0.45, fireNoise * 0.55);
  fireIntensity *= (0.55 + u_audio_intensity * 1.1); // boosted by audio input
  color = mix(color, u_color_fire, clamp(fireIntensity * 0.72, 0.0, 0.7));

  // ── Contrast boost: push valleys darker ──
  float darknessVal = smoothstep(0.0, -0.5, combinedNoise);
  color *= (1.0 - darknessVal * 0.65);

  // ── Add subtle internal luminance variation ──
  float internalGlow = smoothstep(-0.15, 0.55, vNoise) * 0.18;
  color += internalGlow * u_color_mid;

  // ── Edge glow color blend ──
  vec3 rimColor = mix(u_color_mid, u_color_accent, 0.38);
  color = mix(color, rimColor, edgeGlow * 0.32);

  // ── Alpha: mathematical falloff + fresnel transparency ──
  float alpha = 0.9 - edgeGlow * 0.28;
  alpha = clamp(alpha, 0.42, 0.95);
  alpha *= edgeFade; // forces edge to fade perfectly to 0.0 (anti-aliased circular mask)

  gl_FragColor = vec4(color, alpha);
}
`;

// ═══════════════════════════════════════════════════════════════════
// GLSL — Atmospheric Soft Glow Halo
// ═══════════════════════════════════════════════════════════════════
const HALO_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const HALO_FRAGMENT = /* glsl */ `
uniform vec3 u_glow_color;
uniform float u_audio_intensity;
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 normalVec = normalize(vNormal);

  float fresnel = pow(1.0 - max(dot(viewDir, normalVec), 0.0), 3.2);
  float strength = 0.5 + u_audio_intensity * 0.32;

  // Fade out smoothly at absolute geometric edge to avoid hard bounds
  float ndotv = max(dot(viewDir, normalVec), 0.0);
  float edgeFade = smoothstep(0.0, 0.2, ndotv);

  gl_FragColor = vec4(u_glow_color, fresnel * strength * edgeFade);
}
`;

// ═══════════════════════════════════════════════════════════════════
// GLSL — Stardust Particles Shaders
// ═══════════════════════════════════════════════════════════════════
const PARTICLE_VERTEX = /* glsl */ `
uniform float u_time;
uniform float u_audio_intensity;

attribute float aSeed;
attribute float aScale;

varying float vPulse;
varying float vSeed;

void main() {
  vec3 p = position;
  float speed = 0.16 + aSeed * 0.22;
  float t = u_time * speed;

  // Elegant orbital rotational currents
  float angleXZ = t + aSeed * 6.28318;
  mat2 rotXZ = mat2(cos(angleXZ * 0.35), -sin(angleXZ * 0.35), sin(angleXZ * 0.35), cos(angleXZ * 0.35));
  p.xz = rotXZ * p.xz;

  float angleXY = t * 0.18;
  mat2 rotXY = mat2(cos(angleXY), -sin(angleXY), sin(angleXY), cos(angleXY));
  p.xy = rotXY * p.xy;

  // Fluid multi-frequency drift
  p.x += sin(t * 1.1 + aSeed * 10.0) * 0.08;
  p.y += cos(t * 0.85 + aSeed * 14.0) * 0.08;
  p.z += sin(t * 1.35 + aSeed * 18.0) * 0.08;

  // Sparkle / breathing pulse
  float pulse = 0.55 + 0.45 * sin(t * 2.2 + aSeed * 22.0);
  vPulse = pulse;
  vSeed = aSeed;

  vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPos;

  // Soft depth attenuation and moderate size for volumetric cloud blending
  float depthFade = 1.0 / (1.0 + length(mvPos.xyz) * 0.35);
  gl_PointSize = aScale * pulse * (55.0 * depthFade);
}
`;

const PARTICLE_FRAGMENT = /* glsl */ `
uniform vec3 u_particle_color_a;
uniform vec3 u_particle_color_b;
uniform float u_opacity;

varying float vPulse;
varying float vSeed;

void main() {
  // Gaussian-like falloff for ultra-soft volumetric blending (no sharp edges)
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  float alphaSoft = exp(-dist * dist * 9.0);

  vec3 color = mix(u_particle_color_a, u_particle_color_b, clamp(vSeed + vPulse * 0.15, 0.0, 1.0));
  float opacity = alphaSoft * u_opacity * (0.5 + vPulse * 0.5);

  gl_FragColor = vec4(color, opacity);
}
`;

// ═══════════════════════════════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════════════════════════════

function PlasmaCore({ audioIntensityRef }) {
  const matRef = useRef(null);
  const accumulatedTimeRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_audio_intensity: { value: 0 },
      u_color_deep: { value: new THREE.Color("#01091a") },   // Deep blue abyss
      u_color_mid: { value: new THREE.Color("#0055ff") },    // Vibrant azure blue
      u_color_accent: { value: new THREE.Color("#00e5ff") }, // Electric cyan / aqua
      u_color_fire: { value: new THREE.Color("#a6f9ff") },   // Glowing turquoise/white
    }),
    []
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      // Accumulate time using delta to prevent speed compounding over elapsed time
      accumulatedTimeRef.current += delta;
      matRef.current.uniforms.u_time.value = accumulatedTimeRef.current;
      matRef.current.uniforms.u_audio_intensity.value = audioIntensityRef.current;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={CORE_VERTEX}
        fragmentShader={CORE_FRAGMENT}
        transparent
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function AtmosphericHalo({ audioIntensityRef }) {
  const matRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      u_glow_color: { value: new THREE.Color("#0088ff") },  // Azure halo
      u_audio_intensity: { value: 0 },
    }),
    []
  );

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.u_audio_intensity.value = audioIntensityRef.current;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.2, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={HALO_VERTEX}
        fragmentShader={HALO_FRAGMENT}
        transparent
        toneMapped={false}
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function StardustParticles({ count = 400, audioIntensityRef }) {
  const matRef = useRef(null);
  const accumulatedTimeRef = useRef(0);

  // Spawns particles strictly within a sphere mathematically
  const { positions, seeds, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sd = new Float32Array(count);
    const sc = new Float32Array(count);
    const sphereRadius = 0.82;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Cube root distribution for uniform volumetric density inside sphere
      const r = sphereRadius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      sd[i] = Math.random();
      sc[i] = 0.45 + Math.random() * 1.35;
    }

    return { positions: pos, seeds: sd, scales: sc };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_audio_intensity: { value: 0 },
      u_particle_color_a: { value: new THREE.Color("#00f0ff") }, // Electric cyan stardust
      u_particle_color_b: { value: new THREE.Color("#7f9eff") }, // Soft lavender-blue stardust
      u_opacity: { value: 0.72 },                               // Bright opacity for internal glow
    }),
    []
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      // Accumulate time using delta to prevent speed compounding over elapsed time
      accumulatedTimeRef.current += delta;
      matRef.current.uniforms.u_time.value = accumulatedTimeRef.current;
      matRef.current.uniforms.u_audio_intensity.value = audioIntensityRef.current;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const VOICE_MOTION_PROFILES = {
  idle: {
    hoverAmplitude: 0.026,
    hoverSpeed: 0.92,
    rotateYSpeed: 0.04,
    rotateXAmplitude: 0.022,
    rotateXSpeed: 0.24,
    intensityBase: 0.06,
    intensityAmplitude: 0.05,
    intensitySpeed: 1.9,
    intensityCadence: 1.05,
    lerpFactor: 0.04,
  },
  listening: {
    hoverAmplitude: 0.032,
    hoverSpeed: 1.08,
    rotateYSpeed: 0.05,
    rotateXAmplitude: 0.026,
    rotateXSpeed: 0.28,
    intensityBase: 0.14,
    intensityAmplitude: 0.1,
    intensitySpeed: 2.2,
    intensityCadence: 1.25,
    lerpFactor: 0.058,
  },
  userSpeaking: {
    hoverAmplitude: 0.046,
    hoverSpeed: 1.55,
    rotateYSpeed: 0.072,
    rotateXAmplitude: 0.04,
    rotateXSpeed: 0.42,
    intensityBase: 0.42,
    intensityAmplitude: 0.28,
    intensitySpeed: 4.2,
    intensityCadence: 2.8,
    lerpFactor: 0.14,
  },
  aiSpeaking: {
    hoverAmplitude: 0.042,
    hoverSpeed: 1.32,
    rotateYSpeed: 0.064,
    rotateXAmplitude: 0.036,
    rotateXSpeed: 0.36,
    intensityBase: 0.34,
    intensityAmplitude: 0.22,
    intensitySpeed: 3.5,
    intensityCadence: 2.2,
    lerpFactor: 0.12,
  },
};

function OrbScene({ voiceState, showAmbientEffects }) {
  const groupRef = useRef(null);
  const audioIntensityRef = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const profile =
      VOICE_MOTION_PROFILES[voiceState] ?? VOICE_MOTION_PROFILES.idle;

    // ── Hover Physics (Sine Wave) ──
    groupRef.current.position.y =
      Math.sin(t * profile.hoverSpeed) * profile.hoverAmplitude;

    // ── Continuous Elegant Drift (delta-accumulated to prevent speed changes from compounding) ──
    groupRef.current.rotation.y += delta * profile.rotateYSpeed;
    groupRef.current.rotation.x =
      Math.sin(t * profile.rotateXSpeed) * profile.rotateXAmplitude;

    const pulse =
      (Math.sin(t * profile.intensitySpeed) * 0.5 + 0.5) *
      (0.72 + 0.28 * Math.abs(Math.sin(t * profile.intensityCadence)));
    const targetIntensity =
      profile.intensityBase + profile.intensityAmplitude * pulse;

    audioIntensityRef.current = THREE.MathUtils.lerp(
      audioIntensityRef.current,
      targetIntensity,
      profile.lerpFactor
    );

    const visiblePulse =
      1 + audioIntensityRef.current * 0.1 + Math.sin(t * (profile.hoverSpeed * 1.8)) * 0.008;
    groupRef.current.scale.setScalar(visiblePulse);
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <pointLight intensity={0.8} color="#8055ff" position={[2, 2, 3]} />
      <pointLight intensity={0.6} color="#ff3388" position={[-2, -1.5, 2.5]} />
      {showAmbientEffects ? (
        <StardustParticles count={300} audioIntensityRef={audioIntensityRef} />
      ) : null}
      <PlasmaCore audioIntensityRef={audioIntensityRef} />
      {showAmbientEffects ? (
        <AtmosphericHalo audioIntensityRef={audioIntensityRef} />
      ) : null}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Main Exported Component
// ═══════════════════════════════════════════════════════════════════

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.size]
 * @param {boolean} [props.showControls]
 * @param {boolean} [props.showAmbientEffects]
 * @param {"idle"|"listening"|"userSpeaking"|"aiSpeaking"} [props.voiceState]
 */
export default function AIOrbAvatar({
  className = "",
  size = "clamp(200px, 42vw, 320px)",
  showControls = false,
  showAmbientEffects = true,
  voiceState: externalVoiceState = undefined,
}) {
  const [internalVoiceActive, setInternalVoiceActive] = useState(false);
  const voiceState =
    externalVoiceState !== undefined
      ? externalVoiceState
      : internalVoiceActive
        ? "userSpeaking"
        : "idle";
  const isVoiceActive =
    voiceState === "listening" ||
    voiceState === "userSpeaking" ||
    voiceState === "aiSpeaking";

  return (
    <div
      className={`relative mx-auto aspect-square ${className}`.trim()}
      style={{ width: size }}
      aria-label="AI voice assistant avatar"
      role="img"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.65], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ background: "transparent" }}
      >
        <OrbScene
          voiceState={voiceState}
          showAmbientEffects={showAmbientEffects}
        />
      </Canvas>

      {/* ── Voice simulation toggle (dev/demo overlay) ── */}
      {showControls && (
        <button
          type="button"
          onClick={() => setInternalVoiceActive((v) => !v)}
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 22px",
            borderRadius: "24px",
            border: "none",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            cursor: "pointer",
            color: "#fff",
            background: isVoiceActive
              ? "linear-gradient(135deg, #ff00a0, #ffaa00)"
              : "linear-gradient(135deg, #3c1278, #8844ff)",
            boxShadow: isVoiceActive
              ? "0 4px 22px rgba(255, 0, 160, 0.4)"
              : "0 4px 22px rgba(60, 18, 120, 0.3)",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {isVoiceActive ? "● Voice Active" : "○ Simulate Voice"}
        </button>
      )}
    </div>
  );
}
