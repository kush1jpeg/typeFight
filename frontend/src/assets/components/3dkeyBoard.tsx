import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState, type CSSProperties } from 'react'
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import { Text } from '@react-three/drei';
import { TerminalUI } from './terminal';
import { Camera } from './camera';
import { useLoadingStore } from '../zustand';
import { DotLoader } from 'react-spinners';

const override: CSSProperties = {
  display: "block",
  margin: "50vh auto",
  width: '30px',
};

function Lamp() {
  const { scene } = useGLTF('/3d-model/lamp.glb');
  return (<primitive object={scene} position={[0, 5, -2]} scale={0.5} />)
}

function GameTitle() {
  return (<>
    <Text
      position={[5, 4, 5]} // X, Y, Z position
      fontSize={1.2}
      color="rgba(1, 175, 173, 1)"
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      font="/freak.ttf"
      rotation={[0, Math.PI / 2, 0]}
      scale={[-1.3, 1.3, -1.3]}
    >
      Type-Fight ⚔️
    </Text>
    <Text
      position={[5, 3, 5]} // X, Y, Z position
      fontSize={0.3}
      color="rgba(102, 168, 17, 1)"
      maxWidth={100}
      lineHeight={1}
      letterSpacing={0.02}
      font="/print.ttf"
      textAlign="center"
      rotation={[0, Math.PI / 2, 0]}
      scale={[-1, 1, -1]}
    >
      Space|Enter➡Play  Esc➡Home
    </Text>
  </>
  );
}


function Chair() {
  const { scene } = useGLTF('/3d-model/chair.glb');
  const setloaded = useLoadingStore((s: any) => s.setLoaded);
  useEffect(() => { setloaded() }, [scene])
  return (<primitive object={scene} rotation={[0, (Math.PI * 2.7) / 2, 0]} position={[2, -2.4, 4.1]} scale={3} castShadow />)
}

function Logo() {
  const { scene } = useGLTF('/3d-model/logo.glb');
  return <primitive object={scene} scale={0.5} rotation={[0, 0, 0]} position={[-7, 3, -5.1]} />;
}



function Monitor() {
  const { scene } = useGLTF('/3d-model/monitor.glb');
  return <primitive object={scene} scale={1} rotation={[0, 0, 0]} position={[0, -0.1, -3.2]} />;
}

function Table() {
  const woodTexture = useTexture('/wood.jpg');
  const brickTexture = useTexture('/brick.jpg');
  const floorTexture = useTexture('/floor.jpg');
  const tileTexture = useTexture('/tile.jpg');
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, -2.2]}>
        <boxGeometry args={[10, 7, 0.1]} />
        <meshStandardMaterial map={woodTexture} color="rgba(139, 61, 8, 1)" roughness={1} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4.7, -1.7, -3]}>
        <boxGeometry args={[5, 3, 0.2]} />
        <meshStandardMaterial map={woodTexture} color="rgba(139, 61, 8, 1)" roughness={1} />
      </mesh>

      {/* for the upper wall */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-6.4, 6.0, 7.2]}>
        <planeGeometry args={[23, 27]} />
        <meshStandardMaterial map={brickTexture} color="rgba(98, 97, 97, 1)" roughness={5} />
      </mesh>

      {/* for the back wall */}
      <mesh rotation={[0, 0, 0]} position={[-6.2, 2.5, -5.2]}>
        <planeGeometry args={[23, 10]} />
        <meshStandardMaterial map={brickTexture} color="#2F243A" roughness={1} />
      </mesh>

      {/* for the right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[5, 2.5, 8.2]}>
        <planeGeometry args={[28, 10]} />
        <meshStandardMaterial map={brickTexture} color="#473D55" roughness={1} />
      </mesh>
      {/* for the left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-17, 2.5, 5.2]}>
        <planeGeometry args={[23, 10]} />
        <meshStandardMaterial map={tileTexture} color="rgba(35, 34, 34, 1)" roughness={1} />
      </mesh>

      {/* for the floor wall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.9, -2.5, 7.2]} receiveShadow>
        <planeGeometry args={[23, 27]} />
        <shadowMaterial opacity={0.5} />
        <meshStandardMaterial map={floorTexture} color="#1E1929" roughness={5} />
      </mesh>
    </>
  );
}

export default function ROOM() {
  const loaded = useLoadingStore((s) => s.isLoaded);
  console.log(loaded);
  const [showTerminal, setShowTerminal] = useState(false)
  return (
    <>
      {!loaded && (
        <DotLoader
          cssOverride={override}
          color="#f1d946"
          size={40}
        />
      )}

      <Canvas style={{ background: 'black' }} shadows >

        <Camera terminal={() => {
          setShowTerminal(prev => !prev);
          console.log("terminal clicked");
        }} />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10} />

        <Suspense fallback={null}>

          <Monitor />
          <GameTitle />
          <Table />
          <Chair />
          <Logo />
          <pointLight position={[-7, 3, -4]} intensity={8} color={"#fff"} />
          <ambientLight intensity={0.1} />
          <Lamp />

          {showTerminal && (
            <TerminalUI />
          )}
          <Environment preset="park">
            <Lightformer
              form="rect"
              intensity={2}
              color="white"
              position={[5, 5, 5]}
              scale={[5, 5, 1]}
              target={[0, 0, 0]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </>
  )
}
