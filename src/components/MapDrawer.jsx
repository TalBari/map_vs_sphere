import React, { useEffect, useRef, useState } from 'react'

function MapDrawer({ color = '#ff0000', onPathUpdate }) {
  const canvasRef = useRef()
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setIsDrawing(true)
      setPoints([{ x, y }])
    }

    const handleMouseMove = (e) => {
      if (!isDrawing) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setPoints(prev => {
        const newPoints = [...prev, { x, y }]
        // Convert to lat/lon coordinates
        const latLonPoints = newPoints.map(point => ({
          lon: (point.x / canvas.width) * 360 - 180,
          lat: 90 - (point.y / canvas.height) * 180
        }))
        onPathUpdate(latLonPoints)
        return newPoints
      })

      // Draw the line
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      points.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    }

    const handleMouseUp = () => {
      setIsDrawing(false)
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [color, isDrawing, points, onPathUpdate])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'crosshair'
      }}
    />
  )
}

export default MapDrawer
