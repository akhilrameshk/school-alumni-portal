'use client';
import { useState } from 'react';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import PageHeader from './PageHeader';
import AdSlot from './AdSlot';
import SectionCard from './SectionCard';
import EventRow from './EventRow';
import EventDialog from './EventDialog';
import { dayParts, fmtDate } from '@/lib/format';

export default function EventsView({ upcoming, past, announcements }) {
  const [detail, setDetail] = useState(null);
  return (
    <Box>
      <PageHeader title="Events" subtitle="What is happening in our alumni family." />
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 5 } }}>
        <AdSlot page="events" n={1} bare />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr' }, gap: 3, alignItems: 'start', mt: 4.5 }}>
          <Box>
            {upcoming.length === 0 && <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}><Typography color="text.secondary">No upcoming events right now. Please check back soon.</Typography></Card>}
            {upcoming.map((e) => {
              const { day, mon } = dayParts(e.date);
              return (
                <Card key={e.id} variant="outlined" sx={{ p: 3, mb: 2, borderRadius: 5, bgcolor: 'rgba(255,255,255,.05)' }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: 'rgba(255,255,255,.08)', border: '1px solid', borderColor: 'divider', color: 'secondary.light', textAlign: 'center', pt: 0.9, lineHeight: 1 }}>
                      <Typography sx={{ fontFamily: 'var(--font-fraunces)', fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>{day}</Typography>
                      <Typography sx={{ fontSize: 12 }}>{mon}</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 220px' }}>
                      <Typography variant="h5">{e.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{[e.venue, e.time].filter(Boolean).join(' · ')}</Typography>
                      {e.description && <Typography sx={{ my: 1.25, color: 'text.secondary', lineHeight: 1.6 }}>{e.description.slice(0, 160)}{e.description.length > 160 ? '…' : ''}</Typography>}
                      <Button size="small" variant="contained" color="secondary" onClick={() => setDetail(e)} sx={{ mt: 1 }}>Details</Button>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
          <Box>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, p: 2.5, bgcolor: 'rgba(255,255,255,.04)', mb: 2.5 }}>
              <Typography variant="h6" sx={{ color: 'secondary.light', mb: 1 }}>Announcements</Typography>
              {announcements.length === 0 && <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>Nothing new at the moment.</Typography>}
              {announcements.map((a) => (
                <Box key={a.id} onClick={() => setDetail(a)} sx={{ cursor: 'pointer', py: 1.4, pl: 2.25, borderTop: '1px solid rgba(255,255,255,.1)', position: 'relative',
                  '&:before': { content: '""', position: 'absolute', left: 0, top: 22, width: 7, height: 7, borderRadius: '50%', bgcolor: 'secondary.main' } }}>
                  {a.title}
                  <Typography component="small" sx={{ display: 'block', color: 'text.secondary', fontSize: 12 }}>{fmtDate(a.date)}</Typography>
                </Box>
              ))}
            </Box>
            <AdSlot page="events" n={2} rect bare flush />
          </Box>
        </Box>
        <AdSlot page="events" n={3} bare />
        {past.length > 0 && (
          <SectionCard icon="cal" title="Past events">
            {past.map((e) => <EventRow key={e.id} e={e} onDetails={setDetail} />)}
          </SectionCard>
        )}
        <AdSlot page="events" n={4} bare />
      </Container>
      <EventDialog detail={detail} onClose={() => setDetail(null)} />
    </Box>
  );
}
