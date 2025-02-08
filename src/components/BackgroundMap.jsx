import React from 'react'
import { Box } from '@mui/material'

function BackgroundMap({ texture, width = 400 }) {
  const height = width / 2 // maintain 2:1 aspect ratio for equirectangular projection

  return (
    <Box
      component="img"
      src={texture}
      alt="Background Map"
      sx={{
        width: width,
        height: height,
        objectFit: 'cover',
        borderRadius: 1,
        display: 'block'
      }}
    />
  )
}

export default BackgroundMap
