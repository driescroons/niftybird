import { useBox } from "@react-three/cannon";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Quaternion, TextureLoader, Vector3 } from "three";
import { useStore } from "./store";

export default function Bird() {
  const { viewport } = useThree();
  const img = useStore((store) => store.img);
  const texture = useLoader(TextureLoader, img);

  const touchStarted = useRef(0);
  const [ref, api] = useBox(() => ({
    args: [1, 1, 1],
    mass: 1,
    onCollide: (e) => {
      // TODO: enable collisions
    },
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, []);

  useFrame(() => {
    if (
      ref.current.getWorldPosition(new Vector3()).y <
        -viewport.height / 2 - 1 ||
      ref.current.getWorldPosition(new Vector3()).y > viewport.height / 2 + 1
    ) {
      // TODO: reset
      api.position.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.quaternion.set(0, 0, 0, 1);
    }

    let angle = velocity.current[1];
    angle = Math.min(angle, 0.2);
    angle = Math.max(angle, -0.2);

    const quaternion = ref.current.getWorldQuaternion(new Quaternion());
    quaternion.slerp(
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), angle),
      angle > 0 ? 0.3 : 0.1
    );
    api.quaternion.set(...quaternion.toArray());
  });

  const startJump = (e) => {
    touchStarted.current = Date.now();
  };

  const endJump = (e) => {
    let power = (Date.now() - touchStarted.current) / 50;
    power = Math.min(power, 1);
    power = Math.max(power, 0.1);
    api.velocity.set(0, power * 4, 0);
  };

  useEffect(() => {
    window.addEventListener("pointerdown", startJump);
    window.addEventListener("pointerup", endJump);
    return () => {
      window.removeEventListener("pointerdown", startJump);
      window.removeEventListener("pointerup", endJump);
    };
  }, []);

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[1, 1]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
}
