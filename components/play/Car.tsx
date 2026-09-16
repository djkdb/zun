"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { car, inputs, world } from "./store";

const MAX_SPEED = 16;
const BOOST_SPEED = 24;
const ACCEL = 22;
const BRAKE = 34;
const FRICTION = 6;
const TURN = 2.4;

/**
 * Arcade movement without a physics engine: acceleration, drag, speed-dependent
 * steering, body roll, a soft arena wall. The visual shell is passed as children.
 */
export function Vehicle({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const max = (inputs.boost ? BOOST_SPEED : MAX_SPEED) * car.drag;

    if (inputs.forward) car.speed += ACCEL * dt;
    else if (inputs.back) car.speed -= (car.speed > 0 ? BRAKE : ACCEL * 0.6) * dt;
    else car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed), FRICTION * dt);
    car.speed = THREE.MathUtils.clamp(car.speed, -max * 0.45, max);

    const targetSteer = (inputs.left ? 1 : 0) - (inputs.right ? 1 : 0);
    car.steer = THREE.MathUtils.lerp(car.steer, targetSteer, 1 - Math.pow(0.001, dt));
    const grip = THREE.MathUtils.clamp(Math.abs(car.speed) / 6, 0, 1);
    car.heading += car.steer * TURN * grip * Math.sign(car.speed || 1) * dt;

    const dir = new THREE.Vector3(Math.sin(car.heading), 0, Math.cos(car.heading));
    car.velocity.copy(dir).multiplyScalar(car.speed);
    car.position.addScaledVector(car.velocity, dt);

    const r = Math.hypot(car.position.x, car.position.z);
    if (r > world.radius) {
      car.position.multiplyScalar(world.radius / r);
      car.speed *= -0.35;
    }

    if (group.current) {
      group.current.position.copy(car.position);
      group.current.rotation.y = car.heading;
    }
    if (body.current) {
      body.current.rotation.z = THREE.MathUtils.lerp(body.current.rotation.z, -car.steer * grip * 0.12, 0.15);
      const pitchTarget = inputs.forward ? -0.04 : inputs.back ? 0.05 : 0;
      body.current.rotation.x = THREE.MathUtils.lerp(body.current.rotation.x, pitchTarget, 0.1);
    }
  });

  return (
    <group ref={group}>
      <group ref={body}>{children}</group>
    </group>
  );
}

function Wheels() {
  const wheels = useRef<THREE.Mesh[]>([]);
  const fronts = useRef<THREE.Group[]>([]);
  const spin = useRef(0);
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    spin.current += (car.speed * dt) / 0.42;
    wheels.current.forEach((w) => w && (w.rotation.x = spin.current));
    fronts.current.forEach((g) => g && (g.rotation.y = car.steer * 0.45));
  });
  const make = (i: number, x: number, z: number, front: boolean) => {
    const mesh = (
      <mesh
        ref={(el) => {
          if (el) wheels.current[i] = el;
        }}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.42, 0.42, 0.34, 12]} />
        <meshStandardMaterial color="#141a2e" roughness={0.9} />
      </mesh>
    );
    return front ? (
      <group
        key={i}
        position={[x, 0.42, z]}
        ref={(el) => {
          if (el) fronts.current[i] = el;
        }}
      >
        {mesh}
      </group>
    ) : (
      <group key={i} position={[x, 0.42, z]}>
        {mesh}
      </group>
    );
  };
  return (
    <group>
      {make(0, -0.95, 1.15, true)}
      {make(1, 0.95, 1.15, true)}
      {make(2, -0.95, -1.2, false)}
      {make(3, 0.95, -1.2, false)}
    </group>
  );
}

export interface VehiclePaint {
  body: string;
  cabin: string;
  glass: string;
}

/** Low-poly hatchback with a ZUN cap on the roof, plus headlights that light the floor. */
export function CarShell({ palette }: { palette: VehiclePaint }) {
  return (
    <group>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.62, 3.6]} />
        <meshStandardMaterial color={palette.body} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.22, -0.15]} castShadow>
        <boxGeometry args={[1.5, 0.62, 1.9]} />
        <meshStandardMaterial color={palette.cabin} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.24, -0.15]}>
        <boxGeometry args={[1.54, 0.42, 1.94]} />
        <meshStandardMaterial color={palette.glass} roughness={0.2} metalness={0.2} />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <mesh key={`h${x}`} position={[x, 0.78, 1.81]}>
          <boxGeometry args={[0.36, 0.2, 0.06]} />
          <meshStandardMaterial color="#fff7d6" emissive="#fff1b0" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {[-0.6, 0.6].map((x) => (
        <mesh key={`t${x}`} position={[x, 0.78, -1.81]}>
          <boxGeometry args={[0.36, 0.18, 0.06]} />
          <meshStandardMaterial color="#ff5a5a" emissive="#ff2d2d" emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.62, -0.2]} castShadow>
        <boxGeometry args={[0.6, 0.16, 0.6]} />
        <meshStandardMaterial color="#1b2b5c" />
      </mesh>
      <mesh position={[0, 1.6, 0.25]}>
        <boxGeometry args={[0.62, 0.05, 0.3]} />
        <meshStandardMaterial color="#12204a" />
      </mesh>
      {/* a pool of light in front, so the dark editor floor reads as lit by the car */}
      <pointLight position={[0, 1.1, 3.2]} color="#cfe0ff" intensity={14} distance={16} decay={2} />
      <Wheels />
    </group>
  );
}
