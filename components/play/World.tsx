"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { pathTiles, treePositions, WORLD_RADIUS_HINT } from "./worldData";

const FONT = "/fonts/Silkscreen-Regular.ttf";

function Tree({ x, z, s, seed }: { x: number; z: number; s: number; seed: number }) {
  const r = (n: number) => ((seed * 7 + n * 131) % 100) / 100;
  return (
    <group position={[x, 0, z]} scale={s} rotation={[0, r(1) * Math.PI, 0]}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 2.8, 6]} />
        <meshStandardMaterial color="#6b4a2b" roughness={1} />
      </mesh>
      <mesh position={[0, 3.2, 0]} rotation={[0, r(2) * 0.6, 0]} castShadow>
        <boxGeometry args={[2.2, 1.9, 2.2]} />
        <meshStandardMaterial color="#7cc46b" roughness={0.9} />
      </mesh>
      <mesh position={[-0.9, 2.5, 0.6]} rotation={[0, r(3) * 0.8, 0]} castShadow>
        <boxGeometry args={[1.5, 1.4, 1.5]} />
        <meshStandardMaterial color="#8fd27c" roughness={0.9} />
      </mesh>
      <mesh position={[0.8, 2.7, -0.5]} rotation={[0, r(4) * 0.8, 0]} castShadow>
        <boxGeometry args={[1.3, 1.2, 1.3]} />
        <meshStandardMaterial color="#6fb85f" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Billboard() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0b1226";
    ctx.fillRect(0, 0, c.width, c.height);
    // grid
    ctx.strokeStyle = "rgba(148,163,205,0.14)";
    ctx.lineWidth = 2;
    for (let x = 0; x <= c.width; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
    for (let y = 0; y <= c.height; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }
    // diagonal accent stripes
    ctx.fillStyle = "rgba(59,130,246,0.35)";
    for (const off of [520, 620]) {
      ctx.beginPath(); ctx.moveTo(off, 0); ctx.lineTo(off + 70, 0); ctx.lineTo(off + 470, c.height); ctx.lineTo(off + 400, c.height); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "#60a5fa";
    ctx.font = "28px monospace";
    ctx.fillText("$ whoami", 72, 110);
    ctx.fillStyle = "#f2f4fa";
    ctx.font = "bold 132px sans-serif";
    ctx.fillText("ZUN", 66, 250);
    ctx.font = "bold 54px sans-serif";
    ctx.fillText("I BUILD THINGS.", 72, 340);
    ctx.fillStyle = "#60a5fa";
    ctx.font = "30px monospace";
    ctx.fillText("Software × AI × Product", 74, 410);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);
  return (
    <group position={[0, 0, -34]}>
      {/* posts */}
      {[-9, 9].map((x) => (
        <mesh key={x} position={[x, 3, 0]} castShadow>
          <boxGeometry args={[0.6, 6, 0.6]} />
          <meshStandardMaterial color="#3a3f52" />
        </mesh>
      ))}
      <mesh position={[0, 9.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 11, 0.6]} />
        <meshStandardMaterial color="#0b1226" />
      </mesh>
      <mesh position={[0, 9.5, 0.32]}>
        <planeGeometry args={[21.4, 10.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function World() {
  const tiles = useMemo(() => pathTiles(), []);
  const trees = useMemo(() => treePositions(), []);
  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[WORLD_RADIUS_HINT + 40, 64]} />
        <meshStandardMaterial color="#f2dd8a" roughness={1} />
      </mesh>
      {/* arena edge ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[WORLD_RADIUS_HINT - 0.3, WORLD_RADIUS_HINT + 0.3, 96]} />
        <meshBasicMaterial color="#e6c96a" />
      </mesh>
      {/* road stub (the way ZUN came in) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-52, 0.02, -12]} receiveShadow>
        <planeGeometry args={[30, 7]} />
        <meshStandardMaterial color="#3a4066" />
      </mesh>
      {[-62, -54, -46].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, -12]}>
          <planeGeometry args={[4, 0.5]} />
          <meshBasicMaterial color="#e9edf7" />
        </mesh>
      ))}
      {/* path tiles */}
      {tiles.map((t, i) => (
        <mesh key={i} position={[t.x, 0.08, t.z]} rotation={[0, t.rot, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.16, 2.2]} />
          <meshStandardMaterial color="#e9edf7" roughness={0.8} />
        </mesh>
      ))}
      {trees.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
      <Billboard />
      {/* How to play — sunk into the sand like the reference */}
      <group position={[0, 0.02, 16]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text font={FONT} fontSize={1.9} color="#e9edf7" anchorX="center" anchorY="middle" letterSpacing={0.05}>
          HOW TO PLAY
        </Text>
        <Text font={FONT} fontSize={1} color="#f2f4fa" anchorX="center" anchorY="middle" position={[0, -2.6, 0]}>
          ARROW KEYS / WASD  -  SHIFT = BOOST
        </Text>
        <Text font={FONT} fontSize={0.9} color="#c9b46a" anchorX="center" anchorY="middle" position={[0, -4.2, 0]}>
          DRIVE INTO A ZONE TO OPEN IT
        </Text>
      </group>
    </group>
  );
}
