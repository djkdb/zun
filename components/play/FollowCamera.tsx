"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { car } from "./store";

const OFFSET = new THREE.Vector3(0, 60, 36);

/** Fixed-orientation chase camera (like the reference): eases toward the car, looks slightly ahead. */
export function FollowCamera() {
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  useFrame(({ camera, size }, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    // portrait phones see a narrow slice — back off further so the world stays readable
    const zoom = size.width < size.height ? 1.8 : size.width < 900 ? 1.25 : 1;
    const ahead = new THREE.Vector3(Math.sin(car.heading), 0, Math.cos(car.heading)).multiplyScalar(Math.min(8, Math.abs(car.speed) * 0.45));
    target.current.copy(car.position).add(ahead).addScaledVector(OFFSET, zoom);
    camera.position.lerp(target.current, 1 - Math.pow(0.02, dt));
    look.current.lerp(car.position.clone().add(ahead), 1 - Math.pow(0.02, dt));
    camera.lookAt(look.current);
  });
  return null;
}
