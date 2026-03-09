"use client";

import { useMemo, useRef } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import sphereAdv from "@/assets/sphere-adv.svg?url";

import styles from "./AssistantSphereAnimated.module.css";

const TAU = Math.PI * 2;

function resolveImageSrc(source) {
  if (typeof source === "string") {
    return source;
  }

  if (source && typeof source === "object") {
    if (typeof source.src === "string") {
      return source.src;
    }

    if (typeof source.default === "string") {
      return source.default;
    }

    if (
      source.default &&
      typeof source.default === "object" &&
      typeof source.default.src === "string"
    ) {
      return source.default.src;
    }
  }

  return "";
}

function InnerParticles({ count = 900 }) {
  const pointsRef = useRef(null);
  const geometryRef = useRef(null);

  const { basePositions, positions, colors, seeds } = useMemo(() => {
    const basePositionBuffer = new Float32Array(count * 3);
    const positionBuffer = new Float32Array(count * 3);
    const colorBuffer = new Float32Array(count * 3);
    const seedBuffer = new Float32Array(count);

    const startColor = new THREE.Color("#6db8ff");
    const endColor = new THREE.Color("#f58fd3");
    const mixedColor = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const radius = 0.82 * Math.cbrt(Math.random());
      const theta = Math.random() * TAU;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      basePositionBuffer[i3] = x;
      basePositionBuffer[i3 + 1] = y;
      basePositionBuffer[i3 + 2] = z;

      positionBuffer[i3] = x;
      positionBuffer[i3 + 1] = y;
      positionBuffer[i3 + 2] = z;

      const mixAmount = Math.random();
      mixedColor.copy(startColor).lerp(endColor, mixAmount);
      colorBuffer[i3] = mixedColor.r;
      colorBuffer[i3 + 1] = mixedColor.g;
      colorBuffer[i3 + 2] = mixedColor.b;

      seedBuffer[index] = Math.random();
    }

    return {
      basePositions: basePositionBuffer,
      positions: positionBuffer,
      colors: colorBuffer,
      seeds: seedBuffer,
    };
  }, [count]);

  useFrame(({ clock }) => {
    if (!geometryRef.current || !pointsRef.current) {
      return;
    }

    const time = clock.elapsedTime * 0.24;

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const seed = seeds[index];

      const baseX = basePositions[i3];
      const baseY = basePositions[i3 + 1];
      const baseZ = basePositions[i3 + 2];

      const swirl = time * (0.32 + seed * 0.36) + seed * TAU;
      const swirlCos = Math.cos(swirl);
      const swirlSin = Math.sin(swirl);

      const rotatedX = baseX * swirlCos - baseZ * swirlSin;
      const rotatedZ = baseX * swirlSin + baseZ * swirlCos;
      const drift = Math.sin(time * 1.7 + seed * 11) * 0.03;

      positions[i3] = rotatedX + baseY * drift * 0.2;
      positions[i3 + 1] = baseY + drift;
      positions[i3 + 2] = rotatedZ + baseX * drift * 0.2;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.16;
    pointsRef.current.rotation.x = Math.sin(time * 0.5) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.016}
        sizeAttenuation
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function AssistantSphereAnimated({
  imageSrc = sphereAdv,
  alt = "SafeSpeak assistant sphere",
  particleCount = 900,
  fillParent = false,
  className = "",
}) {
  const resolvedImageSrc = resolveImageSrc(imageSrc);
  const baseSizeClassName = fillParent
    ? "h-full w-full"
    : "h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] xl:h-[311.31px] xl:w-[311.31px]";
  const wrapperClassName =
    `relative ${baseSizeClassName} ${styles.wrapper} ${className}`.trim();

  return (
    <div className={wrapperClassName}>
      <div className={styles.particlesLayer}>
        <Canvas
          className={styles.canvas}
          dpr={[1, 1.7]}
          camera={{ position: [0, 0, 2.3], fov: 44 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <InnerParticles count={particleCount} />
        </Canvas>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedImageSrc}
        alt={alt}
        draggable={false}
        className={styles.sphereImage}
      />
    </div>
  );
}
