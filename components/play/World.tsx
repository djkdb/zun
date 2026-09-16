"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { drawEditor, lineZ, TEX, WORLD } from "./code";
import { ZONES } from "./zones";
import { seeded } from "@/lib/utils";

const FONT = "/fonts/Silkscreen-Regular.ttf";

/** The editor floor: one canvas texture, lit just enough to take the car's shadow. */
function CodeFloor() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = TEX;
    c.height = TEX;
    drawEditor(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 16;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    return t;
  }, []);

  return (
    <group>
      {/* the void the editor floats in */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <circleGeometry args={[150, 48]} />
        <meshBasicMaterial color="#05080f" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[WORLD, WORLD]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={0.62}
        color="#ffffff"
        roughness={1}
      />
      </mesh>
    </group>
  );
}

/** Zone lanes: a glowing strip over the highlighted line plus a floating label. */
function ZoneLanes() {
  const strips = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    strips.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.8 + i) * 0.07;
    });
  });
  return (
    <group>
      {ZONES.map((z, i) => (
        <group key={z.id} position={[z.x, 0, z.z]}>
          <mesh
            ref={(el) => {
              if (el) strips.current[i] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.02, 0]}
          >
            <planeGeometry args={[z.halfW * 2, z.halfZ * 2]} />
            <meshBasicMaterial color={z.color} transparent opacity={0.2} />
          </mesh>
          {/* run marker at the left edge of the line */}
          <mesh position={[-z.halfW - 1.3, 0.5, 0]}>
            <boxGeometry args={[0.45, 1.0, 1.6]} />
            <meshStandardMaterial color={z.color} emissive={z.color} emissiveIntensity={0.8} />
          </mesh>
          <Text
            font={FONT}
            fontSize={1.15}
            color={z.color}
            anchorX="right"
            anchorY="middle"
            position={[-z.halfW - 2.4, 2.2, 0]}
            rotation={[-0.5, 0, 0]}
            outlineWidth={0.05}
            outlineColor="#070b18"
          >
            {`> RUN ${z.label}`}
          </Text>
        </group>
      ))}
    </group>
  );
}

/** Terminal City skyline: stacked code towers with lit windows, outside the arena. */
function Towers() {
  const towers = useMemo(() => {
    const out: { x: number; z: number; w: number; h: number; d: number; win: number }[] = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2 + seeded(i) * 0.12;
      const r = 82 + seeded(i * 3) * 46;
      out.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        w: 7 + seeded(i * 5) * 9,
        h: 8 + seeded(i * 7) * 26,
        d: 7 + seeded(i * 11) * 9,
        win: Math.floor(seeded(i * 13) * 3),
      });
    }
    return out;
  }, []);

  return (
    <group>
      {towers.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.h / 2, 0]}>
            <boxGeometry args={[t.w, t.h, t.d]} />
            <meshStandardMaterial color="#0e1630" roughness={0.9} />
          </mesh>
          {/* lit windows — a couple of emissive bands per tower */}
          {Array.from({ length: Math.max(1, Math.floor(t.h / 8)) }).map((_, k) => (
            <mesh key={k} position={[0, 4 + k * 8, t.d / 2 + 0.05]}>
              <planeGeometry args={[t.w * 0.6, 1.3]} />
              <meshBasicMaterial
                color={["#3b82f6", "#34d399", "#c084fc"][(t.win + k) % 3]}
                transparent
                opacity={0.3 + ((i + k) % 3) * 0.2}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** A huge terminal window at the far end of the file. */
function TerminalBillboard() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 576;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#070b18";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#101a36";
    ctx.fillRect(0, 0, c.width, 64);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(28, 26, 14, 14);
    ctx.fillStyle = "#5a6588";
    ctx.fillRect(56, 26, 14, 14);
    ctx.fillRect(84, 26, 14, 14);
    ctx.font = "500 26px ui-monospace, monospace";
    ctx.fillStyle = "#9aa5c4";
    ctx.fillText("zun@terminal-city — zsh", 124, 44);

    const lines: [string, string][] = [
      ["$ ", "#60a5fa"],
      ["whoami", "#f2f4fa"],
      ["", ""],
      ["ZUN", "#f2f4fa"],
      ["Software Student · AI Builder · Creator", "#9aa5c4"],
      ["", ""],
      ["$ ", "#60a5fa"],
      ["cat mission.txt", "#f2f4fa"],
      ["I BUILD THINGS.", "#34d399"],
      ["Software × AI × Product", "#c084fc"],
    ];
    ctx.font = "500 34px ui-monospace, monospace";
    let y = 130;
    let x = 44;
    for (const [text, color] of lines) {
      if (text === "") {
        y += 42;
        x = 44;
        continue;
      }
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      if (color === "#60a5fa") {
        x += ctx.measureText(text).width;
      } else {
        y += 42;
        x = 44;
      }
    }
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(44, y - 24, 18, 32);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <group position={[0, 0, lineZ(0) - 16]}>
      {[-10, 10].map((x) => (
        <mesh key={x} position={[x, 6, 0]} castShadow>
          <boxGeometry args={[0.7, 12, 0.7]} />
          <meshStandardMaterial color="#1b2340" />
        </mesh>
      ))}
      <mesh position={[0, 17, 0]} castShadow>
        <boxGeometry args={[23, 13, 0.7]} />
        <meshStandardMaterial color="#070b18" />
      </mesh>
      <mesh position={[0, 17, 0.38]}>
        <planeGeometry args={[22.2, 12.5]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Floating dust of tiny glyph cubes, so the dark air is not empty. */
function Motes() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const N = 70;
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      const a = seeded(i) * Math.PI * 2;
      const r = 16 + seeded(i * 3) * 48;
      dummy.position.set(
        Math.cos(a + t * 0.02 * (1 + seeded(i * 5))) * r,
        3 + seeded(i * 7) * 16 + Math.sin(t * 0.6 + i) * 1.0,
        Math.sin(a + t * 0.02 * (1 + seeded(i * 5))) * r,
      );
      dummy.rotation.set(t * 0.3 + i, t * 0.2 + i, 0);
      dummy.scale.setScalar(0.18 + seeded(i * 11) * 0.22);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.35} />
    </instancedMesh>
  );
}

export function World() {
  return (
    <group>
      <CodeFloor />
      <ZoneLanes />
      <Towers />
      <TerminalBillboard />
      <Motes />
      {/* how to play, written as a comment at the bottom of the file */}
      <group position={[0, 0.03, lineZ(26) + 7]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text font={FONT} fontSize={1.0} color="#5a6588" anchorX="center" anchorY="middle">
          {"// ARROW KEYS or WASD - SHIFT to boost"}
        </Text>
        <Text font={FONT} fontSize={1.0} color="#5a6588" anchorX="center" anchorY="middle" position={[0, -1.8, 0]}>
          {"// drive onto a highlighted line to run it"}
        </Text>
        <Text font={FONT} fontSize={1.0} color="#5a6588" anchorX="center" anchorY="middle" position={[0, -3.6, 0]}>
          {"// collect { } ( ) tokens - avoid the red squiggles"}
        </Text>
      </group>
    </group>
  );
}
