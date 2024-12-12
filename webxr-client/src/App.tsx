import './App.css'
import { Canvas } from '@react-three/fiber'
import { createXRStore, XR } from '@react-three/xr'
import { useWhispherChat } from './whisperhook'

const xrStore = createXRStore();

function App() {
  const { startMediaRecording, stopMediaRecording, recordedText } = useWhispherChat();

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
      <button onClick={() => xrStore.enterAR()}>Enter AR</button>
      <div>
        <button onClick={() => startMediaRecording()}>Start Recording</button>
        <button onClick={() => stopMediaRecording()}>Stop</button>
        <pre>{recordedText}</pre>
      </div>
    </>
  )
}

export default App
