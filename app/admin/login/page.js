'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Stack, TextField, Button, Typography, Alert } from '@mui/material';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { router.replace('/admin'); return; }
    setError(data.error || 'Login failed');
    setLoading(false);
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, background: 'radial-gradient(circle at 70% 30%, #2c8a4e 0, #14452a 45%, #0f2f1c 100%)' }}>
      <Card sx={{ p: 5, width: '100%', maxWidth: 420, borderRadius: 6, textAlign: 'center' }}>
        <Box component="img" src="/logo.jpg" alt="" sx={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '4px solid #e4f1e7' }} />
        <Typography variant="h4" sx={{ mt: 1.5 }}>Admin Login</Typography>
        <Typography sx={{ opacity: 0.7, fontSize: 14 }}>SDV HSS Alumni Association</Typography>
        <form onSubmit={submit}>
          <Stack spacing={2} sx={{ mt: 3, textAlign: 'left' }}>
            <TextField label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" required autoFocus />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required />
            {process.env.NODE_ENV !== 'production' && <Alert severity="info">Local testing: username <b>admin</b>, password <b>admin123</b> (until you set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local).</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}
