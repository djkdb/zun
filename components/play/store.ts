"use client";

import * as THREE from "three";

/** Input + car state shared between the controller, camera, world and overlay (ref-based, no re-renders). */
export type Inputs = { forward: boolean; back: boolean; left: boolean; right: boolean; boost: boolean };

export const inputs: Inputs = { forward: false, back: false, left: false, right: false, boost: false };

export const car = {
  position: new THREE.Vector3(0, 0, 8),
  heading: Math.PI, // radians, 0 = +z; the car starts facing the billboard (-z)
  speed: 0,
  steer: 0,
  /** set by the controller each frame */
  velocity: new THREE.Vector3(),
  resetToken: 0,
};

export const WORLD_RADIUS = 58;

export function resetCar() {
  car.position.set(0, 0, 8);
  car.heading = Math.PI;
  car.speed = 0;
  car.steer = 0;
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
