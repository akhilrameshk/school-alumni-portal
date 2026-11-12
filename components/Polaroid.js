'use client';
import { Box, Typography } from '@mui/material';
import { Mountain } from './Icons';
import { cld } from '@/lib/format';

// Photo in a polaroid frame (gold or white). Shows a picture icon when there is no photo yet.
export default function Polaroid({ photo, caption, gold = true, i = 0, h = { xs: 130, md: 190 } }) {
  const rot = [-3, 2, -2, 3][i % 4];
  return (
    <Box sx={{ bgcolor: gold ? 'secondary.main' : '#fff', p: 1.25, pb: 4.5, borderRadius: 0.75, boxShadow: '0 14px 28px rgba(0,0,0,.35)', transform: `rotate(${rot}deg)`, position: 'relative' }}>
      <Box sx={{ height: h, bgcolor: '#e7e7e2', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {photo ? <Box component="img" src={cld(photo.imageUrl, 600)} alt={photo.caption || ''} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Mountain />}
      </Box>
      <Typography sx={{ position: 'absolute', left: 0, right: 0, bottom: 7, textAlign: 'center', fontSize: 13, fontWeight: 600, color: gold ? '#2a1f00' : '#333' }}>
        {caption ?? (photo ? photo.caption || photo.album : '')}
      </Typography>
    </Box>
  );
}
