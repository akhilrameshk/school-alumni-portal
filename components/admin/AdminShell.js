'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Container, Stack, Box, Tabs, Tab } from '@mui/material';

const TABS = [
  { key: 'members', label: 'Members', href: '/admin' },
  { key: 'events', label: 'Events & Announcements', href: '/admin/events' },
  { key: 'gallery', label: 'Gallery', href: '/admin/gallery' },
  { key: 'committee', label: 'Committee', href: '/admin/committee' },
  { key: 'ads', label: 'Advertisements', href: '/admin/ads' },
];

export default function AdminShell({ tab, children }) {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }
  return (
    <Box>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#0f2f1c' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box component="img" src="/logo.jpg" alt="" sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            <Typography variant="h6">SDV HSS Alumni · Admin</Typography>
          </Stack>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
        <Tabs value={tab} variant="scrollable" textColor="inherit" TabIndicatorProps={{ sx: { bgcolor: 'secondary.main', height: 3 } }} sx={{ px: 2 }}>
          {TABS.map((t) => <Tab key={t.key} value={t.key} label={t.label} component={Link} href={t.href} sx={{ textTransform: 'none', fontWeight: 700 }} />)}
        </Tabs>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>{children}</Container>
    </Box>
  );
}
