"use client";

import { Canvas } from "@react-three/fiber";
import LandingScene from "@/components/LandingScene";

export default function Home() {
  return (
    <main className="w-screen h-screen bg-white">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ antialias: true }}
      >
        <LandingScene />
      </Canvas>
    </main>
  );
}
