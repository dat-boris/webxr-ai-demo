import { useState } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { createXRStore, XR } from '@react-three/xr'

const xrStore = createXRStore();

function App() {
  return (
    <>
      <Canvas>
        <XR store={xrStore}>
        <directionalLight color="white" position={[0, 0, 5]} />
        <mesh position={[0, 0, -10]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        </XR>
      </Canvas>
      <h1>A simple WebXR demo.</h1>
      <button onClick={() => xrStore.enterVR()}>Enter VR</button>
    </>
  )
}

export default App
