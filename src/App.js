import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Paper, Typography, Slider, IconButton } from '@mui/material';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SphereViewer from './components/SphereViewer';
import BackgroundSphere from './components/BackgroundSphere';
import TextureSelector from './components/TextureSelector';

function App() {
  const [selectedTexture, setSelectedTexture] = useState('8k_earth_daymap.jpg');
  const [backgroundTexture, setBackgroundTexture] = useState('8k_stars_milky_way.jpg');
  const [backgroundRadius, setBackgroundRadius] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [sphereBrightness, setSphereBrightness] = useState(1);
  const [backgroundBrightness, setBackgroundBrightness] = useState(1);

  const handleRadiusChange = (event, newValue) => {
    setBackgroundRadius(newValue);
  };

  const handleSphereBrightnessChange = (event, newValue) => {
    setSphereBrightness(newValue);
  };

  const handleBackgroundBrightnessChange = (event, newValue) => {
    setBackgroundBrightness(newValue);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleUI = () => {
    setShowUI(!showUI);
  };

  const MapDisplay = ({ texture, label }) => (
    <Box mt={1} mb={3}>
      <Typography variant="caption" display="block" gutterBottom style={{ color: '#888' }}>
        {label} (Equirectangular View)
      </Typography>
      <div style={{
        width: '100%',
        paddingTop: '50%', // This creates a 2:1 aspect ratio (width:height)
        position: 'relative',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        borderRadius: '4px',
        backgroundColor: '#1e1e1e',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(/textures/${texture})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>
    </Box>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75, far: 1000 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Suspense fallback={null}>
          <SphereViewer texture={selectedTexture} brightness={sphereBrightness} />
          <BackgroundSphere 
            texture={backgroundTexture} 
            radius={backgroundRadius} 
            brightness={backgroundBrightness}
          />
        </Suspense>
      </Canvas>

      {/* Control Buttons (always visible) */}
      <div 
        className="control-buttons"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px'
        }}
      >
        <IconButton
          onClick={toggleFullscreen}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
          size="large"
        >
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
        <IconButton
          onClick={toggleUI}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
          size="large"
        >
          {showUI ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </div>

      {/* Floating UI */}
      {showUI && (
        <Paper
          elevation={3}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '20px',
            width: '360px',
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            color: '#fff',
            zIndex: 1000,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Map vs Sphere Simulator
          </Typography>
          
          <TextureSelector
            label="Sphere Texture"
            value={selectedTexture}
            onChange={(e) => setSelectedTexture(e.target.value)}
          />
          <MapDisplay texture={selectedTexture} label="Sphere Texture" />

          <Box mt={2}>
            <Typography gutterBottom style={{ color: '#fff' }}>
              Sphere Brightness: {sphereBrightness.toFixed(2)}
            </Typography>
            <Slider
              value={sphereBrightness}
              onChange={handleSphereBrightnessChange}
              min={0}
              max={3}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' }
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: '#29b6f6',
                '& .MuiSlider-markLabel': {
                  color: '#888'
                }
              }}
            />
          </Box>

          <TextureSelector
            label="Background Texture"
            value={backgroundTexture}
            onChange={(e) => setBackgroundTexture(e.target.value)}
          />
          <MapDisplay texture={backgroundTexture} label="Background Texture" />

          <Box mt={2}>
            <Typography gutterBottom style={{ color: '#fff' }}>
              Background Brightness: {backgroundBrightness.toFixed(2)}
            </Typography>
            <Slider
              value={backgroundBrightness}
              onChange={handleBackgroundBrightnessChange}
              min={0}
              max={3}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' }
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: '#29b6f6',
                '& .MuiSlider-markLabel': {
                  color: '#888'
                }
              }}
            />
          </Box>

          <Box mt={2}>
            <Typography gutterBottom style={{ color: '#fff' }}>
              Background Sphere Radius: {backgroundRadius}
            </Typography>
            <Slider
              value={backgroundRadius}
              onChange={handleRadiusChange}
              min={3}
              max={500}
              step={1}
              marks={[
                { value: 3, label: '3' },
                { value: 50, label: '50' },
                { value: 500, label: '500' }
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: '#29b6f6',
                '& .MuiSlider-markLabel': {
                  color: '#888'
                }
              }}
            />
          </Box>
        </Paper>
      )}
    </div>
  );
}

export default App;
