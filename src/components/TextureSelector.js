import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const textures = [
  '8k_earth_daymap.jpg',
  '8k_earth_nightmap.jpg',
  '8k_mars.jpg',
  '8k_jupiter.jpg',
  '8k_saturn.jpg',
  '8k_venus_surface.jpg',
  '8k_mercury.jpg',
  '8k_moon.jpg',
  '2k_neptune.jpg',
  '2k_uranus.jpg',
  '8k_sun.jpg',
  '8k_stars.jpg',
  '8k_stars_milky_way.jpg',
  'directions_equirectangular.png',
  'directions.jpg',
  'ESA_Gaia_AllSky_2000x1000.png',
  '2k_CMB.jpg',
  'try_stars.png',
  'constellations.jpg',
  'Constellations_galatic_plane.png',
  'tennis.png',
  'golf.png',
  'soccer.png',
  'basketball.png'
];

function TextureSelector({ label, value, onChange }) {
  return (
    <Box mt={2}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange} label={label}>
          {textures.map((texture) => (
            <MenuItem key={texture} value={texture}>
              {texture.replace(/_/g, ' ').replace('.jpg', '')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default TextureSelector;
