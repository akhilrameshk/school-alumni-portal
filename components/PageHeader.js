'use client';
import { Box, Typography } from '@mui/material';

// Centered page title (the dark design has no banner image on inner pages).
export default function PageHeader({ title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', pt: { xs: 5, md: 7 }, px: 3 }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 56 } }}>{title}</Typography>
      {subtitle && <Typography sx={{ mt: 1.25, fontSize: { xs: 16, md: 18 }, color: 'text.secondary' }}>{subtitle}</Typography>}
    </Box>
  );
}
