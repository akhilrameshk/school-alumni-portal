'use client';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { fmtDate, cld } from '@/lib/format';

export default function EventDialog({ detail, onClose }) {
  return (
    <Dialog open={!!detail} onClose={onClose} fullWidth maxWidth="sm">
      {detail && (
        <>
          <DialogTitle>{detail.title}</DialogTitle>
          <DialogContent>
            <Typography sx={{ opacity: 0.7, mb: 1.5 }}>{fmtDate(detail.date)}{detail.time ? ` · ${detail.time}` : ''}{detail.venue ? ` · ${detail.venue}` : ''}</Typography>
            {detail.imageUrl && <Box component="img" src={cld(detail.imageUrl, 900)} alt="" sx={{ width: '100%', borderRadius: 3, mb: 2 }} />}
            <Typography sx={{ whiteSpace: 'pre-line' }}>{detail.description || 'More details will be shared soon.'}</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Close</Button></DialogActions>
        </>
      )}
    </Dialog>
  );
}
