"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CarShell, Vehicle } from "./Car";
import { World } from "./World";
import { Zones } from "./Zones";
import { Tokens } from "./Tokens";
import { Confetti, type ConfettiHandle } from "./Confetti";
import { FollowCamera } from "./FollowCamera";
import { bindKeyboard, car, configureWorld, resetCar } from "./store";
import { BUGS, TOKENS, colX, lineZ } from "./code";
import { ZONES } from "./zones";
import { Overlay } from "./Overlay";

export interface GameState {
  collected: number;
  total: number;
  bugs: number;
  passed: boolean;
}

// start above the first zone, pointed down the file (+z)
const SPAWN = { x: -28, z: lineZ(4), heading: 0 };

/** TERMINAL CITY — drive the editor floor. Canvas + HTML overlay. */
export function Playground({ embedded, onExit }: { embedded?: boolean; onExit?: () => void } = {}) {
  const [zone, setZone] = useState<string | null>(null);
  const [game, setGame] = useState<GameState>({ collected: 0, total: TOKENS.length, bugs: 0, passed: false });
  const [flash, setFlash] = useState<string | null>(null);
  const confetti = useRef<ConfettiHandle>(null);

  useEffect(() => {
    configureWorld(46, SPAWN);
    resetCar();
    const off = bindKeyboard();
    // handy while tuning: __zunPlay.car.position.set(x, 0, z)
    (window as unknown as { __zunPlay?: unknown }).__zunPlay = { car, resetCar, zones: ZONES, tokens: TOKENS, bugs: BUGS, lineZ, colX };
    return off;
  }, []);

  const onEnter = useCallback((id: string | null) => {
    setZone(id);
    if (id) {
      const z = ZONES.find((zn) => zn.id === id);
      if (z) confetti.current?.burst(z.x, z.z);
    }
  }, []);

  const onCollect = useCallback((_i: number, x: number, z: number) => {
    confetti.current?.burst(x, z, 18);
    setGame((g) => {
      const collected = g.collected + 1;
      const passed = collected >= g.total;
      if (passed) setFlash("ALL TESTS PASSED");
      return { ...g, collected, passed };
    });
  }, []);

  const onBug = useCallback(() => {
    setGame((g) => ({ ...g, bugs: g.bugs + 1 }));
    setFlash("TypeError: cannot read property of undefined");
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  const onReset = useCallback(() => {
    resetCar();
    setGame({ collected: 0, total: TOKENS.length, bugs: 0, passed: false });
    setFlash(null);
  }, []);

  /**
   * `fixed` covers the viewport — correct on /play, wrong inside a window:
   * it escapes the window body and paints over the title bar, so the close
   * button disappears and the playground cannot be shut.
   */
  return (
    <div className={`${embedded ? "absolute" : "fixed"} inset-0 bg-[#070b18]`}>
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 60, 36], fov: 36, near: 0.5, far: 460 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#070b18"]} />
        <fog attach="fog" args={["#070b18", 110, 270]} />
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#2a3a6b", "#070b18", 0.5]} />
        <directionalLight
          position={[-24, 46, 22]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1536, 1536]}
          shadow-camera-left={-56}
          shadow-camera-right={56}
          shadow-camera-top={56}
          shadow-camera-bottom={-56}
          shadow-camera-near={1}
          shadow-camera-far={160}
          shadow-bias={-0.0004}
        />
        <Suspense fallback={null}>
          <World />
          <Zones onEnter={onEnter} />
          <Tokens onCollect={onCollect} onBug={onBug} />
          <Confetti ref={confetti} />
          <Vehicle>
            <CarShell palette={{ body: "#2f8f5b", cabin: "#2f8f5b", glass: "#1b2b5c" }} />
          </Vehicle>
        </Suspense>
        <FollowCamera />
      </Canvas>
      <Overlay embedded={embedded} onExit={onExit} zone={zone} game={game} flash={flash} onReset={onReset} />
    </div>
  );
}
