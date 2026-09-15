"use client";

import * as THREE from "three";
import { Billboard, useTexture } from "@react-three/drei";
import type { PoseName } from "@/data/types";
import { SHEET_CELLS } from "@/data/character";
import { characterManifest } from "@/data/character-manifest";

/** ZUN pixel sprite standing in the 3D world (always faces the camera). */
export function ZunSprite({ pose, position, height = 3.4 }: { pose: PoseName; position: [number, number, number]; height?: number }) {
  const cell = SHEET_CELLS[pose].cell;
  const tex = useTexture(`/character/poses/${cell}.png`, (t) => {
    // crisp pixels — never bilinear-filter pixel art
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
  });
  const dims = characterManifest.cells[cell] ?? { w: 1, h: 1 };
  const w = (height * dims.w) / dims.h;
  return (
    <group position={position}>
      <Billboard position={[0, height / 2, 0]} lockX lockZ>
        <mesh>
          <planeGeometry args={[w, height]} />
          <meshBasicMaterial map={tex} transparent alphaTest={0.4} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </Billboard>
      {/* soft round shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[w * 0.4, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}
