import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Bird from "./Bird";
import Wall from "./Wall";
import { OrbitControls } from "@react-three/drei";
import { Debug, Physics } from "@react-three/cannon";
import { spaceBetweenWalls, worldOffset } from "./constants";
import { useStore } from "./store";

function Game() {
  const colors = useStore((store) => store.colors);
  const img = useStore((store) => store.img);
  const isPlaying = useStore((store) => store.isPlaying);

  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <color attach="background" args={[colors[0]]} />
      {isPlaying && (
        <Physics>
          {img && (
            <Suspense>
              <Bird />
            </Suspense>
          )}
          {[...Array(50)].map((_, i) => (
            <Wall position={[worldOffset + i * spaceBetweenWalls + 1, 0, 0]} />
          ))}
        </Physics>
      )}
      {/* <OrbitControls  /> */}
    </Canvas>
  );
}

export default Game;
