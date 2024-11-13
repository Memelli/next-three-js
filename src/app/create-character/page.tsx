'use client'
import { Canvas } from '@react-three/fiber'

import UI from './components/UI'
import Experience from './components/Experience'

export default function CreateCharacterPage() {
  return (
    <>
      <UI />
      <Canvas
        camera={{
          position: [-1, 1, 5],
          fov: 45,
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
        shadows
      >
        <color attach="background" args={['#555']} />
        <fog attach="fog" args={['#555', 15, 25]} />
        <group position-y={-1}>
          <Experience />
        </group>
      </Canvas>
    </>
  )
}
