"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Car } from "./Car";
import { World } from "./World";
import { Zones } from "./Zones";
import { Blocks } from "./Blocks";
import { Confetti, type ConfettiHandle } from "./Confetti";
import { FollowCamera } from "./FollowCamera";
import { bindKeyboard, car, resetCar } from "./store";
import { ZONES } from "./zones";
import { Overlay } from "./Overlay";

/** The whole 3D playground: canvas + HTML overlay. Rendered client-only. */
export function Playground() {
  const [zone, setZone] = useState<string | null>(null);
  const confetti = useRef<ConfettiHandle>(null);

  useEffect(() => {
    const off = bindKeyboard();
    // console playground: window.__zunPlay.car.position.set(x, 0, z)
    (window as unknown as { __zunPlay?: unknown }).__zunPlay = { car, resetCar };
    return off;
  }, []);

  const onEnter = useCallback((id: string | null) => {
    setZone(id);
    if (id) {
      const z = ZONES.find((zn) => zn.id === id);
      if (z) confetti.current?.burst(z.x, z.z);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-[#f2dd8a]">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 26, 35], fov: 38, near: 0.5, far: 260 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#f6e6a3"]} />
        <fog attach="fog" args={["#f6e6a3", 70, 150]} />
        <hemisphereLight args={["#ffffff", "#c9b46a", 0.9]} />
        <directionalLight
          position={[-30, 46, 20]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1536, 1536]}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
          shadow-camera-near={1}
          shadow-camera-far={160}
          shadow-bias={-0.0004}
        />
        <Suspense fallback={null}>
          <World />
          <Zones onEnter={onEnter} />
          <Blocks />
          <Confetti ref={confetti} />
          <Car />
        </Suspense>
        <FollowCamera />
      </Canvas>
      <Overlay zone={zone} onReset={resetCar} />
    </div>
  );
}
