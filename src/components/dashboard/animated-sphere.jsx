"use client";

import { useEffect, useMemo, useRef } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import sphereAdv from "../../assets/sphere-adv.svg?url";

const PARTICLE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uPointSize;

  attribute float aSeed;
  attribute float aScale;

  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;
    float t = uTime * (0.22 + aSeed * 0.7);
    float swirl = t + aSeed * 6.28318530718;

    mat2 spinA = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl));
    mat2 spinB = mat2(cos(swirl * 0.65), -sin(swirl * 0.65), sin(swirl * 0.65), cos(swirl * 0.65));
    p.xz = spinA * p.xz;
    p.xy = spinB * p.xy;

    float drift = sin(t * 2.1 + aSeed * 11.0) * 0.045;
    p *= 0.94 + drift;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthFactor = 1.0 / max(1.0, -mvPosition.z);
    float pulse = 0.72 + 0.28 * sin(t * 3.1 + aSeed * 9.0);
    gl_PointSize = uPointSize * aScale * depthFactor * pulse;

    vAlpha = 0.55 + 0.45 * pulse;
    vMix = aSeed;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying float vAlpha;
  varying float vMix;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float soft = smoothstep(0.52, 0.0, dist);

    vec3 color = mix(uColorA, uColorB, clamp(vMix + 0.2, 0.0, 1.0));
    float alpha = soft * vAlpha * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

function InnerParticles({ count = 1400 }) {
  const materialRef = useRef(null);

  const { positions, seeds, scales } = useMemo(() => {
    const particlePositions = new Float32Array(count * 3);
    const particleSeeds = new Float32Array(count);
    const particleScales = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const radius = 0.84 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);

      particleSeeds[index] = Math.random();
      particleScales[index] = 0.45 + Math.random() * 1.3;
    }

    return {
      positions: particlePositions,
      seeds: particleSeeds,
      scales: particleScales,
    };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointSize: { value: 12 },
      uColorA: { value: new THREE.Color("#6de2ff") },
      uColorB: { value: new THREE.Color("#ff8fd7") },
      uOpacity: { value: 0.85 },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX_SHADER}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ParticleScene({ particleCount }) {
  return (
    <>
      <InnerParticles count={particleCount} />
    </>
  );
}

export function AnimatedSphere({
  imageSrc = sphereAdv,
  alt = "Animated assistant sphere",
  className = "",
  particleCount = 1400,
  maxSize = 360,
  interactive = true,
}) {
  const wrapperRef = useRef(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    if (!interactive || !wrapperRef.current) {
      return undefined;
    }

    const node = wrapperRef.current;

    const tick = () => {
      currentTiltRef.current.x +=
        (targetTiltRef.current.x - currentTiltRef.current.x) * 0.08;
      currentTiltRef.current.y +=
        (targetTiltRef.current.y - currentTiltRef.current.y) * 0.08;

      node.style.transform = `perspective(900px) rotateX(${currentTiltRef.current.y * 4}deg) rotateY(${currentTiltRef.current.x * 4}deg)`;
      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [interactive]);

  const handlePointerMove = (event) => {
    if (!interactive || !wrapperRef.current) {
      return;
    }

    const bounds = wrapperRef.current.getBoundingClientRect();
    const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
    const ny = (event.clientY - bounds.top) / bounds.height - 0.5;

    targetTiltRef.current.x = nx;
    targetTiltRef.current.y = -ny;
  };

  const handlePointerLeave = () => {
    targetTiltRef.current.x = 0;
    targetTiltRef.current.y = 0;
  };

  return (
    <div
      ref={wrapperRef}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: `${maxSize}px`,
        aspectRatio: "1 / 1",
        marginInline: "auto",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          overflow: "hidden",
          clipPath: "circle(50% at 50% 50%)",
        }}
      >
        <Canvas
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 2.35], fov: 42 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          <ParticleScene particleCount={particleCount} />
        </Canvas>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={alt}
        draggable={false}
        style={{
          position: "relative",
          zIndex: 2,
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}

export default AnimatedSphere;
