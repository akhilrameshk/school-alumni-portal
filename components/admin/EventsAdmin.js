'use client';
import { useState } from 'react';
import {
  Box, Typography, Stack, TextField, MenuItem, Button, Chip, Alert, Paper, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import useCollection from './useCollection';
import ImageUpload from './ImageUpload';
import { dateInput, fmtDate } from '@/lib/format';

const BLANK = { type: 'event', title: '', date: '', time: '', venue: '', description: '', imageUrl: '', status: 'published' };

export default function EventsAdmin() {
  const { items, loading, error, save, remove } = useCollection('/api/admin/events');
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(status) {
    setMsg({ type: '', text: '' });
    try {
      await save(editId, { ...form, status });
      setMsg({ type: 'success', text: status === 'draft' ? 'Saved as draft.' : 'Published.' });
      setForm(BLANK); setEditId(null);
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  }
  const startEdit = (it) => { setEditId(it.id); setForm({ ...BLANK, ...it, date: dateInput(it.date), imageUrl: it.imageUrl || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <Box>
      <Typography variant="h4">Events &amp; Announcements</Typography>
      <Typography sx={{ opacity: 0.75, mb: 2 }}>What you add here appears on the home page.</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '400px 1fr' }, gap: 3, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{editId ? 'Edit' : 'Add new'}</Typography>
          <Stack spacing={2}>
            <TextField select label="Type" value={form.type} onChange={set('type')}>
              <MenuItem value="event">Event</MenuItem><MenuItem value="announcement">Announcement</MenuItem>
            </TextField>
            <TextField label="Title" value={form.title} onChange={set('title')} />
            <Stack direction="row" spacing={1.5}>
              <TextField label="Date" type="date" value={form.date} onChange={set('date')} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Time" value={form.time} onChange={set('time')} placeholder="10:00 AM" fullWidth />
            </Stack>
            <TextField label="Venue" value={form.venue} onChange={set('venue')} />
            <TextField label="Description" value={form.description} onChange={set('description')} multiline minRows={3} />
            <ImageUpload value={form.imageUrl} onChange={(u) => setForm({ ...form, imageUrl: u })} label="Add an image (optional)" />
            {msg.text && <Alert severity={msg.type}>{msg.text}</Alert>}
            <Stack direction="row" spacing={1.5}>
              <Button variant="contained" fullWidth onClick={() => submit('published')}>Publish</Button>
              <Button variant="outlined" fullWidth onClick={() => submit('draft')}>Save draft</Button>
            </Stack>
            {editId && <Button onClick={() => { setEditId(null); setForm(BLANK); }}>Cancel editing</Button>}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'auto' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Table>
            <TableHead><TableRow><TableCell>Title</TableCell><TableCell>Type</TableCell><TableCell>Date</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
            <TableBody>
              {!loading && items.length === 0 && <TableRow><TableCell colSpan={5}>Nothing added yet.</TableCell></TableRow>}
              {items.map((it) => (
                <TableRow key={it.id} hover>
                  <TableCell><b>{it.title}</b></TableCell>
                  <TableCell><Chip size="small" label={it.type === 'event' ? 'Event' : 'Announcement'} color={it.type === 'event' ? 'success' : 'warning'} /></TableCell>
                  <TableCell>{fmtDate(it.date)}</TableCell>
                  <TableCell><Chip size="small" variant="outlined" label={it.status === 'published' ? 'Published' : 'Draft'} /></TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => startEdit(it)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => window.confirm('Delete this item?') && remove(it.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
