import React, { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { 
  Box, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Stack, 
  Slider, 
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  IconButton,
  Tooltip,
  Drawer,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button
} from '@mui/material'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PublicIcon from '@mui/icons-material/Public'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import BrushIcon from '@mui/icons-material/Brush'
import SettingsIcon from '@mui/icons-material/Settings'
import Sphere from './components/Sphere'
import Background from './components/Background'
import Map from './components/Map'
import BackgroundMap from './components/BackgroundMap'
import TextureSelector from './components/TextureSelector'
import MapDrawer from './components/MapDrawer'
import SpherePath from './components/SpherePath'
import BackgroundPath from './components/BackgroundPath'

const projections = [
  { id: 'equirectangular', name: 'Equirectangular' },
  { id: 'mercator', name: 'Mercator' },
]

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '16px' }}>
      {value === index && children}
    </div>
  )
}

function App() {
  const [projection, setProjection] = useState('equirectangular')
  const [texture, setTexture] = useState('./textures/8k_earth_daymap.jpg')
  const [sphereBrightness, setSphereBrightness] = useState(1)
  const [bgType, setBgType] = useState('color')
  const [bgTexture, setBgTexture] = useState('./textures/8k_stars.jpg')
  const [bgColor, setBgColor] = useState('#000000')
  const [bgBrightness, setBgBrightness] = useState(1)
  const [pathColor, setPathColor] = useState('#ff0000')
  const [pathPoints, setPathPoints] = useState([])
  const [bgPathPoints, setBgPathPoints] = useState([])
  const [isRotating, setIsRotating] = useState(false)
  const [rotationSpeed, setRotationSpeed] = useState(1)
  const [bgIsRotating, setBgIsRotating] = useState(false)
  const [bgRotationSpeed, setBgRotationSpeed] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const containerRef = useRef()
  const mapContainerRef = useRef()
  const bgMapContainerRef = useRef()

  const handleSphereBrightnessChange = (event, newValue) => {
    setSphereBrightness(newValue)
  }

  const handleBgBrightnessChange = (event, newValue) => {
    setBgBrightness(newValue)
  }

  const handleBgTypeChange = (event) => {
    setBgType(event.target.checked ? 'texture' : 'color')
  }

  const handlePathUpdate = (points) => {
    setPathPoints(points)
  }

  const handleBgPathUpdate = (points) => {
    setBgPathPoints(points)
  }

  const handleRotationChange = (event) => {
    setIsRotating(event.target.checked)
  }

  const handleSpeedChange = (event, newValue) => {
    setRotationSpeed(newValue)
  }

  const handleBgRotationChange = (event) => {
    setBgIsRotating(event.target.checked)
  }

  const handleBgSpeedChange = (event, newValue) => {
    setBgRotationSpeed(newValue)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Scene */}
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 0, 3] }}>
          <Background 
            type={bgType} 
            texture={bgTexture}
            color={bgColor}
            brightness={bgBrightness}
            isRotating={bgIsRotating}
            rotationSpeed={bgRotationSpeed}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Sphere 
            texture={texture} 
            brightness={sphereBrightness}
            isRotating={isRotating}
            rotationSpeed={rotationSpeed}
          />
          <SpherePath points={pathPoints} color={pathColor} />
          {bgType === 'texture' && <BackgroundPath points={bgPathPoints} color={pathColor} />}
          <OrbitControls />
        </Canvas>
      </div>

      {/* Control Buttons */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 1 }}>
        <Tooltip title={drawerOpen ? "Hide Controls" : "Show Controls"}>
          <IconButton
            onClick={toggleDrawer}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Control Panel */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        sx={{
          width: 400,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 400,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
          },
        }}
      >
        <Paper elevation={0} sx={{ height: '100%', overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<PublicIcon />} label="Planet" />
            <Tab icon={<WallpaperIcon />} label="Background" />
            <Tab icon={<BrushIcon />} label="Drawing" />
            <Tab icon={<SettingsIcon />} label="Settings" />
          </Tabs>

          <Box sx={{ overflow: 'auto', height: 'calc(100% - 48px)' }}>
            {/* Planet Settings */}
            <TabPanel value={activeTab} index={0}>
              <Stack spacing={3}>
                <TextureSelector
                  label="Planet Texture"
                  value={texture}
                  onChange={(path) => path && setTexture(path)}
                />

                <Box>
                  <Typography gutterBottom>Planet Brightness</Typography>
                  <Slider
                    value={sphereBrightness}
                    onChange={handleSphereBrightnessChange}
                    min={0}
                    max={2}
                    step={0.1}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 1, label: '1' },
                      { value: 2, label: '2' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={isRotating}
                      onChange={handleRotationChange}
                    />
                  }
                  label="Auto Rotation"
                />

                {isRotating && (
                  <Box>
                    <Typography gutterBottom>Rotation Speed (RPM)</Typography>
                    <Slider
                      value={rotationSpeed}
                      onChange={handleSpeedChange}
                      min={0.1}
                      max={10}
                      step={0.1}
                      marks={[
                        { value: 0.1, label: '0.1' },
                        { value: 5, label: '5' },
                        { value: 10, label: '10' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}

                <Box sx={{ position: 'relative' }} ref={mapContainerRef}>
                  <Typography gutterBottom variant="h6">Planet Map</Typography>
                  <Map projection={projection} texture={texture} />
                  <MapDrawer color={pathColor} onPathUpdate={handlePathUpdate} />
                </Box>
              </Stack>
            </TabPanel>

            {/* Background Settings */}
            <TabPanel value={activeTab} index={1}>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={bgType === 'texture'}
                      onChange={handleBgTypeChange}
                    />
                  }
                  label="Use Background Texture"
                />

                {bgType === 'texture' ? (
                  <>
                    <TextureSelector
                      label="Background Texture"
                      value={bgTexture}
                      onChange={(path) => path && setBgTexture(path)}
                    />
                    <Box>
                      <Typography gutterBottom>Background Brightness</Typography>
                      <Slider
                        value={bgBrightness}
                        onChange={handleBgBrightnessChange}
                        min={0}
                        max={2}
                        step={0.1}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 1, label: '1' },
                          { value: 2, label: '2' }
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={bgIsRotating}
                          onChange={handleBgRotationChange}
                        />
                      }
                      label="Background Rotation"
                    />
                    {bgIsRotating && (
                      <Box>
                        <Typography gutterBottom>Background Rotation Speed (RPM)</Typography>
                        <Slider
                          value={bgRotationSpeed}
                          onChange={handleBgSpeedChange}
                          min={0.1}
                          max={10}
                          step={0.1}
                          marks={[
                            { value: 0.1, label: '0.1' },
                            { value: 5, label: '5' },
                            { value: 10, label: '10' }
                          ]}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                    )}
                    <Box sx={{ position: 'relative' }} ref={bgMapContainerRef}>
                      <Typography gutterBottom variant="h6">Background Map</Typography>
                      <BackgroundMap texture={bgTexture} />
                      <MapDrawer color={pathColor} onPathUpdate={handleBgPathUpdate} />
                    </Box>
                  </>
                ) : (
                  <TextField
                    fullWidth
                    label="Background Color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                )}
              </Stack>
            </TabPanel>

            {/* Drawing Settings */}
            <TabPanel value={activeTab} index={2}>
              <Stack spacing={3}>
                <Box>
                  <Typography gutterBottom>Path Color</Typography>
                  <TextField
                    fullWidth
                    type="color"
                    value={pathColor}
                    onChange={(e) => setPathColor(e.target.value)}
                  />
                </Box>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setPathPoints([])
                    setBgPathPoints([])
                  }}
                >
                  Clear All Paths
                </Button>
              </Stack>
            </TabPanel>

            {/* General Settings */}
            <TabPanel value={activeTab} index={3}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Map Projection</InputLabel>
                  <Select
                    value={projection}
                    label="Map Projection"
                    onChange={(e) => setProjection(e.target.value)}
                  >
                    {projections.map(proj => (
                      <MenuItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </TabPanel>
          </Box>
        </Paper>
      </Drawer>
    </div>
  )
}

export default App
