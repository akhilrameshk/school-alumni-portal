'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import Scene from './Scene';
import Countdown from './Countdown';
import AdSlot from './AdSlot';
import SectionCard from './SectionCard';
import EventRow from './EventRow';
import EventDialog from './EventDialog';
import Polaroid from './Polaroid';
import { useDialogs } from './Dialogs';
import { BATCHES, FEES } from '@/lib/config';
import { fmtDate } from '@/lib/format';

export default function HomeView({ events, announcements, photos }) {
  const { openJoin, openRenew } = useDialogs();
  const [detail, setDetail] = useState(null);
  const next = events[0];
  const half = { textAlign: 'center', px: 2.5, py: 1 };
  const hh = { color: 'secondary.light', fontSize: 23, mb: 0.75 };

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: { xs: 560, md: 690 }, textAlign: 'center', px: 3, pt: { xs: 8, md: 11.5 },
        background: 'linear-gradient(135deg,#e5b83c 0%,#a39a30 13%,#2f6f3c 36%,#143b25 58%,#0b2216 100%)' }}>
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 900, mx: 'auto' }}>
          <Typography sx={{ display: 'inline-block', border: '1px solid rgba(255,255,255,.4)', bgcolor: 'rgba(255,255,255,.1)', borderRadius: 999, px: 2.5, py: 0.9, fontWeight: 600, letterSpacing: '.08em', fontSize: { xs: 12, md: 14 }, mb: 2.5 }}>
            സമന്വയം · SDV HSS ALUMNI
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 78 }, lineHeight: 1.04, textShadow: '0 4px 24px rgba(0,0,0,.35)' }}>
            Where old friends<br />meet <Box component="span" sx={{ color: 'secondary.light' }}>again</Box>.
          </Typography>
          <Typography sx={{ mt: 2.25, fontSize: { xs: 17, md: 21 }, maxWidth: 640, mx: 'auto', lineHeight: 1.55 }}>
            Same school. Same bench. Same old gang. {BATCHES.length} batches and counting, one family.
          </Typography>
        </Box>
        <Scene />
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 5 } }}>
        {next && (
          <Box sx={{ position: 'relative', zIndex: 6, mt: { xs: 2.5, md: -8 }, mx: 'auto', maxWidth: 540, border: '1.5px solid', borderColor: 'secondary.main', borderRadius: 5.5, bgcolor: 'rgba(14,43,28,.96)', px: 3, pt: 2, pb: 2.25, textAlign: 'center' }}>
            <Typography sx={{ color: 'secondary.light', fontSize: 17, mb: 1.25 }}>Next meet · {next.title}</Typography>
            <Countdown date={next.date} />
          </Box>
        )}

        {/* Register / Renew */}
        <Box sx={{ mt: 4, bgcolor: 'rgba(255,255,255,.05)', border: '1px solid', borderColor: 'divider', borderRadius: 5.5, p: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1px 1fr' }, alignItems: 'center', gap: { xs: 3, md: 0 } }}>
          <Box sx={half}>
            <Typography variant="h5" sx={hh}>New Registration</Typography>
            <Typography sx={{ mb: 1.75, color: 'text.secondary', fontSize: 14 }}>₹{FEES.registration} · takes under a minute</Typography>
            <Button variant="contained" color="primary" size="large" onClick={openJoin}>Register Now</Button>
          </Box>
          <Box sx={{ bgcolor: 'divider', height: { xs: 1, md: 90 }, width: { xs: '80%', md: 1 }, mx: 'auto' }} />
          <Box sx={half}>
            <Typography variant="h5" sx={hh}>Renew Membership</Typography>
            <Typography sx={{ mb: 1.75, color: 'text.secondary', fontSize: 14 }}>Already a member? Renew in a few taps.</Typography>
            <Button variant="contained" color="secondary" size="large" onClick={openRenew}>Renew now</Button>
          </Box>
        </Box>

        <AdSlot page="home" n={1} bare />

        {/* Events & announcements */}
        <SectionCard icon="bell" title="Events & Announcements" sx={{ scrollMarginTop: '80px' }}>
          <Box id="events" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1.45fr 1fr 290px' }, gap: 2.5, alignItems: 'start' }}>
            <Box>
              {events.length === 0 && <Typography sx={{ color: 'text.secondary' }}>No upcoming events right now. Please check back soon.</Typography>}
              {events.map((e) => <EventRow key={e.id} e={e} onDetails={setDetail} />)}
            </Box>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, p: 2.5, bgcolor: 'rgba(255,255,255,.03)' }}>
              <Typography variant="h6" sx={{ color: 'secondary.light', mb: 1 }}>Announcements</Typography>
              {announcements.length === 0 && <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>Nothing new at the moment.</Typography>}
              {announcements.map((a) => (
                <Box key={a.id} onClick={() => setDetail(a)} sx={{ cursor: 'pointer', py: 1.4, pl: 2.25, borderTop: '1px solid rgba(255,255,255,.1)', position: 'relative', fontSize: 15,
                  '&:before': { content: '""', position: 'absolute', left: 0, top: 22, width: 7, height: 7, borderRadius: '50%', bgcolor: 'secondary.main' } }}>
                  {a.title}
                  <Typography component="small" sx={{ display: 'block', color: 'text.secondary', fontSize: 12, mt: 0.25 }}>{fmtDate(a.date)}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ gridColumn: { md: '1 / -1', lg: 'auto' }, '&:empty': { display: 'none' } }}>
              <AdSlot page="home" n={2} rect bare flush />
            </Box>
          </Box>
        </SectionCard>

        <AdSlot page="home" n={3} bare />

        {/* Gallery */}
        <SectionCard icon="img" title="Photo Gallery" action={<Button size="small" variant="contained" color="secondary" component={Link} href="/gallery">Open the gallery</Button>}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: { xs: 2, md: 2.75 } }}>
            {[0, 1, 2, 3].map((i) => <Polaroid key={i} photo={photos[i]} caption={photos[i] ? undefined : ['Reunion 2025', 'Batch 2004', 'Annual day', 'Get-together'][i]} i={i} />)}
          </Box>
        </SectionCard>

        <AdSlot page="home" n={4} bare />

        <Box sx={{ textAlign: 'center', mt: 7.5 }}>
          <Typography variant="h3" sx={{ color: 'secondary.light', fontSize: { xs: 28, md: 38 }, mb: 2.25 }}>Join the family</Typography>
          <Stack direction="row" spacing={1.5} justifyContent="center">
            <Button variant="contained" color="primary" size="large" onClick={openJoin}>Register</Button>
            <Button variant="outlined" color="secondary" size="large" onClick={openRenew}>Renew</Button>
          </Stack>
        </Box>
      </Container>
      <EventDialog detail={detail} onClose={() => setDetail(null)} />
    </Box>
  );
}
