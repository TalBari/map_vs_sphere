import React from 'react';
import { Box } from '@mui/material';

function MapViewer({ texture, projectionType }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '200px',
        backgroundImage: `url(/textures/${texture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '4px',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    />
  );
}

export default MapViewer;
