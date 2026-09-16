"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { BUGS, CHAR_W, colX, lineZ, PX, TOKENS } from "./code";
import { car } from "./store";

const FONT = "/fonts/Silkscreen-Regular.ttf";

/**
 * Collectible syntax tokens and red-squiggle bug patches.
 * Driving over a token banks it; driving over a bug halves your speed for a moment.
 */
export function Tokens({
  onCollect,
  onBug,
}: {
  onCollect: (index: number, x: number, z: number) => void;
  onBug: () => void;
}) {
  const groups = useRef<THREE.Group[]>([]);
  const taken = useRef<boolean[]>(TOKENS.map(() => false));
  const lastReset = useRef(car.resetToken);
  const bugCooldown = useRef(0);

  const spots = useMemo(
    () => TOKENS.map((t) => ({ x: colX(t.col), z: lineZ(t.line), glyph: t.glyph })),
    [],
  );
  const bugRects = useMemo(
    () =>
      BUGS.map((b) => ({
        x: colX((b.from + b.to) / 2),
        z: lineZ(b.line),
        halfW: ((b.to - b.from) / 2) * CHAR_W * PX,
        halfZ: 1.6,
      })),
    [],
  );

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);

    if (car.resetToken !== lastReset.current) {
      lastReset.current = car.resetToken;
      taken.current = TOKENS.map(() => false);
      groups.current.forEach((g) => g && g.scale.setScalar(1));
    }

    // tokens
    spots.forEach((s, i) => {
      const g = groups.current[i];
      if (!g) return;
      if (taken.current[i]) {
        g.scale.multiplyScalar(0.82);
        return;
      }
      g.rotation.y = clock.elapsedTime * 1.6 + i;
      g.position.y = 1.1 + Math.sin(clock.elapsedTime * 2.4 + i) * 0.22;
      if (Math.hypot(car.position.x - s.x, car.position.z - s.z) < 1.7) {
        taken.current[i] = true;
        onCollect(i, s.x, s.z);
      }
    });

    // bugs
    bugCooldown.current = Math.max(0, bugCooldown.current - dt);
    let onBugNow = false;
    for (const b of bugRects) {
      if (Math.abs(car.position.x - b.x) < b.halfW && Math.abs(car.position.z - b.z) < b.halfZ) {
        onBugNow = true;
        break;
      }
    }
    if (onBugNow) {
      car.drag = 0.45;
      if (bugCooldown.current === 0) {
        bugCooldown.current = 1.6;
        onBug();
      }
    } else {
      car.drag = THREE.MathUtils.lerp(car.drag, 1, 1 - Math.pow(0.01, dt));
    }
  });

  return (
    <group>
      {spots.map((s, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) groups.current[i] = el;
          }}
          position={[s.x, 0.9, s.z]}
        >
          <mesh castShadow>
            <boxGeometry args={[1.05, 1.05, 1.05]} />
            <meshStandardMaterial
              color="#101a36"
              emissive="#3b82f6"
              emissiveIntensity={0.35}
              roughness={0.4}
              transparent
              opacity={0.92}
            />
          </mesh>
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((ry) => (
            <Text
              key={ry}
              font={FONT}
              fontSize={0.58}
              color="#93c5fd"
              anchorX="center"
              anchorY="middle"
              position={[Math.sin(ry) * 0.55, 0, Math.cos(ry) * 0.55]}
              rotation={[0, ry, 0]}
            >
              {s.glyph}
            </Text>
          ))}
        </group>
      ))}
      {bugRects.map((b, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[b.x, 0.03, b.z]}>
          <planeGeometry args={[b.halfW * 2, b.halfZ * 2]} />
          <meshBasicMaterial color="#ff5a5a" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}
