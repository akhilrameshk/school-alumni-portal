'use client';
import { useState } from 'react';
import {
  Box, Typography, Stack, TextField, MenuItem, Button, Alert, Paper, Avatar, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import useCollection from './useCollection';
import ImageUpload from './ImageUpload';
import { cld } from '@/lib/format';

const BLANK = { name: '', role: '', parentId: '', order: '', imageUrl: '' };

export default function CommitteeAdmin() {
  const { items, loading, error, save, remove, reload } = useCollection('/api/admin/committee');
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const nameOf = (id) => items.find((m) => m.id === id)?.name || '';

  async function submit() {
    setMsg({ type: '', text: '' });
    try {
      await save(editId, { ...form, order: Number(form.order) || 0 });
      setMsg({ type: 'success', text: editId ? 'Member updated.' : 'Member added.' });
      setForm(BLANK); setEditId(null);
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  }
  async function seed() {
    const res = await fetch('/api/admin/committee/seed', { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    setMsg(res.ok ? { type: 'success', text: `${data.created} members created. Replace the names and add photos.` } : { type: 'error', text: data.error || 'Could not create' });
    reload();
  }
  const startEdit = (m) => { setEditId(m.id); setForm({ name: m.name, role: m.role, parentId: m.parentId || '', order: m.order ?? '', imageUrl: m.imageUrl || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <Box>
      <Typography variant="h4">Executive Committee</Typography>
      <Typography sx={{ opacity: 0.75, mb: 2 }}>These members appear in the tree on the Committee page. &ldquo;Reports to&rdquo; decides where a person sits in the tree: leave it empty for the President (top).</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '400px 1fr' }, gap: 3, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{editId ? 'Edit member' : 'Add member'}</Typography>
          <Stack spacing={2}>
            <TextField label="Name" value={form.name} onChange={set('name')} />
            <TextField label="Position" value={form.role} onChange={set('role')} placeholder="President, Secretary, Executive Member..." />
            <TextField select label="Reports to" value={form.parentId} onChange={set('parentId')} helperText="Empty = top of the tree">
              <MenuItem value="">(Nobody, top of the tree)</MenuItem>
              {items.filter((m) => m.id !== editId).map((m) => <MenuItem key={m.id} value={m.id}>{m.name} · {m.role}</MenuItem>)}
            </TextField>
            <TextField label="Order" type="number" value={form.order} onChange={set('order')} helperText="Smaller numbers come first among people at the same level" />
            <ImageUpload value={form.imageUrl} onChange={(u) => setForm({ ...form, imageUrl: u })} label="Upload photo" hint="Square photo works best" />
            {msg.text && <Alert severity={msg.type}>{msg.text}</Alert>}
            <Button variant="contained" onClick={submit}>{editId ? 'Save changes' : 'Add member'}</Button>
            {editId && <Button onClick={() => { setEditId(null); setForm(BLANK); }}>Cancel editing</Button>}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'auto' }}>
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && items.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ mb: 2 }}>No members yet. The public page shows placeholder cards until you add them.</Typography>
              <Button variant="outlined" onClick={seed}>Create the standard 11-member structure</Button>
            </Box>
          ) : (
            <Table>
              <TableHead><TableRow><TableCell>Member</TableCell><TableCell>Position</TableCell><TableCell>Reports to</TableCell><TableCell>Order</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
              <TableBody>
                {items.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={m.imageUrl ? cld(m.imageUrl, 100) : undefined} variant="rounded">{m.name.charAt(0)}</Avatar>
                        <b>{m.name}</b>
                      </Stack>
                    </TableCell>
                    <TableCell>{m.role}</TableCell>
                    <TableCell>{m.parentId ? nameOf(m.parentId) : '— (top)'}</TableCell>
                    <TableCell>{m.order}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => startEdit(m)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => window.confirm('Delete this member? Anyone reporting to them moves up one level.') && remove(m.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
