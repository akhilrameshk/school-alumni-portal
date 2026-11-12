'use client';
import { useMemo, useState } from 'react';
import { Box, Button, Container, Dialog, MenuItem, TextField, Typography } from '@mui/material';
import PageHeader from './PageHeader';
import AdSlot from './AdSlot';
import SectionCard from './SectionCard';
import Polaroid from './Polaroid';
import { Icon } from './Icons';
import { cld } from '@/lib/format';

export default function GalleryView({ photos }) {
  const [album, setAlbum] = useState('All');
  const [open, setOpen] = useState(null);
  const albums = useMemo(() => {
    const m = new Map();
    photos.forEach((p) => m.set(p.album || 'General', (m.get(p.album || 'General') || 0) + 1));
    return Array.from(m, ([name, count]) => ({ name, count }));
  }, [photos]);
  const shown = album === 'All' ? photos : photos.filter((p) => (p.album || 'General') === album);

  return (
    <Box>
      <PageHeader title="Gallery" subtitle="Moments from our reunions, batch meets and school events." />
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 5 } }}>
        <AdSlot page="gallery" n={1} bare />
        <SectionCard icon="img" title="Albums">
          {albums.length === 0 ? <Typography color="text.secondary">Albums will appear here soon.</Typography> : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2 }}>
              {albums.map((a, i) => {
                const on = album === a.name;
                return (
                  <Box key={a.name} onClick={() => setAlbum(on ? 'All' : a.name)} sx={{ cursor: 'pointer', aspectRatio: '1.05', borderRadius: 4, p: 1.75, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 1.25,
                    fontFamily: 'var(--font-fraunces)', fontWeight: 700, fontSize: 19, textAlign: 'center', border: '1px solid',
                    bgcolor: on || i % 2 === 0 ? '#cc9f12' : 'rgba(255,255,255,.07)', borderColor: on || i % 2 === 0 ? '#cc9f12' : 'divider', color: on || i % 2 === 0 ? '#2b2000' : 'secondary.light' }}>
                    <Icon name="img" />{a.name}<Typography component="span" sx={{ fontSize: 12, fontFamily: 'var(--font-work)', fontWeight: 500, opacity: 0.8 }}>{a.count} photos</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </SectionCard>
        <AdSlot page="gallery" n={2} bare />
        <SectionCard icon="img" title="Photos"
          action={
            <TextField select size="small" value={album} onChange={(e) => setAlbum(e.target.value)} sx={{ minWidth: 150 }}
              InputProps={{ startAdornment: <Box sx={{ mr: 1, display: 'flex', color: 'secondary.light' }}><Icon name="filter" size={18} /></Box>, sx: { borderRadius: 999 } }}>
              <MenuItem value="All">All albums</MenuItem>
              {albums.map((a) => <MenuItem key={a.name} value={a.name}>{a.name}</MenuItem>)}
            </TextField>
          }>
          {shown.length === 0 ? <Typography color="text.secondary">Photos will appear here soon.</Typography> : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: { xs: 2, md: 2.75 } }}>
              {shown.map((p, i) => <Box key={p.id} onClick={() => setOpen(p)} sx={{ cursor: 'pointer' }}><Polaroid photo={p} gold={false} i={i} /></Box>)}
            </Box>
          )}
        </SectionCard>
        <AdSlot page="gallery" n={3} bare />
        <AdSlot page="gallery" n={4} bare />
      </Container>
      <Dialog open={!!open} onClose={() => setOpen(null)} maxWidth="md" fullWidth>
        {open && (
          <Box>
            <Box component="img" src={cld(open.imageUrl, 1600)} alt={open.caption || ''} sx={{ width: '100%', display: 'block' }} />
            {open.caption && <Typography sx={{ p: 2 }}>{open.caption}</Typography>}
            <Box sx={{ px: 2, pb: 2 }}><Button onClick={() => setOpen(null)}>Close</Button></Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
