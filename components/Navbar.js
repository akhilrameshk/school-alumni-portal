'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Box, Button, Stack, Typography } from '@mui/material';
import { NAV, SITE } from '@/lib/config';
import { useDialogs } from './Dialogs';

export default function Navbar() {
  const pathname = usePathname();
  const { openJoin } = useDialogs();
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(16,48,32,.97)', backgroundImage: 'none', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
      <Toolbar sx={{ gap: { xs: 1, md: 2 }, justifyContent: 'space-between', px: { xs: 1.5, md: 5 }, minHeight: { xs: 56, md: 64 } }}>
        <Stack component={Link} href="/" direction="row" spacing={1.25} alignItems="center" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <Box component="img" src="/logo.jpg" alt={SITE.short} sx={{ width: { xs: 34, md: 40 }, height: { xs: 34, md: 40 }, borderRadius: '50%', objectFit: 'cover', border: '2px solid', borderColor: 'secondary.main' }} />
          <Typography variant="h6" sx={{ display: { xs: 'none', md: 'block' } }}>{SITE.short}</Typography>
        </Stack>
        <Stack direction="row" spacing={{ xs: 1.1, md: 3.5 }} sx={{ fontSize: { xs: 11.5, md: 15 } }}>
          {NAV.map((n) => {
            const on = pathname === n.href;
            return (
              <Box key={n.href} component={Link} href={n.href} sx={{ color: on ? 'secondary.light' : 'inherit', textDecoration: 'none', py: 0.75, borderBottom: '2px solid', borderColor: on ? 'secondary.light' : 'transparent', whiteSpace: 'nowrap' }}>
                {n.short ? (<><Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{n.label}</Box><Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{n.short}</Box></>) : n.label}
              </Box>
            );
          })}
        </Stack>
        <Button variant="contained" color="secondary" onClick={openJoin} sx={{ px: { xs: 1.5, md: 3 }, py: { xs: 0.75, md: 1.1 }, fontSize: { xs: 12, md: 15 } }}>Register</Button>
      </Toolbar>
    </AppBar>
  );
}
