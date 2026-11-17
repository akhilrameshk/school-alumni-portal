'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import Scene from './Scene';
import Countdown from './Countdown';
import AdSlot, { SubtleGoogleAd } from './AdSlot';
import SectionCard from './SectionCard';
import EventRow from './EventRow';
import EventDialog from './EventDialog';
import Polaroid from './Polaroid';
import { useDialogs } from './Dialogs';
import { BATCHES, FEES } from '@/lib/config';
import { fmtDate } from '@/lib/format';

export default function HomeView({ events = [], announcements = [], photos = [] }) {
  const { openJoin, openRenew } = useDialogs();
  const [detail, setDetail] = useState(null);
  const next = events[0];

  const half = {
    textAlign: 'center',
    px: { xs: 1.5, md: 3 },
    py: { xs: 1.5, md: 1 },
  };
  const hh = { color: 'secondary.light', fontSize: { xs: 20, md: 23 }, mb: 0.75 };

  return (
    <Box sx={{ overflowX: 'hidden', width: '100%' }}>
     {/* Hero Section - Rich, Balanced & Mobile-Optimized */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 420, sm: 500, md: 620 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          textAlign: 'center',
          px: { xs: 2.5, md: 3 },
          pt: { xs: 5, sm: 7, md: 9 },
          pb: { xs: 14, sm: 18, md: 22 }, // താഴത്തെ <Scene /> ചിത്രത്തിന് കൃത്യമായ സ്ഥലം നൽകാൻ
          background:
            'radial-gradient(circle at 50% 0%, rgba(229, 184, 60, 0.28) 0%, rgba(20, 59, 37, 0.95) 55%, #0a2015 100%)',
          borderBottom: '1px solid rgba(229, 184, 60, 0.2)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 820, mx: 'auto' }}>
          {/* Top Pill Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              border: '1px solid rgba(229, 184, 60, 0.45)',
              bgcolor: 'rgba(10, 32, 21, 0.65)',
              backdropFilter: 'blur(8px)',
              borderRadius: 999,
              px: { xs: 2, md: 2.5 },
              py: 0.65,
              mb: { xs: 2, md: 2.5 },
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main' }} />
            <Typography
              sx={{
                fontWeight: 600,
                letterSpacing: '.08em',
                fontSize: { xs: 11, md: 13 },
                color: 'secondary.light',
              }}
            >
              സമന്വയം · SDV HSS ALUMNI
            </Typography>
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 36, sm: 52, md: 72 },
              fontWeight: 800,
              lineHeight: 1.08,
              color: '#ffffff',
              textShadow: '0 4px 24px rgba(0,0,0,.45)',
            }}
          >
            Where old friends
            <br />
            meet{' '}
            <Box
              component="span"
              sx={{
                color: 'secondary.light',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              again
            </Box>
            .
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              mt: { xs: 1.75, md: 2.25 },
              fontSize: { xs: 14.5, sm: 17, md: 19 },
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Same school. Same bench. Same old gang.{' '}
            <Box component="span" sx={{ color: 'secondary.light', fontWeight: 600 }}>
              {BATCHES.length} batches
            </Box>{' '}
            and counting, one family.
          </Typography>

          {/* Quick Action Buttons inside Hero */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: { xs: 3, md: 3.5 } }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={openJoin}
              sx={{
                fontWeight: 700,
                px: 3.5,
                py: 1.2,
                borderRadius: 999,
                width: { xs: '100%', sm: 'auto' },
                maxWidth: 260,
                boxShadow: '0 8px 20px rgba(229, 184, 60, 0.25)',
              }}
            >
              Join the Alumni
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/gallery"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.35)',
                px: 3,
                py: 1.2,
                borderRadius: 999,
                width: { xs: '100%', sm: 'auto' },
                maxWidth: 260,
                '&:hover': {
                  borderColor: 'secondary.light',
                  bgcolor: 'rgba(255,255,255,0.06)',
                },
              }}
            >
              View Memories
            </Button>
          </Stack>
        </Box>

        <Scene />
      </Box>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 6 }}>
        {/* Next Meet Countdown - Responsive Overlap */}
        {next && (
          <Box
            sx={{
              position: 'relative',
              zIndex: 6,
              mt: { xs: -3, md: -6 },
              mx: 'auto',
              maxWidth: 520,
              border: '1.5px solid',
              borderColor: 'secondary.main',
              borderRadius: 4,
              bgcolor: 'rgba(14,43,28,.98)',
              px: { xs: 2, md: 3 },
              py: 2,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}
          >
            <Typography sx={{ color: 'secondary.light', fontSize: { xs: 15, md: 17 }, mb: 1.25 }}>
              Next meet · {next.title}
            </Typography>
            <Countdown date={next.date} />
          </Box>
        )}

        {/* Register / Renew Section */}
        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            bgcolor: 'rgba(255,255,255,.04)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 4,
            p: { xs: 2.5, md: 3.5 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1px 1fr' },
            alignItems: 'center',
            gap: { xs: 2.5, md: 0 },
          }}
        >
          <Box sx={half}>
            <Typography variant="h5" sx={hh}>
              New Registration
            </Typography>
            <Typography sx={{ mb: 1.75, color: 'text.secondary', fontSize: 14 }}>
              ₹{FEES.registration} · takes under a minute
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={openJoin}
              fullWidth
              sx={{ maxWidth: 220 }}
            >
              Register Now
            </Button>
          </Box>

          <Box
            sx={{
              bgcolor: 'divider',
              height: { xs: '1px', md: 90 },
              width: { xs: '85%', md: '1px' },
              mx: 'auto',
            }}
          />

          <Box sx={half}>
            <Typography variant="h5" sx={hh}>
              Renew Membership
            </Typography>
            <Typography sx={{ mb: 1.75, color: 'text.secondary', fontSize: 14 }}>
              Already a member? Renew in a few taps.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={openRenew}
              fullWidth
              sx={{ maxWidth: 220 }}
            >
              Renew now
            </Button>
          </Box>
        </Box>

        {/* ചെറിയ ഗൂഗിൾ ആഡ് 1 (Subtle) */}
        <SubtleGoogleAd />

        {/* ലോക്കൽ ആഡ് 1 (15s Rotation - Spot 1) */}
        <AdSlot page="home" n={1} bare />

        {/* Events & Announcements - Clean 2-Column Grid */}
        <SectionCard icon="bell" title="Events & Announcements" sx={{ scrollMarginTop: '80px' }}>
          <Box
            id="events"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
              gap: { xs: 2.5, md: 3 },
              alignItems: 'start',
            }}
          >
            <Box>
              {events.length === 0 && (
                <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
                  No upcoming events right now. Please check back soon.
                </Typography>
              )}
              {events.map((e) => (
                <EventRow key={e.id} e={e} onDetails={setDetail} />
              ))}
            </Box>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },
                bgcolor: 'rgba(255,255,255,.03)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'secondary.light', mb: 1, fontSize: 18 }}>
                Announcements
              </Typography>
              {announcements.length === 0 && (
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Nothing new at the moment.
                </Typography>
              )}
              {announcements.map((a) => (
                <Box
                  key={a.id}
                  onClick={() => setDetail(a)}
                  sx={{
                    cursor: 'pointer',
                    py: 1.25,
                    pl: 2,
                    borderTop: '1px solid rgba(255,255,255,.1)',
                    position: 'relative',
                    fontSize: 14.5,
                    '&:hover': { color: 'secondary.light' },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 20,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                    },
                  }}
                >
                  {a.title}
                  <Typography
                    component="small"
                    sx={{ display: 'block', color: 'text.secondary', fontSize: 12, mt: 0.25 }}
                  >
                    {fmtDate(a.date)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </SectionCard>

        {/* ചെറിയ ഗൂഗിൾ ആഡ് 2 (Subtle) */}
        <SubtleGoogleAd />

        {/* ലോക്കൽ ആഡ് 2 (15s Rotation - Spot 2) */}
        <AdSlot page="home" n={2} bare />

        {/* Photo Gallery */}
        <SectionCard
          icon="img"
          title="Photo Gallery"
          action={
            <Button size="small" variant="contained" color="secondary" component={Link} href="/gallery">
              Open the gallery
            </Button>
          }
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 1.5, sm: 2, md: 2.5 },
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <Polaroid
                key={i}
                photo={photos[i]}
                caption={
                  photos[i] ? undefined : ['Reunion 2025', 'Batch 2004', 'Annual day', 'Get-together'][i]
                }
                i={i}
              />
            ))}
          </Box>
        </SectionCard>

        {/* ചെറിയ ഗൂഗിൾ ആഡ് 3 (Subtle) */}
        <SubtleGoogleAd />

        {/* ലോക്കൽ ആഡ് 3 (15s Rotation - Spot 3) */}
        <AdSlot page="home" n={3} bare />

        {/* Footer CTA */}
        <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 7 } }}>
          <Typography
            variant="h3"
            sx={{ color: 'secondary.light', fontSize: { xs: 26, md: 36 }, mb: 2 }}
          >
            Join the family
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" color="primary" size="large" onClick={openJoin}>
              Register
            </Button>
            <Button variant="outlined" color="secondary" size="large" onClick={openRenew}>
              Renew
            </Button>
          </Stack>
        </Box>
      </Container>

      <EventDialog detail={detail} onClose={() => setDetail(null)} />
    </Box>
  );
}