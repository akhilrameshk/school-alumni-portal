'use client';
import { useState } from 'react';
import { Box, Button, Alert, Stack, Typography } from '@mui/material';
import { uploadImage } from '@/lib/uploadClient';

export default function ImageUpload({ value, onChange, label = 'Choose image', hint }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true); setErr('');
    try { onChange(await uploadImage(file)); }
    catch (ex) { setErr(ex.message); }
    setBusy(false);
  }
  return (
    <Stack spacing={1}>
      {value && <Box component="img" src={value} alt="" sx={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 3 }} />}
      <Button component="label" variant="outlined" disabled={busy} sx={{ borderStyle: 'dashed' }}>
        {busy ? 'Uploading...' : value ? 'Change image' : label}
        <input hidden type="file" accept="image/*" onChange={pick} />
      </Button>
      {hint && <Typography sx={{ fontSize: 13, opacity: 0.7 }}>{hint}</Typography>}
      {err && <Alert severity="error">{err}</Alert>}
    </Stack>
  );
}
