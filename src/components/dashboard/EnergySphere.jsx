"use client";

import { useMemo, useRef } from "react";

import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CORE_VERTEX_SHADER = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vNoise;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);

    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec3 basePosition = position;
    float flow = fbm(normal * 2.35 + basePosition * 1.15);
    vec3 displacedPosition = basePosition;

    vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    vNoise = flow;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const CORE_FRAGMENT_SHADER = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vNoise;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 2.6);

    float waveA = sin((vWorldPosition.y + vNoise * 4.0) * 7.0);
    float waveB = sin((vWorldPosition.x - vNoise * 3.0) * 9.0);
    float band = smoothstep(-0.2, 0.8, waveA * 0.6 + waveB * 0.4);

    vec3 flowColor = mix(uColorA, uColorB, clamp(vNoise * 1.25, 0.0, 1.0));
    flowColor = mix(flowColor, uColorC, band * 0.55);

    float alpha = 0.58 + fresnel * 0.34 + band * 0.1;
    gl_FragColor = vec4(flowColor, alpha);
  }
`;

const PARTICLE_VERTEX_SHADER = `
  uniform float uTime;

  attribute float aSeed;
  attribute float aScale;

  varying float vPulse;
  varying float vSeed;

  void main() {
    vec3 p = position;

    float t = uTime * (0.26 + aSeed * 0.38);
    float angle = t + aSeed * 6.28318530718;
    mat2 spin = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    p.xz = spin * p.xz;
    p.xy = mat2(cos(t * 0.28), -sin(t * 0.28), sin(t * 0.28), cos(t * 0.28)) * p.xy;
    p.y += sin(t * 1.8 + aSeed * 14.0) * 0.035;

    float pulse = 0.7 + 0.3 * sin(t * 2.2 + aSeed * 19.0);
    vPulse = pulse;
    vSeed = aSeed;

    vec4 modelPosition = modelMatrix * vec4(p, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float distanceFalloff = 1.0 / (1.0 + length(viewPosition.xyz) * 0.45);
    gl_PointSize = (aScale * pulse) * (70.0 * distanceFalloff);
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying float vPulse;
  varying float vSeed;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float dist = length(centered);
    float softDot = smoothstep(0.52, 0.0, dist);

    vec3 color = mix(uColorA, uColorB, clamp(vSeed + vPulse * 0.2, 0.0, 1.0));
    float alpha = softDot * uOpacity * (0.65 + vPulse * 0.35);

    gl_FragColor = vec4(color, alpha);
  }
`;

const HALO_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const HALO_FRAGMENT_SHADER = `
  uniform vec3 uGlowColor;
  uniform float uStrength;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 3.5);
    float alpha = fresnel * uStrength;
    gl_FragColor = vec4(uGlowColor, alpha);
  }
`;

const CoreMaterial = shaderMaterial(
  {
    uColorA: new THREE.Color("#3a63ff"),
    uColorB: new THREE.Color("#8e43ff"),
    uColorC: new THREE.Color("#ff8f4a"),
  },
  CORE_VERTEX_SHADER,
  CORE_FRAGMENT_SHADER
);

const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#67d6ff"),
    uColorB: new THREE.Color("#ff72c7"),
    uOpacity: 0.86,
  },
  PARTICLE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER
);

const HaloMaterial = shaderMaterial(
  {
    uGlowColor: new THREE.Color("#8fa9ff"),
    uStrength: 0.78,
  },
  HALO_VERTEX_SHADER,
  HALO_FRAGMENT_SHADER
);

extend({ CoreMaterial, ParticleMaterial, HaloMaterial });

function CoreSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <coreMaterial
        key={CoreMaterial.key}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function EnergyParticles({ count = 1500, radius = 0.84, speed = 1 }) {
  const materialRef = useRef(null);

  const { positions, seeds, scales } = useMemo(() => {
    const particlePositions = new Float32Array(count * 3);
    const particleSeeds = new Float32Array(count);
    const particleScales = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = r * Math.cos(phi);

      particleSeeds[index] = Math.random();
      particleScales[index] = 0.45 + Math.random() * 1.4;
    }

    return {
      positions: particlePositions,
      seeds: particleSeeds,
      scales: particleScales,
    };
  }, [count, radius]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime * speed;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <particleMaterial
        ref={materialRef}
        key={ParticleMaterial.key}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function OuterGlow() {
  return (
    <mesh>
      <sphereGeometry args={[1.23, 96, 96]} />
      <haloMaterial
        key={HaloMaterial.key}
        transparent
        toneMapped={false}
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function EnergySphereScene({
  particleCount = 1500,
  particleSpeed = 1,
  rotationSpeed = 0.16,
}) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * rotationSpeed;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.28) * 0.06;
    groupRef.current.rotation.z =
      Math.cos(state.clock.elapsedTime * 0.21) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.24} />
      <pointLight intensity={1.0} color="#80b7ff" position={[2.2, 1.2, 2.8]} />
      <pointLight
        intensity={0.7}
        color="#ff7dcf"
        position={[-2.4, -1.3, 2.2]}
      />
      <CoreSphere />
      <EnergyParticles count={particleCount} speed={particleSpeed} />
      <OuterGlow />
    </group>
  );
}

export default function EnergySphere({
  className = "",
  particleCount = 1500,
  particleSpeed = 1,
  rotationSpeed = 0.16,
  size = "clamp(220px, 44vw, 360px)",
}) {
  return (
    <div
      className={`relative mx-auto aspect-square ${className}`.trim()}
      style={{ width: size }}
      aria-label="Animated energy sphere"
      role="img"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.1], fov: 44 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ background: "transparent" }}
      >
        <EnergySphereScene
          particleCount={particleCount}
          particleSpeed={particleSpeed}
          rotationSpeed={rotationSpeed}
        />
      </Canvas>
    </div>
  );
}
