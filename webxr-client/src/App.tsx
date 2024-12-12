import { useState } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <>
      <Canvas>
        <directionalLight color="white" position={[0, 0, 5]} />
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </Canvas>
      <h1>A simple WebXR demo.</h1>
    </>
  )
}

export default App
