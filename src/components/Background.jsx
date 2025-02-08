import React from 'react'
import { useTexture } from '@react-three/drei'

function Background({ type, texture, color, brightness = 1, isRotating = false, rotationSpeed = 1 }) {
  const textureMap = type === 'texture' ? useTexture(texture) : null

  if (type === 'texture' && textureMap) {
    return (
      <mesh scale={[-1, 1, 1]} rotation={[0, isRotating ? -rotationSpeed * Math.PI / 30 : 0, 0]}>
        <sphereGeometry args={[50, 64, 32]} />
        <meshBasicMaterial 
          map={textureMap} 
          side={2}
          color={[brightness, brightness, brightness]}
        />
      </mesh>
    )
  }

  return <color attach="background" args={[color]} />
}

export default Background
