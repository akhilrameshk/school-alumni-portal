'use client';
import { Box, Typography } from '@mui/material';
import { Icon } from './Icons';

// Rounded dark card with a round icon badge on its top edge (like the design).
export default function SectionCard({ icon, title, action, children, sx }) {
  return (
    <Box sx={{ position: 'relative', bgcolor: 'rgba(255,255,255,.05)', border: '1px solid', borderColor: 'divider', borderRadius: 5.5, mt: 7, p: { xs: '34px 16px 20px', md: '34px 28px 28px' }, ...sx }}>
      <Box sx={{ position: 'absolute', left: '50%', top: -23, ml: '-23px', width: 46, height: 46, borderRadius: '50%', bgcolor: '#173f29', border: '1px solid', borderColor: 'divider', color: 'secondary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 30 }, '&:before': { content: '""', display: 'block', width: 40, height: 3, bgcolor: 'secondary.main', mb: 1.75 } }}>{title}</Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}
