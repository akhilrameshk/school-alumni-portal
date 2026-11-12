'use client';
import { Box, Button, Typography } from '@mui/material';
import { IconBox } from './Icons';
import { fmtDate } from '@/lib/format';

export default function EventRow({ e, onDetails }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.75, border: '1px solid', borderColor: 'divider', borderRadius: 4, p: 1.75, mb: 1.5, bgcolor: 'rgba(255,255,255,.03)' }}>
      <IconBox name="cal" />
      <Box sx={{ flex: '1 1 140px' }}>
        <Typography sx={{ fontFamily: 'var(--font-fraunces)', fontWeight: 700, fontSize: 18 }}>{e.title}</Typography>
        <Typography variant="caption" color="text.secondary">{[fmtDate(e.date), e.venue, e.time].filter(Boolean).join(' · ')}</Typography>
      </Box>
      <Button size="small" variant="contained" color="secondary" onClick={() => onDetails(e)}>Details</Button>
    </Box>
  );
}
