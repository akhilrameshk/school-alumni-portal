'use client';
import { useState } from 'react';
import { Alert, Box, Button, Card, Container, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import AdSlot from '@/components/AdSlot';
import { IconBox } from '@/components/Icons';
import { SITE } from '@/lib/config';
import { post } from '@/lib/clientPay';

const MAP = process.env.NEXT_PUBLIC_MAP_EMBED_URL || ''; // optional Google Maps embed URL
const card = { bgcolor: 'rgba(255,255,255,.05)', borderRadius: 5.5, p: { xs: 2.5, md: 3.5 } };

export default function Page() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState({ loading: false, ok: false, error: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, ok: false, error: '' });
    try {
      await post('/api/contact', form);
      setForm({ name: '', email: '', message: '' });
      setState({ loading: false, ok: true, error: '' });
    } catch (err) {
      setState({ loading: false, ok: false, error: err.message });
    }
  }

  return (
    <>
      <PageHeader title="Contact Us" subtitle="We would love to hear from you." />
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 5 } }}>
        <AdSlot page="contact" n={1} bare />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 4.5 }}>
          <Card variant="outlined" sx={card}>
            <Box component="form" onSubmit={submit}>
              <Stack spacing={2}>
                <TextField label="Name" value={form.name} onChange={set('name')} required />
                <TextField label="Email" type="email" value={form.email} onChange={set('email')} required />
                <TextField label="Message" value={form.message} onChange={set('message')} multiline minRows={6} required />
                {state.ok && <Alert severity="success">Thank you! We will get back to you soon.</Alert>}
                {state.error && <Alert severity="error">{state.error}</Alert>}
                <Button type="submit" variant="contained" color="secondary" size="large" disabled={state.loading}>{state.loading ? 'Sending...' : 'Submit'}</Button>
              </Stack>
            </Box>
          </Card>
          <Card variant="outlined" sx={card}>
            <Stack spacing={2.25}>
              {[['phone', 'Phone', SITE.phone], ['mail', 'Email', SITE.email], ['pin', 'Address', SITE.address]].map(([i, l, v]) => (
                <Stack key={l} direction="row" spacing={2} alignItems="center">
                  <IconBox name={i} />
                  <Box><Typography fontWeight={700}>{l}</Typography><Typography color="text.secondary" fontSize={14}>{v}</Typography></Box>
                </Stack>
              ))}
              {MAP ? (
                <Box component="iframe" src={MAP} title="Map" loading="lazy" sx={{ border: 0, width: '100%', height: 210, borderRadius: 4 }} />
              ) : (
                <Box sx={{ height: 210, borderRadius: 4, background: 'repeating-linear-gradient(60deg,#3a6a50 0,#3a6a50 36px,#2b5540 36px,#2b5540 40px)' }} />
              )}
            </Stack>
          </Card>
        </Box>
        <AdSlot page="contact" n={2} bare />
      </Container>
    </>
  );
}
