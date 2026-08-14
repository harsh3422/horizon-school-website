"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { MousePointer2, Pause, Play, Rotate3D, Sparkles } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";

const INK = "#08171d";
const NAVY = "#0b2731";
const LIME = "#f4c95d";
const CREAM = "#e8e5d9";
const GLASS = "#8dd9f7";

type BuildingProps = {
  position: [number, number, number];
  size: [number, number, number];
  columns: number;
  levels: number;
  accent?: boolean;
};

function Building({ position, size, columns, levels, accent = false }: BuildingProps) {
  const [width, height, depth] = size;
  const windows = useMemo(
    () =>
      Array.from({ length: columns * levels }, (_, index) => ({
        x: ((index % columns) - (columns - 1) / 2) * (width / (columns + 0.8)),
        y: (Math.floor(index / columns) - (levels - 1) / 2) * (height / (levels + 0.75)),
      })),
    [columns, height, levels, width],
  );

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={accent ? NAVY : CREAM} roughness={0.72} metalness={0.04} />
      </mesh>
      <mesh position={[0, height / 2 + 0.09, 0]} castShadow>
        <boxGeometry args={[width + 0.18, 0.18, depth + 0.18]} />
        <meshStandardMaterial color={accent ? LIME : "#f7f4e9"} roughness={0.65} />
      </mesh>
      {windows.map((window, index) => (
        <mesh key={index} position={[window.x, window.y, depth / 2 + 0.012]}>
          <boxGeometry args={[width / (columns + 2.4), height / (levels + 2.8), 0.035]} />
          <meshStandardMaterial
            color={accent && index % 3 === 0 ? LIME : GLASS}
            emissive={accent && index % 3 === 0 ? LIME : GLASS}
            emissiveIntensity={accent && index % 3 === 0 ? 0.38 : 0.08}
            roughness={0.2}
            metalness={0.35}
          />
        </mesh>
      ))}
      <mesh position={[0, -height / 2 + 0.62, depth / 2 + 0.04]}>
        <boxGeometry args={[Math.min(width * 0.25, 0.85), 1.12, 0.08]} />
        <meshStandardMaterial color={INK} roughness={0.2} metalness={0.45} />
      </mesh>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.72, 8]} />
        <meshStandardMaterial color="#76624c" roughness={1} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color="#315d4b" roughness={0.95} />
      </mesh>
      <mesh position={[0.18, 1.13, 0.06]} castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#3f715a" roughness={0.95} />
      </mesh>
    </group>
  );
}

function SolarRoof() {
  return (
    <group position={[2.9, 3.18, 0]} rotation={[0, 0, -0.08]}>
      {[-0.85, -0.28, 0.29, 0.86].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.48, 0.06, 1.32]} />
          <meshStandardMaterial color="#173e54" metalness={0.65} roughness={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function CampusBeacon({ position }: { position: [number, number, number] }) {
  const ring = useRef<Mesh>(null);
  const light = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.45;
    if (light.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2 + position[0]) * 0.12;
      light.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.025, 0.055, 1.6, 8]} />
        <meshStandardMaterial color={INK} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh ref={ring} position={[0, 1.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.025, 8, 32]} />
        <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={0.65} />
      </mesh>
      <mesh ref={light} position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function MovingLife({ animate }: { animate: boolean }) {
  const shuttle = useRef<Group>(null);
  const studentOne = useRef<Group>(null);
  const studentTwo = useRef<Group>(null);

  useFrame((state) => {
    if (!animate) return;
    const time = state.clock.elapsedTime;
    if (shuttle.current) {
      shuttle.current.position.x = Math.sin(time * 0.36) * 4.5;
      shuttle.current.position.z = 3.55;
    }
    if (studentOne.current) {
      studentOne.current.position.x = -1.5 + Math.sin(time * 0.55) * 1.1;
      studentOne.current.position.z = 2.65 + Math.cos(time * 0.55) * 0.25;
    }
    if (studentTwo.current) {
      studentTwo.current.position.x = 1.4 + Math.cos(time * 0.48) * 1.25;
      studentTwo.current.position.z = -2.8 + Math.sin(time * 0.48) * 0.25;
    }
  });

  return (
    <>
      <group ref={shuttle} position={[0, 0.18, 3.55]}>
        <mesh castShadow>
          <boxGeometry args={[1.18, 0.36, 0.5]} />
          <meshStandardMaterial color={LIME} roughness={0.35} />
        </mesh>
        <mesh position={[0.12, 0.22, 0]}>
          <boxGeometry args={[0.62, 0.22, 0.48]} />
          <meshStandardMaterial color={INK} metalness={0.3} roughness={0.25} />
        </mesh>
        {[-0.39, 0.39].map((x) => (
          <group key={x}>
            <mesh position={[x, -0.22, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
              <meshStandardMaterial color={INK} />
            </mesh>
            <mesh position={[x, -0.22, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
              <meshStandardMaterial color={INK} />
            </mesh>
          </group>
        ))}
      </group>
      <Student refObject={studentOne} color="#bd91f6" position={[-1.5, 0, 2.65]} />
      <Student refObject={studentTwo} color={LIME} position={[1.4, 0, -2.8]} />
    </>
  );
}

function Student({
  refObject,
  color,
  position,
}: {
  refObject: React.RefObject<Group | null>;
  color: string;
  position: [number, number, number];
}) {
  return (
    <group ref={refObject} position={position} scale={0.7}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.44, 10]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#8d5f48" />
      </mesh>
    </group>
  );
}

function CampusWorld({ animate }: { animate: boolean }) {
  const world = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!world.current || !animate) return;
    world.current.rotation.y += delta * 0.035;
    world.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.045 - 0.35;
  });

  return (
    <group ref={world} position={[0, -0.35, 0]} rotation={[0, -0.42, 0]}>
      <mesh position={[0, -0.26, 0]} receiveShadow>
        <boxGeometry args={[12.5, 0.45, 9.2]} />
        <meshStandardMaterial color="#d9dacd" roughness={0.92} />
      </mesh>
      <mesh position={[0, -0.015, 0]} receiveShadow>
        <boxGeometry args={[11.8, 0.07, 8.5]} />
        <meshStandardMaterial color="#abc59e" roughness={1} />
      </mesh>

      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[2.15, 0.08, 8.7]} />
        <meshStandardMaterial color="#e5dfd1" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.08, 3.55]} receiveShadow>
        <boxGeometry args={[11.8, 0.12, 0.9]} />
        <meshStandardMaterial color="#6c7774" roughness={0.92} />
      </mesh>
      {[-5.2, -3.2, -1.2, 0.8, 2.8, 4.8].map((x) => (
        <mesh key={x} position={[x, 0.15, 3.54]}>
          <boxGeometry args={[0.9, 0.015, 0.06]} />
          <meshStandardMaterial color="#b7c2bd" />
        </mesh>
      ))}

      <Building position={[-3.3, 1.15, -0.8]} size={[3.8, 2.3, 2.5]} columns={5} levels={2} />
      <Building position={[0, 1.65, -0.9]} size={[2.35, 3.3, 2.8]} columns={3} levels={4} accent />
      <Building position={[3.1, 1.45, -0.65]} size={[3.55, 2.9, 2.55]} columns={4} levels={3} />
      <Building position={[-2.65, 0.78, 2]} size={[3.2, 1.55, 1.65]} columns={4} levels={1} />
      <SolarRoof />

      <mesh position={[0, 3.66, -0.9]} castShadow>
        <octahedronGeometry args={[0.46, 0]} />
        <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={0.28} roughness={0.32} />
      </mesh>
      <mesh position={[0, 4.16, -0.9]}>
        <cylinderGeometry args={[0.025, 0.025, 0.65, 8]} />
        <meshStandardMaterial color={INK} />
      </mesh>

      <Tree position={[-5, 0, -2.7]} scale={1.05} />
      <Tree position={[-4.8, 0, 1.7]} scale={0.85} />
      <Tree position={[5, 0, -2.4]} scale={1.1} />
      <Tree position={[4.9, 0, 2]} scale={0.9} />
      <Tree position={[-1.55, 0, -3.3]} scale={0.72} />
      <Tree position={[1.55, 0, -3.25]} scale={0.78} />

      <CampusBeacon position={[-5.35, 0, 3.05]} />
      <CampusBeacon position={[5.2, 0, -3.25]} />
      <MovingLife animate={animate} />
    </group>
  );
}

export default function CampusModel() {
  const reducedMotion = useReducedMotion();
  const [running, setRunning] = useState(true);
  const animate = running && !reducedMotion;

  return (
    <div className="campus-model-shell">
      <div className="model-toolbar">
        <span><i /> HORIZON SMART CAMPUS</span>
        <div>
          <span className="model-status"><Sparkles size={12} /> LIVE SCHOOL DAY</span>
          <button type="button" onClick={() => setRunning((value) => !value)} aria-label={running ? "Pause 3D school campus animation" : "Play 3D school campus animation"}>
            {running ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>
      <div className="campus-canvas" role="img" aria-label="Interactive three-dimensional model of Horizon International School campus">
        <Canvas
          dpr={[1, 1.65]}
          camera={{ position: [10.5, 7.8, 11.5], fov: 38, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          shadows
        >
          <color attach="background" args={["#ecf0e8"]} />
          <fog attach="fog" args={["#ecf0e8", 18, 29]} />
          <ambientLight intensity={1.35} />
          <hemisphereLight args={["#ccecff", "#5d6759", 1.25]} />
          <directionalLight
            position={[7, 11, 8]}
            intensity={2.5}
            color="#fff7dc"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-7, 4, 3]} intensity={8} color={LIME} distance={11} decay={2} />
          <CampusWorld animate={animate} />
          <ContactShadows position={[0, -0.59, 0]} opacity={0.4} scale={18} blur={2.6} far={6} />
          <OrbitControls
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.055}
            enableZoom
            minDistance={11}
            maxDistance={22}
            minPolarAngle={Math.PI / 4.5}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate={animate}
            autoRotateSpeed={0.38}
            target={[0, 1, 0]}
          />
        </Canvas>
        <div className="model-label model-label-library"><span /> DISCOVERY LIBRARY</div>
        <div className="model-label model-label-labs"><span /> STEAM & MAKER STUDIO</div>
        <div className="model-coordinate">28.4595° N<br />77.0266° E</div>
      </div>
      <div className="model-footer">
        <span><MousePointer2 size={15} /> Drag to rotate</span>
        <span><Rotate3D size={15} /> Scroll to zoom</span>
        <strong>CAMPUS VIEW 01 / 03</strong>
      </div>
    </div>
  );
}