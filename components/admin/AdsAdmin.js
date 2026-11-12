'use client';
import { useState } from 'react';
import { Box, Typography, Stack, TextField, Button, Alert, Paper, Chip, FormControlLabel, Switch } from '@mui/material';
import useCollection from './useCollection';
import ImageUpload from './ImageUpload';
import { dateInput, fmtDate } from '@/lib/format';

const BLANK = { name: '', imageUrl: '', link: '', startDate: '', endDate: '', active: true };

function statusOf(ad) {
  const now = Date.now();
  if (!ad.active) return ['Off', 'default'];
  if (ad.startDate && new Date(ad.startDate).getTime() > now) return ['Scheduled', 'info'];
  if (ad.endDate && new Date(ad.endDate).getTime() + 864e5 <= now) return ['Expired', 'default'];
  return ['Active', 'success'];
}

export default function AdsAdmin() {
  const { items, error, save, remove } = useCollection('/api/admin/ads');
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setMsg({ type: '', text: '' });
    try {
      await save(editId, form);
      setMsg({ type: 'success', text: 'Advertisement saved.' });
      setForm(BLANK); setEditId(null);
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  }
  const startEdit = (ad) => { setEditId(ad.id); setForm({ ...BLANK, ...ad, link: ad.link || '', startDate: dateInput(ad.startDate), endDate: dateInput(ad.endDate) }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <Box>
      <Typography variant="h4">Advertisements</Typography>
      <Typography sx={{ opacity: 0.75, mb: 2 }}>Direct sponsor banners. The newest active banner fills ad spot 1 on every page, the next fills spot 2, and so on (up to 4). Any spot without a sponsor shows a Google ad.</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '400px 1fr' }, gap: 3, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{editId ? 'Edit advertisement' : 'Add advertisement'}</Typography>
          <Stack spacing={2}>
            <TextField label="Advertiser name" value={form.name} onChange={set('name')} />
            <ImageUpload value={form.imageUrl} onChange={(u) => setForm({ ...form, imageUrl: u })} label="Upload banner image" hint="Wide banner, about 1200 × 400" />
            <TextField label="Link (optional)" value={form.link} onChange={set('link')} placeholder="https://" />
            <Stack direction="row" spacing={1.5}>
              <TextField label="Show from" type="date" value={form.startDate} onChange={set('startDate')} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Show until" type="date" value={form.endDate} onChange={set('endDate')} InputLabelProps={{ shrink: true }} fullWidth />
            </Stack>
            <FormControlLabel control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />} label="Active" />
            {msg.text && <Alert severity={msg.type}>{msg.text}</Alert>}
            <Button variant="contained" onClick={submit}>Save advertisement</Button>
            {editId && <Button onClick={() => { setEditId(null); setForm(BLANK); }}>Cancel editing</Button>}
          </Stack>
        </Paper>

        <Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 2 }}>
            {items.map((ad) => {
              const [label, color] = statusOf(ad);
              return (
                <Paper key={ad.id} variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                  <Box component="img" src={ad.imageUrl} alt="" sx={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ p: 2 }}>
                    <Typography fontWeight={700}>{ad.name}</Typography>
                    <Typography sx={{ fontSize: 14, opacity: 0.7, my: 0.5 }}>{ad.startDate ? fmtDate(ad.startDate) : 'Any time'} – {ad.endDate ? fmtDate(ad.endDate) : 'No end'}</Typography>
                    <Chip size="small" label={label} color={color} />
                    <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                      <Button size="small" onClick={() => startEdit(ad)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => window.confirm('Delete this advertisement?') && remove(ad.id)}>Delete</Button>
                    </Stack>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
