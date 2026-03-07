'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Preload } from '@react-three/drei';
import * as THREE from 'three';

// ─── Peace Memorial: tall column cluster (slab-style) ────────────────────────
const PeaceMemorial = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow breathing scale
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.015;
    groupRef.current.scale.set(pulse, pulse, pulse);
    // Gentle vertical bob
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
  });

  // 6 hanging steel monolith columns, evenly spaced
  const columns = useMemo(() => [
    { x: -2.4, z: -9 },
    { x: -1.2, z: -9.3 },
    { x:  0.0, z: -9 },
    { x:  1.2, z: -9.3 },
    { x:  2.4, z: -9 },
    { x:  3.4, z: -8.8 },
  ], []);

  return (
    <group ref={groupRef} position={[-1, 3, 0]}>
      {columns.map((col, i) => (
        <mesh key={i} position={[col.x, 0, col.z]}>
          <boxGeometry args={[0.18, 1.8, 0.18]} />
          <meshStandardMaterial
            color="#c8a96e"
            emissive="#fbbf24"
            emissiveIntensity={0.25}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Warm point light to simulate the memorial glow */}
      <pointLight position={[0, 0, -9]} intensity={2.5} color="#fbbf24" distance={8} decay={2} />
    </group>
  );
};

// ─── Freedom Monument: tall obelisk/spire ─────────────────────────────────────
const FreedomMonument = () => {
  const spireRef = useRef<THREE.Mesh>(null);
  const baseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!spireRef.current) return;
    // Slow rotation
    spireRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    // Pulse the emissive intensity
    const mat = spireRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
  });

  return (
    <group position={[3.5, -2, -6]}>
      {/* Base plinth */}
      <mesh ref={baseRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.25, 0.7]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Obelisk shaft */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.3, 2.2, 0.3]} />
        <meshStandardMaterial
          color="#f0f4ff"
          emissive="#60a5fa"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* Pyramid cap */}
      <mesh ref={spireRef} position={[0, 2.5, 0]}>
        <coneGeometry args={[0.22, 0.55, 4]} />
        <meshStandardMaterial
          color="#bfdbfe"
          emissive="#38bdf8"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Cool blue light */}
      <pointLight position={[0, 2, 0]} intensity={2} color="#60a5fa" distance={7} decay={2} />
    </group>
  );
};

// ─── Cinematic camera: slow pan between the two key landmarks ─────────────────
const CameraController = () => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow figure-8 orbit weighted toward the two landmarks
    state.camera.position.x = Math.sin(t * 0.07) * 3;
    state.camera.position.y = 0.8 + Math.cos(t * 0.05) * 0.6;
    state.camera.position.z = 5 + Math.sin(t * 0.09) * 1;
    // Look between the two monuments
    state.camera.lookAt(0.5, 0.5, -8);
  });
  return null;
};

// Particle positions computed once at module load — keeps Math.random() out of render
const PARTICLE_COUNT = 120;
const PARTICLE_POSITIONS = (() => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 20;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
    arr[i * 3 + 2] = -5 - Math.random() * 10;
  }
  return arr;
})();

// ─── Subtle ambient particles (floating dust) ─────────────────────────────────
const AmbientParticles = () => {
  const meshRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(PARTICLE_POSITIONS, 3));
    return geo;
  }, []);

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial color="#fef3c7" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

// ─── Cinematic lighting ────────────────────────────────────────────────────────
const CinematicLighting = () => (
  <>
    {/* Warm golden key light (Peace Memorial) */}
    <directionalLight position={[5, 8, 6]} intensity={1.4} color="#fbbf24" castShadow />
    {/* Cool blue fill (Freedom Monument) */}
    <directionalLight position={[-6, 4, -10]} intensity={0.7} color="#60a5fa" />
    {/* Soft ambient */}
    <ambientLight intensity={0.35} color="#e0e7ff" />
    {/* Rim light from below for drama */}
    <pointLight position={[0, -3, -8]} intensity={0.8} color="#7c3aed" distance={14} decay={2} />
  </>
);

// ─── Ground plane ──────────────────────────────────────────────────────────────
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, -8]}>
    <planeGeometry args={[60, 60]} />
    <meshStandardMaterial color="#070d1a" metalness={0.3} roughness={0.85} />
  </mesh>
);

// ─── Pre-computed road data (module-level — SSR safe, no Math.random in hooks) ─
const ROAD_LINES_H: Array<[number, number, number, number, number]> = [
  [0, -2.46, -8,   60, 0.14],
  [0, -2.46, -3,   60, 0.10],
  [0, -2.46, -13,  60, 0.10],
];
const ROAD_LINES_V: Array<[number, number, number, number, number]> = [
  [-6, -2.46, -8, 0.14, 50],
  [ 6, -2.46, -8, 0.14, 50],
  [ 0, -2.46, -8, 0.10, 50],
];
const INTERSECTION_NODES: Array<[number, number, number]> = [
  [-6, -2.44, -3], [6, -2.44, -3],
  [-6, -2.44, -13], [6, -2.44, -13],
  [ 0, -2.44, -8],
];

// ─── 3D Montgomery City Map Grid ───────────────────────────────────────────────
const CityMapGrid = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Base city block grid */}
      <gridHelper args={[55, 22, '#1e3a5f', '#0d1a2e']} position={[0, -2.5, -8]} />

      {/* Horizontal glowing road lines */}
      {ROAD_LINES_H.map(([x, y, z, sx, sz], i) => (
        <mesh key={`rh-${i}`} position={[x, y, z]} scale={[sx, 1, sz]}>
          <boxGeometry args={[1, 0.01, 1]} />
          <meshStandardMaterial color="#1e3a6e" emissive="#3b82f6" emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
        </mesh>
      ))}

      {/* Vertical glowing road lines */}
      {ROAD_LINES_V.map(([x, y, z, sx, sz], i) => (
        <mesh key={`rv-${i}`} position={[x, y, z]} scale={[sx, 1, sz]}>
          <boxGeometry args={[1, 0.01, 1]} />
          <meshStandardMaterial color="#1e3a6e" emissive="#60a5fa" emissiveIntensity={0.35} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* Intersection glow nodes */}
      {INTERSECTION_NODES.map(([x, y, z], i) => (
        <mesh key={`node-${i}`} position={[x, y, z]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 8]} />
          <meshStandardMaterial color="#1e3a6e" emissive="#93c5fd" emissiveIntensity={1.4} metalness={0.8} roughness={0.1} />
        </mesh>
      ))}

      {/* Map area ambient light */}
      <pointLight position={[0, 1, -8]} intensity={0.5} color="#1d4ed8" distance={22} decay={2} />
    </group>
  );
};

// ─── Main exported component ──────────────────────────────────────────────────
const MontgomeryScene = () => (
  <Canvas
    camera={{ position: [0, 0.8, 5], fov: 72, near: 0.1, far: 1000 }}
    style={{ width: '100%', height: '100%' }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    dpr={[1, 1.5]}
  >
    <fog attach="fog" args={['#0a0a14', 6, 22]} />
    <CinematicLighting />
    <CameraController />

    <Stars radius={200} depth={80} count={2500} factor={6} saturation={0.4} fade speed={0.4} />

    <Ground />
    <CityMapGrid />
    <AmbientParticles />

    {/* Key landmarks */}
    <PeaceMemorial />
    <FreedomMonument />

    <Preload all />
  </Canvas>
);

export default MontgomeryScene;
