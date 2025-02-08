import React, { useEffect, useRef } from 'react'

function MapPath({ points, color = '#ff0000', width, height }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !width || !height || points.length < 2) return

    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Convert 3D points to map coordinates (equirectangular projection)
    const mapPoints = points.map(point => {
      const longitude = Math.atan2(point.x, point.z)
      const latitude = Math.asin(point.y)
      
      return {
        x: ((longitude + Math.PI) / (2 * Math.PI)) * width,
        y: ((Math.PI/2 - latitude) / Math.PI) * height
      }
    })

    // Draw path
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.moveTo(mapPoints[0].x, mapPoints[0].y)
    
    for (let i = 1; i < mapPoints.length; i++) {
      // Handle wrapping around the map edges
      const dx = mapPoints[i].x - mapPoints[i-1].x
      if (Math.abs(dx) > width/2) {
        // If the line would wrap around the edge, split it into two lines
        if (dx > 0) {
          ctx.lineTo(width, mapPoints[i-1].y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, mapPoints[i].y)
        } else {
          ctx.lineTo(0, mapPoints[i-1].y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(width, mapPoints[i].y)
        }
      }
      ctx.lineTo(mapPoints[i].x, mapPoints[i].y)
    }
    
    ctx.stroke()
  }, [points, color, width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
      }}
    />
  )
}

export default MapPath
