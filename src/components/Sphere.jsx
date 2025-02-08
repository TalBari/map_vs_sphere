import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

function Sphere({ texture, brightness = 1, isRotating = false, rotationSpeed = 1 }) {
  const meshRef = useRef()
  const textureMap = useTexture(texture)

  useFrame((state, delta) => {
    if (isRotating && meshRef.current) {
      // Rotate around Y axis, speed is in rotations per minute
      meshRef.current.rotation.y += (delta * rotationSpeed * Math.PI) / 30
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 32]} />
      <meshStandardMaterial 
        map={textureMap} 
        emissive="#ffffff"
        emissiveMap={textureMap}
        emissiveIntensity={brightness}
      />
    </mesh>
  )
}

export default Sphere
