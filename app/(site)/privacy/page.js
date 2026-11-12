'use client';
import { Container, Typography } from '@mui/material';
import PageHeader from '@/components/PageHeader';
import { SITE } from '@/lib/config';

const sections = [
  ['What we collect', 'When you register or renew we store your name, batch, mobile / WhatsApp number, email, current location and profession, and a record of your payments (amount, date and Razorpay payment id). We never see or store your card, UPI or bank details; payments are handled by Razorpay.'],
  ['Why we collect it', 'To keep the alumni directory, contact members about reunions and events, and issue renewals. Member details are visible only to the association admins and are never shown on the public website.'],
  ['Advertisements and cookies', 'This website may show advertisements from Google AdSense and from local sponsors. Google and its partners may use cookies to show ads based on your visits to this and other websites. You can manage ad personalisation at adssettings.google.com. Visitors from the European Economic Area and the UK will be asked for consent.'],
  ['Your choices', `You can ask us to correct or delete your details at any time by writing to ${SITE.email}.`],
  ['Contact', `${SITE.name}, ${SITE.address}. ${SITE.phone}.`],
];

export default function Page() {
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="How the association uses your information." />
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        {sections.map(([t, d]) => (
          <div key={t}>
            <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>{t}</Typography>
            <Typography sx={{ lineHeight: 1.8 }}>{d}</Typography>
          </div>
        ))}
        <Typography sx={{ mt: 4, fontSize: 13, opacity: 0.6 }}>This is a general template, not legal advice. Please have it reviewed before launch.</Typography>
      </Container>
    </>
  );
}
