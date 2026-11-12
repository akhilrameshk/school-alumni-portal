'use client';
import Link from 'next/link';
import { Box, Typography, Stack } from '@mui/material';
import { NAV, SITE } from '@/lib/config';

export default function Footer() {
  const h = { color: 'secondary.light', mb: 1.5, fontSize: 20 };
  const link = { color: 'text.secondary', textDecoration: 'none', fontSize: 14 };
  return (
    <Box component="footer" sx={{ bgcolor: '#143524', px: { xs: 2, md: 5 }, pt: { xs: 4, md: 5 }, pb: 3, mt: { xs: 6, md: 8 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1.4fr' }, gap: 5, maxWidth: 1280, mx: 'auto' }}>
        <Box>
          <Typography variant="h6" sx={h}>{SITE.name}</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>Samanvayam brings every batch of our school together.</Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={h}>Pages</Typography>
          <Stack spacing={0.9}>
            {NAV.map((n) => <Typography key={n.href} component={Link} href={n.href} sx={link}>{n.label}</Typography>)}
            <Typography component={Link} href="/privacy" sx={link}>Privacy Policy</Typography>
          </Stack>
        </Box>
        <Box>
          <Typography variant="h6" sx={h}>Contact</Typography>
          <Stack spacing={0.9} sx={{ color: 'text.secondary', fontSize: 14 }}>
            <Typography fontSize={14}>{SITE.address}</Typography><Typography fontSize={14}>{SITE.phone}</Typography><Typography fontSize={14}>{SITE.email}</Typography>
          </Stack>
        </Box>
      </Box>
      <Typography sx={{ maxWidth: 1280, mx: 'auto', mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,.12)', fontSize: 13, color: 'text.secondary' }}>© {new Date().getFullYear()} {SITE.name}</Typography>
    </Box>
  );
}
