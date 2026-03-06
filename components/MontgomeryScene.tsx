'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Preload } from '@react-three/drei';
import * as THREE from 'three';

interface LandmarkMarker {
  position: [number, number, number];
  color: string;
  scale: number;
  label: string;
}

const landscapeMarkers: LandmarkMarker[] = [
  {
    position: [-3, 1, -8],
    color: '#fbbf24',
    scale: 0.4,
    label: 'National Memorial for Peace and Justice',
  },
  {
    position: [2, -1, -6],
    color: '#34d399',
    scale: 0.35,
    label: 'Freedom Monument',
  },
  {
    position: [-5, 2, -10],
    color: '#60a5fa',
    scale: 0.3,
    label: 'Legacy Museum',
  },
  {
    position: [4, 0, -7],
    color: '#f472b6',
    scale: 0.35,
    label: 'Rosa Parks Statue',
  },
  {
    position: [-1, 1.5, -5],
    color: '#a78bfa',
    scale: 0.3,
    label: 'Civil Rights Memorial',
  },
  {
    position: [3, -0.5, -9],
    color: '#fb923c',
    scale: 0.32,
    label: 'Alabama Bicentennial Park',
  },
  {
    position: [-4, 0.5, -7],
    color: '#fbbf24',
    scale: 0.28,
    label: 'Hank Williams Memorial',
  },
];

// Animated marker component
const AnimatedMarker: React.FC<{ marker: LandmarkMarker }> = ({ marker }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Pulse animation
    pulseRef.current += 0.03;
    const scale = marker.scale + Math.sin(pulseRef.current) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);

    // Gentle rotation
    meshRef.current.rotation.z += 0.005;

    // Vertical bob
    meshRef.current.position.y = marker.position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={marker.position}>
      <octahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color={marker.color}
        emissive={marker.color}
        emissiveIntensity={0.5}
        wireframe={false}
      />
    </mesh>
  );
};

// Animated camera movement
const CameraController = () => {
  useFrame((state) => {
    // Slow camera drift and rotation
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
    state.camera.position.y = 0.5 + Math.cos(state.clock.elapsedTime * 0.08) * 0.5;
    state.camera.position.z = 5 + Math.sin(state.clock.elapsedTime * 0.12) * 0.5;

    state.camera.lookAt(0, 0, -8);
  });

  return null;
};

// Animated fog layer for atmosphere
const FogLayer = () => {
  return (
    <fog attach="fog" args={['#0f172a', 5, 20]} />
  );
};

// Ground plane for visual reference
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -8]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        color="#1e293b"
        metalness={0.3}
        roughness={0.8}
      />
    </mesh>
  );
};

// Ambient lighting for cinematic feel
const CinematicLighting = () => {
  return (
    <>
      {/* Main light - warm golden */}
      <directionalLight
        position={[5, 5, 8]}
        intensity={1.2}
        color="#fbbf24"
        castShadow
      />
      {/* Fill light - cool blue */}
      <directionalLight
        position={[-5, 3, -10]}
        intensity={0.6}
        color="#60a5fa"
      />
      {/* Ambient light for overall glow */}
      <ambientLight intensity={0.5} color="#fef3c7" />
      {/* Point lights on markers for glow effect */}
      <pointLight position={[-3, 1, -8]} intensity={1} color="#fbbf24" distance={10} />
    </>
  );
};

// Main 3D scene component
const MontgomeryScene = () => {
  const markers = useMemo(() => landscapeMarkers, []);

  return (
    <Canvas
      camera={{
        position: [0, 0.5, 5],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
      style={{ width: '100%', height: '100%' }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <FogLayer />
      <CinematicLighting />
      <CameraController />

      {/* Background stars */}
      <Stars radius={200} depth={100} count={3000} factor={7} saturation={0.5} fade />

      {/* Ground */}
      <Ground />

      {/* Animated landmarks */}
      {markers.map((marker, i) => (
        <AnimatedMarker key={i} marker={marker} />
      ))}

      {/* Ambient particles effect */}
      <Preload all />
    </Canvas>
  );
};

export default MontgomeryScene;
