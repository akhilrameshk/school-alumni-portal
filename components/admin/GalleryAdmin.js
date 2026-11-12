'use client';
import { useState } from 'react';
import {
  Box, Typography, Stack, TextField, Button, Alert, Paper, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Chip,
} from '@mui/material';
import useCollection from './useCollection';
import { uploadImage } from '@/lib/uploadClient';

const DEFAULT_ALBUMS = ['Reunion', 'Batch meets', 'School events', 'Community'];

export default function GalleryAdmin() {
  const { items, error, save, remove } = useCollection('/api/admin/photos');
  const [album, setAlbum] = useState('Reunion');
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [edit, setEdit] = useState(null);
  const albums = Array.from(new Set([...DEFAULT_ALBUMS, ...items.map((p) => p.album)]));

  async function upload() {
    if (!files.length) return setMsg({ type: 'error', text: 'Choose at least one photo.' });
    setBusy(true); setMsg({ type: '', text: '' });
    let ok = 0;
    try {
      for (const f of files) {
        const imageUrl = await uploadImage(f);
        await save(null, { imageUrl, album: album || 'General', caption });
        ok++;
      }
      setFiles([]); setCaption('');
      setMsg({ type: 'success', text: `${ok} photo${ok > 1 ? 's' : ''} uploaded.` });
    } catch (err) { setMsg({ type: 'error', text: `${err.message} (${ok} uploaded before the problem)` }); }
    setBusy(false);
  }

  return (
    <Box>
      <Typography variant="h4">Gallery</Typography>
      <Typography sx={{ opacity: 0.75, mb: 2 }}>Add photos to the public gallery page.</Typography>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, border: '2px dashed #9ab89f', bgcolor: '#eef6f0', mb: 3 }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h6">{files.length ? `${files.length} photo(s) selected` : 'Choose photos to upload'}</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ width: '100%', maxWidth: 760 }}>
            <Autocomplete freeSolo options={albums} value={album} onInputChange={(_, v) => setAlbum(v)} sx={{ flex: 1 }} renderInput={(p) => <TextField {...p} label="Album" size="small" />} />
            <TextField size="small" label="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} sx={{ flex: 1 }} />
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button component="label" variant="outlined">Choose photos<input hidden multiple type="file" accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} /></Button>
            <Button variant="contained" onClick={upload} disabled={busy}>{busy ? 'Uploading...' : 'Upload'}</Button>
          </Stack>
          {msg.text && <Alert severity={msg.type}>{msg.text}</Alert>}
        </Stack>
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 2 }}>
        {items.map((p) => (
          <Paper key={p.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box component="img" src={p.imageUrl} alt="" sx={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
            <Box sx={{ p: 1.5 }}>
              <Typography fontWeight={700} noWrap>{p.caption || 'No caption'}</Typography>
              <Chip size="small" label={p.album} sx={{ my: 0.75 }} />
              <Stack direction="row" justifyContent="space-between">
                <Button size="small" onClick={() => setEdit({ ...p })}>Edit</Button>
                <Button size="small" color="error" onClick={() => window.confirm('Delete this photo?') && remove(p.id)}>Delete</Button>
              </Stack>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth maxWidth="xs">
        {edit && (
          <>
            <DialogTitle>Edit photo</DialogTitle>
            <DialogContent>
              <Box component="img" src={edit.imageUrl} alt="" sx={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 3, my: 1.5 }} />
              <Stack spacing={2}>
                <TextField label="Caption" value={edit.caption || ''} onChange={(e) => setEdit({ ...edit, caption: e.target.value })} />
                <Autocomplete freeSolo options={albums} value={edit.album} onInputChange={(_, v) => setEdit({ ...edit, album: v })} renderInput={(p) => <TextField {...p} label="Album" />} />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setEdit(null)}>Cancel</Button>
              <Button variant="contained" onClick={async () => { await save(edit.id, { caption: edit.caption, album: edit.album }); setEdit(null); }}>Save changes</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
