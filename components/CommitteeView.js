'use client';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import PageHeader from './PageHeader';
import CommitteeTree from './CommitteeTree';
import AdSlot from './AdSlot';

export default function CommitteeView({ root }) {
  return (
    <>
      <PageHeader title="Meet your committee" subtitle="Eleven friends who volunteer to keep the whole family together." />
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 5 } }}>
        <AdSlot page="committee" n={1} bare />
        <CommitteeTree root={root} />
        <AdSlot page="committee" n={2} bare />
        <Box sx={{ mt: 7, border: '1px solid', borderColor: 'divider', borderRadius: 5, p: { xs: 3, md: 4 }, bgcolor: 'rgba(255,255,255,.05)', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'secondary.light' }}>Have a question?</Typography>
            <Typography color="text.secondary">Write to the committee and we will get back to you.</Typography>
          </Box>
          <Button variant="contained" color="secondary" size="large" component={Link} href="/contact">Contact now</Button>
        </Box>
      </Container>
    </>
  );
}
