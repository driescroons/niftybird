import { useBox } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useState } from "react";
import { Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils";
import { useStore } from "./store";

export default function Wall({ position, args = [1, 10, 0] }) {
  const { viewport } = useThree();
  const colors = useStore((store) => store.colors);
  const [color] = useState(
    colors[1 + Math.floor(Math.random() * colors.length - 1)]
  );
  const [offset] = useState(
    randFloatSpread(((Math.random() * viewport.height) / 2) * 0.9)
  );
  const [gapSize] = useState(randFloatSpread(viewport.height / 10));

  const [refTop, apiTop] = useBox(() => ({
    args,
    type: "static",
    mass: 0,
    position: new Vector3(0, viewport.height / 2 - gapSize + offset, 0)
      .add(new Vector3().fromArray(position))
      .toArray(),
  }));

  const [refBottom, apiBottom] = useBox(() => ({
    args,
    type: "static",
    mass: 0,
    position: new Vector3(0, -viewport.height / 2 + gapSize + offset, 0)
      .add(new Vector3().fromArray(position))
      .toArray(),
  }));

  useFrame((state, delta) => {
    const refreshCorrection = delta / (1 / 60);
    const speed = [-0.05 * refreshCorrection, 0, 0];

    apiTop.position.set(
      ...refTop.current
        .getWorldPosition(new Vector3())
        .toArray()
        .map((v, index) => v + speed[index])
    );

    apiBottom.position.set(
      ...refBottom.current
        .getWorldPosition(new Vector3())
        .toArray()
        .map((v, index) => v + speed[index])
    );
  });

  return [
    <mesh ref={refTop}>
      <boxGeometry args={args} />
      <meshBasicMaterial color={color} />
    </mesh>,
    <mesh ref={refBottom}>
      <boxGeometry args={args} />
      <meshBasicMaterial color={color} />
    </mesh>,
  ];
}
