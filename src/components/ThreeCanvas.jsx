import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles({ count = 2000 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta) * (0.5 + Math.random());
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * (0.5 + Math.random());
      pos[i * 3 + 2] = radius * Math.cos(phi) * (0.5 + Math.random());
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.2;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.008}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function WireframeOrb() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.12;
      ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshBasicMaterial
          color="#9945ff"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}

function GlowOrb({ position, color, scale = 1 }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.7 + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.08 * scale, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function Scene({ mousePosition }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const targetX = mousePosition.current.x * 0.3;
      const targetY = mousePosition.current.y * 0.2;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <WireframeOrb />
      <FloatingParticles />
      <GlowOrb position={[1.6, 0.3, 0.2]} color="#00f0ff" scale={1.5} />
      <GlowOrb position={[-1.4, 0.6, -0.3]} color="#9945ff" scale={1.2} />
      <GlowOrb position={[0.2, 1.8, 0.4]} color="#ffffff" scale={0.8} />
      <GlowOrb position={[-0.5, -1.6, 0.6]} color="#00f0ff" />
      <GlowOrb position={[1.2, -1.0, -0.8]} color="#9945ff" scale={0.9} />
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#00f0ff" />
      <pointLight position={[-2, -2, -2]} intensity={0.4} color="#9945ff" />
    </group>
  );
}

export default function ThreeCanvas({ mousePosition }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
