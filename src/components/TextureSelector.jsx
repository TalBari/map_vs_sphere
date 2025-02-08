import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField, Box } from '@mui/material'

// We'll get all available textures from the file system
const getTextureFiles = async () => {
  const files = [
    '2k_neptune.jpg',
    '2k_uranus.jpg',
    '4k_ceres_fictional.jpg',
    '4k_eris_fictional.jpg',
    '4k_haumea_fictional.jpg',
    '4k_makemake_fictional.jpg',
    '4k_venus_atmosphere.jpg',
    '8k_earth_clouds.jpg',
    '8k_earth_daymap.jpg',
    '8k_earth_nightmap.jpg',
    '8k_jupiter.jpg',
    '8k_mars.jpg',
    '8k_mercury.jpg',
    '8k_moon.jpg',
    '8k_saturn.jpg',
    '8k_saturn_ring_alpha.png',
    '8k_stars.jpg',
    '8k_stars_milky_way.jpg',
    '8k_sun.jpg',
    '8k_venus_surface.jpg',
    'Earth_original.jpg',
    'Earth_resized.jpg',
    'directions_equirectangular.png',
    '1567215018748-ESA_Gaia_DR2_AllSky_Brightness_Colour_Cartesian_2000x1000.png',
    'directions.jpg',
    '2k_CMB.jpg',
    'basket-texture-orange-vector.jpg'

  ]

  return files.map(file => ({
    id: file,
    label: file.replace(/\.[^/.]+$/, '').split('_').join(' ')
  }))
}

function TextureSelector({ label, value, onChange }) {
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    getTextureFiles().then(setOptions)
  }, [])

  const currentValue = value ? options.find(opt => `./textures/${opt.id}` === value) || null : null

  return (
    <Autocomplete
      value={currentValue}
      onChange={(event, newValue) => {
        onChange?.(newValue ? `./textures/${newValue.id}` : '')
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      options={options}
      getOptionLabel={(option) => option?.label || ''}
      renderInput={(params) => (
        <TextField {...params} label={label} />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box component="img" 
            src={`./textures/${option.id}`}
            alt={option.label}
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 2,
              objectFit: 'cover',
              borderRadius: 1
            }}
          />
          {option.label}
        </Box>
      )}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
    />
  )
}

export default TextureSelector
