"use client";

import { useImperativeHandle, useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const N = 60;
const COLORS = ["#3b82f6", "#60a5fa", "#fbbf24", "#f472b6", "#34d399", "#f2f4fa"];

export interface ConfettiHandle {
  burst: (x: number, z: number) => void;
}

/** One instanced burst of tiny cubes; `burst()` relaunches it at a world position. */
export const Confetti = forwardRef<ConfettiHandle>(function Confetti(_, ref) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const parts = useRef(
    Array.from({ length: N }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, rot: Math.random() * Math.PI })),
  );
  const dummy = useRef(new THREE.Object3D());

  useImperativeHandle(ref, () => ({
    burst(x, z) {
      parts.current.forEach((pt) => {
        pt.p.set(x, 1, z);
        const a = Math.random() * Math.PI * 2;
        const s = 4 + Math.random() * 6;
        pt.v.set(Math.cos(a) * s * 0.5, 6 + Math.random() * 6, Math.sin(a) * s * 0.5);
        pt.life = 1.4 + Math.random() * 0.6;
      });
    },
  }));

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const m = mesh.current;
    if (!m) return;
    parts.current.forEach((pt, i) => {
      if (pt.life > 0) {
        pt.life -= dt;
        pt.v.y -= 18 * dt;
        pt.p.addScaledVector(pt.v, dt);
        if (pt.p.y < 0.1) { pt.p.y = 0.1; pt.v.multiplyScalar(0.3); }
        pt.rot += dt * 8;
        dummy.current.position.copy(pt.p);
        dummy.current.rotation.set(pt.rot, pt.rot * 0.7, 0);
        dummy.current.scale.setScalar(Math.min(1, pt.life * 2));
      } else {
        dummy.current.scale.setScalar(0);
      }
      dummy.current.updateMatrix();
      m.setMatrixAt(i, dummy.current.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[0.28, 0.28, 0.28]} />
      <meshStandardMaterial vertexColors={false} color="#fff" />
      {/* per-instance colours */}
      <instancedBufferAttribute attach="instanceColor" args={[new Float32Array(Array.from({ length: N }, (_, i) => { const c = new THREE.Color(COLORS[i % COLORS.length]); return [c.r, c.g, c.b]; }).flat()), 3]} />
    </instancedMesh>
  );
});
