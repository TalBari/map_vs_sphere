import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, BackSide, Color } from 'three';

function BackgroundSphere({ texture, radius = 150, brightness = 1 }) {
  const map = useLoader(TextureLoader, `/textures/${texture}`);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial 
        map={map}
        side={BackSide}
        color={new Color(brightness, brightness, brightness)}
      />
    </mesh>
  );
}

export default BackgroundSphere;
