import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { memo } from 'react';


export const Camera = memo(function Camera({ terminal }: { terminal: () => void }) {

  const { camera } = useThree();
  const timeRef = useRef(0);         // For oscillation
  const zoomProgress = useRef(0);    // For zoom animation
  const [zooming, setZooming] = useState(false);
  const [startPos, setStartPos] = useState(new THREE.Vector3);

  let endPosition = useMemo(() => new THREE.Vector3(0.2, 1.7, -0.8), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0.1, 1, -9), []);
  const triggered = useRef(false);

  const radius = 10;
  const height = 5;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.code === 'Space') && !zooming) {
        triggered.current = false;
        zoomProgress.current = 0;
        setStartPos(camera.position.clone());
        setZooming(true);
      } else if (e.key === 'Escape') {
        // Force exit zoom
        setZooming(false);
        triggered.current = false;
        camera.position.set(0, 0, 0);
      }
    };


    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [camera, zooming]);;

  useFrame((_, delta) => {
    if (!zooming) {
      timeRef.current += delta * 0.3;   //speed

      const angle1 = Math.sin(timeRef.current) * (Math.PI / 2);
      const angle2 = Math.sin(timeRef.current) * (Math.PI / 3);

      const x = Math.cos(angle1) * radius;
      const z = Math.sin(angle2) * radius;

      camera.position.set(-z - 4, height, x + 2);
      camera.lookAt(0, 0, 0);
    } else {
      // gpt man
      zoomProgress.current += delta;
      const rawT = Math.min(zoomProgress.current / 2, 1);
      const t = rawT * rawT * (3 - 2 * rawT); // smoothstep

      const newPos = new THREE.Vector3().lerpVectors(startPos, endPosition, t);
      camera.position.copy(newPos);
      camera.lookAt(lookTarget);
  if (!triggered.current) {
      triggered.current = true;
      terminal(); 
      //i am thinking to bind the web sockets on  zoom
    }
    }
  });

  return null;
})
