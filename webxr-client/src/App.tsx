import './App.css'
import { Canvas } from '@react-three/fiber'
import { createXRStore, XR } from '@react-three/xr'
import { Text } from '@react-three/drei'
import { useWhispherChat } from './whisperhook'

// Disable hand tracking
const xrStore = createXRStore({ hand: false });

function App() {
  const {
    startMediaRecording, stopMediaRecording, recordedText, chatReply, isRecording, isProcessing
  } = useWhispherChat({
    "enableOculusHack": true,
  });

  return (
    <>
      <Canvas>
        <XR store={xrStore}>
        <directionalLight color="white" position={[0, 0, 5]} />
        <mesh
          position={[0, 3, -10]}
          onPointerDown={() => startMediaRecording()}
          onPointerUp={() => stopMediaRecording()}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={isRecording ? "orange" : isProcessing ? "yellow" : "blue"} />
            <Text position={[0, -2, 0]} fontSize={0.5} color="white" maxWidth={10} lineHeight={1.2} anchorY="top">
              {chatReply}
            </Text>
        </mesh>
        </XR>
      </Canvas>
      <h1>A simple WebXR demo.</h1>
      <button onClick={() => xrStore.enterAR()}>Enter AR</button>
      <div>
        <button onClick={() => startMediaRecording()}>Start Recording</button>
        <button onClick={() => stopMediaRecording()}>Stop</button>
        <pre>{recordedText}</pre>
        <pre>{chatReply}</pre>
      </div>
    </>
  )
}

export default App
