import React, { useRef, useEffect, useState } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

function PathTracker({ color = '#ff0000', maxPoints = 60, onPointsUpdate }) {
  const [points, setPoints] = useState([])
  const mousePos = useRef({ x: 0, y: 0 })
  const sphereRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePos.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!camera || !sphereRef.current) return

    const raycaster = new THREE.Raycaster()
    const interval = setInterval(() => {
      raycaster.setFromCamera(mousePos.current, camera)

      const intersection = raycaster.intersectObject(sphereRef.current)
      if (intersection.length > 0) {
        const point = intersection[0].point
        setPoints(prev => {
          const newPoints = [...prev, point]
          if (newPoints.length > maxPoints) {
            return newPoints.slice(-maxPoints)
          }
          return newPoints
        })
      }
    }, 33) // ~30fps

    return () => clearInterval(interval)
  }, [camera, maxPoints])

  // Update parent component with points
  useEffect(() => {
    onPointsUpdate?.(points)
  }, [points, onPointsUpdate])

  return (
    <>
      <mesh ref={sphereRef} visible={false}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial opacity={0} transparent />
      </mesh>
      {points.length > 1 && (
        <Line
          points={points}
          color={color}
          lineWidth={2}
        />
      )}
    </>
  )
}

export default PathTracker
