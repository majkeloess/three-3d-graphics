"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls, Environment } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const colors = [
  "#ff6b6b",
  "#4ecdc4",
  "#95e1d3",
  "#feca57",
  "#48dbfb",
  "#ff9ff3",
  "#a29bfe",
  "#fd79a8",
  "#00b894",
  "#ff7675",
  "#74b9ff",
  "#55efc4",
  "#ffeaa7",
  "#fab1a0",
  "#e17055",
  "#0984e3",
  "#6c5ce7",
  "#a29bfe",
  "#fd79a8",
  "#fdcb6e",
];

const MainTitle3D = ({ font }: { font: Font }) => {
  const geometry = useMemo(() => {
    const geo = new TextGeometry("Grafika 3D", {
      font: font,
      size: 2,
      depth: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    geo.center();
    return geo;
  }, [font]);

  return (
    <mesh position={[0, 2, 0]} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#000000" metalness={0.7} roughness={0.3} />
    </mesh>
  );
};

const FloatingText3D = ({
  position,
  color,
  rotationSpeed,
  floatSpeed,
  fontSize,
  font,
}: {
  position: [number, number, number];
  color: string;
  rotationSpeed: number;
  floatSpeed: number;
  fontSize: number;
  font: any;
}) => {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y += rotationSpeed * 0.01;
      groupRef.current.rotation.x += Math.sin(time * floatSpeed) * 0.01;
      groupRef.current.rotation.z += Math.cos(time * floatSpeed * 0.7) * 0.01;

      const floatY = Math.sin(time * floatSpeed + position[0]) * 0.3;
      const floatX = Math.cos(time * floatSpeed * 0.8 + position[1]) * 0.2;
      const floatZ = Math.sin(time * floatSpeed * 0.6 + position[2]) * 0.2;

      groupRef.current.position.x = position[0] + floatX;
      groupRef.current.position.y = position[1] + floatY;
      groupRef.current.position.z = position[2] + floatZ;
    }
  });

  const geometry = useMemo(() => {
    if (!font) return null;
    const geo = new TextGeometry("3.0", {
      font: font,
      size: fontSize,
      depth: fontSize * 0.25,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: fontSize * 0.04,
      bevelSize: fontSize * 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    geo.center();
    return geo;
  }, [font, fontSize]);

  if (!font || !geometry) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

const LandingScene = () => {
  const mainGroupRef = useRef<Group>(null);
  const { camera } = useThree();
  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  useFrame((state) => {
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

      const distance = camera.position.distanceTo(new Vector3(0, 1, 0));
      const scale = distance / 15;
      mainGroupRef.current.scale.setScalar(scale);
    }
  });

  const floatingTexts = useMemo(() => {
    const texts = [];
    const count = 250;

    for (let i = 0; i < count; i++) {
      const sphereRadius = 3 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);

      const fontSize = 0.5 + Math.random() * 1.2;

      texts.push({
        position: [x, y, z] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotationSpeed: (Math.random() - 0.5) * 3,
        floatSpeed: 0.3 + Math.random() * 1.2,
        fontSize,
      });
    }
    return texts;
  }, []);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#ff6b9d" />

      <Environment preset="city" />

      <group ref={mainGroupRef} position={[0, 1, 0]}>
        {font && (
          <>
            <MainTitle3D font={font} />
            <Text
              position={[0, 0, 0]}
              fontSize={0.8}
              color="#333333"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#ffffff"
            >
              proszę o 3.0🙏, pozdrawiam i życzę miłego dnia
            </Text>
          </>
        )}
      </group>

      {font &&
        floatingTexts.map((text, index) => (
          <FloatingText3D
            key={index}
            position={text.position}
            color={text.color}
            rotationSpeed={text.rotationSpeed}
            floatSpeed={text.floatSpeed}
            fontSize={text.fontSize}
            font={font}
          />
        ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={8}
        maxDistance={35}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </>
  );
};

export default LandingScene;
