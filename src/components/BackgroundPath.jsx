import React, { useMemo } from 'react'
import * as THREE from 'three'

function BackgroundPath({ points, color = '#ff0000' }) {
  const mesh = useMemo(() => {
    if (points.length < 2) return null

    // Convert lat/lon to 3D points
    const spherePoints = points.map(({ lat, lon }) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      
      // Fixed coordinate transformation to match the background sphere orientation
      const x = -50 * Math.sin(phi) * Math.cos(theta)
      const y = -50 * Math.cos(phi)  
      const z = 50 * Math.sin(phi) * Math.sin(theta)
      
      return new THREE.Vector3(x, y, z)
    })

    // Create a smooth curve through the points
    const curve = new THREE.CatmullRomCurve3(spherePoints)
    
    // Create tube geometry with larger radius for more visible 3D effect
    const geometry = new THREE.TubeGeometry(curve, 
      Math.max(Math.floor(points.length * 2), 20), // segments
      1, // radius - 1 unit for background sphere (which is 50 units)
      8, // radial segments
      false // closed
    )

    return geometry
  }, [points])

  if (!mesh) return null

  return (
    <mesh>
      <primitive object={mesh} />
      <meshStandardMaterial 
        color={color}
        roughness={0.4}
        metalness={0.6}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  )
}

export default BackgroundPath
