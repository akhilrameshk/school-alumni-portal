'use client';
import { Box, Card, Container, Typography } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import AdSlot from '@/components/AdSlot';
import { IconBox } from '@/components/Icons';
import { BATCHES, FIRST_BATCH } from '@/lib/config';

const what = [
  ['users', 'Reunions', 'Annual gatherings for every batch.'],
  ['cal', 'Batch connect', 'Reconnecting classmates across cities and countries.'],
  ['bell', 'Support', 'Guidance and help for fellow alumni.'],
  ['star', 'Give back', 'Serving the school that shaped us.'],
];
const card = { bgcolor: 'rgba(255,255,255,.05)', borderRadius: 5.5, p: 3.5 };

export default function Page() {
  return (
    <>
      <PageHeader title="About Us" subtitle="The story of the SDV HSS Alumni Association and what we do together." />
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 5 } }}>
        <AdSlot page="about" n={1} bare />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'center', mt: 4.5 }}>
          <Card variant="outlined" sx={card}>
            <Typography variant="h4" sx={{ fontSize: 30, mb: 2 }}>Our story</Typography>
            <Typography sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              The SDV HSS Alumni Association brings together every batch that has passed through the school. Samanvayam means harmony, and that is the idea: old classmates, seniors and juniors under one roof.
            </Typography>
            <Typography sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              From {FIRST_BATCH} until today, {BATCHES.length} batches have walked out of the school gates, and the family keeps growing every year.
            </Typography>
          </Card>
          <Card variant="outlined" sx={{ ...card, p: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1 }}>
              {BATCHES.map((y) => (
                <Box key={y} sx={{ aspectRatio: '1', borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: { xs: 10, md: 13 }, bgcolor: y % 5 === 0 ? 'secondary.main' : '#1f6b3a', color: y % 5 === 0 ? '#1b1606' : '#fff' }}>{y}</Box>
              ))}
              <Box sx={{ gridColumn: 'span 2', bgcolor: '#fff', color: '#0f2f1c', borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: { xs: 10, md: 12 }, fontWeight: 700, lineHeight: 1.2, p: 0.5 }}>
                {BATCHES.length} Batches<br />& counting
              </Box>
            </Box>
          </Card>
        </Box>
        <AdSlot page="about" n={2} bare />
        <Typography variant="h4" sx={{ fontSize: 32, mt: 7, mb: 2.5 }}>What we do</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2.25 }}>
          {what.map(([i, t, d]) => (
            <Card key={t} variant="outlined" sx={card}>
              <IconBox name={i} />
              <Typography variant="h6" sx={{ color: 'secondary.light', mt: 1.5, mb: 0.75 }}>{t}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{d}</Typography>
            </Card>
          ))}
        </Box>
        <AdSlot page="about" n={3} bare />
        <AdSlot page="about" n={4} bare />
      </Container>
    </>
  );
}
