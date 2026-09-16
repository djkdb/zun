"use client";

import * as THREE from "three";

/** Input + car state shared between the controller, camera, world and overlay (ref-based, no re-renders). */
export type Inputs = { forward: boolean; back: boolean; left: boolean; right: boolean; boost: boolean };

export const inputs: Inputs = { forward: false, back: false, left: false, right: false, boost: false };

/** Arena bounds and spawn, set once by the active scene. */
export const world = {
  radius: 92,
  spawn: { x: 0, z: 8, heading: Math.PI },
};

export const car = {
  position: new THREE.Vector3(0, 0, 8),
  heading: Math.PI,
  speed: 0,
  steer: 0,
  /** set by the controller each frame */
  velocity: new THREE.Vector3(),
  /** bumped by resetCar() so world props can re-initialise */
  resetToken: 0,
  /** temporary speed multiplier — driving over a bug halves it */
  drag: 1,
};

export function configureWorld(radius: number, spawn: { x: number; z: number; heading: number }) {
  world.radius = radius;
  world.spawn = spawn;
}

export function resetCar() {
  car.position.set(world.spawn.x, 0, world.spawn.z);
  car.heading = world.spawn.heading;
  car.speed = 0;
  car.steer = 0;
  car.drag = 1;
  car.velocity.set(0, 0, 0);
  car.resetToken++;
}

const KEYMAP: Record<string, keyof Inputs> = {
  ArrowUp: "forward",
  KeyW: "forward",
  ArrowDown: "back",
  KeyS: "back",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ShiftLeft: "boost",
  ShiftRight: "boost",
};

/** Attach keyboard listeners once; returns a cleanup. */
export function bindKeyboard() {
  const down = (e: KeyboardEvent) => {
    const k = KEYMAP[e.code];
    if (!k) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    inputs[k] = true;
    e.preventDefault();
  };
  const up = (e: KeyboardEvent) => {
    const k = KEYMAP[e.code];
    if (!k) return;
    inputs[k] = false;
  };
  const blur = () => {
    inputs.forward = inputs.back = inputs.left = inputs.right = inputs.boost = false;
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", blur);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", blur);
  };
}
