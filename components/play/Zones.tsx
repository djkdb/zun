"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { ZONES } from "./zones";
import { car } from "./store";
import { ZunSprite } from "./Sprite";

const FONT = "/fonts/Silkscreen-Regular.ttf";

/**
 * Floor plates + labels + a waiting ZUN per zone. Reports which zone the car is in
 * (null when none) — the overlay turns that into an info card.
 */
export function Zones({ onEnter }: { onEnter: (id: string | null) => void }) {
  const current = useRef<string | null>(null);
  const rings = useRef<Record<string, THREE.Mesh>>({});

  useFrame(({ clock }) => {
    let hit: string | null = null;
    for (const z of ZONES) {
      const d = Math.hypot(car.position.x - z.x, car.position.z - z.z);
      if (d < z.radius) hit = z.id;
      const ring = rings.current[z.id];
      if (ring) {
        const pulse = 1 + Math.sin(clock.elapsedTime * 2 + z.x) * 0.03;
        ring.scale.setScalar(hit === z.id ? 1.12 : pulse);
        (ring.material as THREE.MeshBasicMaterial).opacity = hit === z.id ? 0.95 : 0.55;
      }
    }
    if (hit !== current.current) {
      current.current = hit;
      onEnter(hit);
    }
  });

  return (
    <group>
      {ZONES.map((z) => (
        <group key={z.id} position={[z.x, 0, z.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
            <circleGeometry args={[z.radius, 40]} />
            <meshStandardMaterial color="#e9edf7" roughness={0.9} />
          </mesh>
          <mesh
            ref={(el) => {
              if (el) rings.current[z.id] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.05, 0]}
          >
            <ringGeometry args={[z.radius - 0.35, z.radius, 48]} />
            <meshBasicMaterial color={z.color} transparent opacity={0.55} />
          </mesh>
          <Text
            font={FONT}
            fontSize={1.6}
            color="#0b1226"
            anchorX="center"
            anchorY="middle"
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.07, 0.4]}
            letterSpacing={0.06}
          >
            {z.label}
          </Text>
          <ZunSprite pose={z.pose} position={[z.radius + 1.6, 0, -1.5]} />
        </group>
      ))}
    </group>
  );
}
