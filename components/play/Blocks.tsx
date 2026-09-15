"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { car } from "./store";

const FONT = "/fonts/Silkscreen-Regular.ttf";
const LETTERS = ["Z", "U", "N"];
const START: [number, number][] = [[-3.6, -12], [0, -12], [3.6, -12]];

/** Pushable letter crates — bump them with the car, they slide and spin, and settle. */
export function Blocks() {
  const refs = useRef<THREE.Group[]>([]);
  const state = useRef(
    START.map(([x, z]) => ({ pos: new THREE.Vector3(x, 0, z), vel: new THREE.Vector3(), spin: 0, rot: 0 })),
  );
  const lastReset = useRef(car.resetToken);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    if (car.resetToken !== lastReset.current) {
      lastReset.current = car.resetToken;
      state.current.forEach((b, i) => {
        b.pos.set(START[i][0], 0, START[i][1]);
        b.vel.set(0, 0, 0);
        b.spin = 0;
        b.rot = 0;
      });
    }
    state.current.forEach((b, i) => {
      // car bump
      const dx = b.pos.x - car.position.x, dz = b.pos.z - car.position.z;
      const d = Math.hypot(dx, dz);
      if (d < 2.6 && Math.abs(car.speed) > 1) {
        const n = new THREE.Vector3(dx / d, 0, dz / d);
        const push = Math.max(Math.abs(car.speed) * 0.9, 4);
        b.vel.copy(n).multiplyScalar(push).addScaledVector(car.velocity, 0.3);
        b.spin = (Math.random() - 0.5) * 6;
        b.pos.addScaledVector(n, 2.6 - d);
      }
      // block–block separation
      state.current.forEach((o, j) => {
        if (j === i) return;
        const ox = b.pos.x - o.pos.x, oz = b.pos.z - o.pos.z;
        const od = Math.hypot(ox, oz);
        if (od < 2.4 && od > 0.001) {
          const n = new THREE.Vector3(ox / od, 0, oz / od);
          b.pos.addScaledVector(n, (2.4 - od) / 2);
          b.vel.addScaledVector(n, 0.5);
        }
      });
      b.pos.addScaledVector(b.vel, dt);
      b.vel.multiplyScalar(Math.pow(0.08, dt));
      b.rot += b.spin * dt;
      b.spin *= Math.pow(0.05, dt);
      const g = refs.current[i];
      if (g) {
        g.position.copy(b.pos);
        g.rotation.y = b.rot;
        // little hop while moving
        g.position.y = Math.min(0.5, b.vel.length() * 0.04);
      }
    });
  });

  return (
    <group>
      {LETTERS.map((l, i) => (
        <group
          key={l}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={[START[i][0], 0, START[i][1]]}
        >
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 2.2, 2.2]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.5} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((ry) => (
            <Text key={ry} font={FONT} fontSize={1.4} color="#f2f4fa" anchorX="center" anchorY="middle" position={[Math.sin(ry) * 1.12, 1.1, Math.cos(ry) * 1.12]} rotation={[0, ry, 0]}>
              {l}
            </Text>
          ))}
        </group>
      ))}
    </group>
  );
}
