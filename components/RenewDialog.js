'use client';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Alert, Typography, Box, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { post, payWithRazorpay } from '@/lib/clientPay';
import { fmtDate } from '@/lib/format';
import { MEMBERSHIP_DAYS } from '@/lib/config';

export default function RenewDialog({ open, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [identifier, setIdentifier] = useState('');
  const [found, setFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  function close() {
    if (loading) return;
    onClose();
    setIdentifier(''); setFound(null); setMsg(''); setDone(false);
  }

  async function lookup(e) {
    e.preventDefault();
    setMsg(''); setLoading(true);
    try { setFound(await post('/api/renew/lookup', { identifier })); }
    catch (err) { setMsg(err.message); }
    setLoading(false);
  }

  async function pay() {
    setMsg(''); setLoading(true);
    try {
      const order = await post('/api/payment/order', { memberId: found.memberId, purpose: 'renewal' });
      await payWithRazorpay({
        order, description: 'Membership renewal', prefill: {},
        onSuccess: () => { setDone(true); setLoading(false); },
        onFailure: (m) => { setMsg(m); setLoading(false); },
        onDismiss: () => setLoading(false),
      });
    } catch (err) { setMsg(err.message); setLoading(false); }
  }

  return (
    <Dialog open={open} onClose={close} fullScreen={fullScreen} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 5 } }}>
      <DialogTitle>Renew membership</DialogTitle>
      <DialogContent>
        {done ? (
          <Typography>Thank you! Your membership has been renewed.</Typography>
        ) : (
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Typography sx={{ opacity: 0.75 }}>Enter the mobile number or email you registered with.</Typography>
            <Box component="form" onSubmit={lookup}>
              <Stack spacing={1.5}>
                <TextField label="Mobile number or email" value={identifier} onChange={(e) => { setIdentifier(e.target.value); setFound(null); }} />
                {!found && <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Searching...' : 'Find my membership'}</Button>}
              </Stack>
            </Box>
            {found && (
              <Box sx={{ bgcolor: 'rgba(224,180,62,.12)', border: '1px solid', borderColor: 'secondary.main', borderRadius: 3, p: 2, lineHeight: 1.7 }}>
                <b>{found.displayName}</b> · Batch {found.batch}
                <br />Last paid: {fmtDate(found.lastPaidAt)}
                <br />Subscription:{' '}
                {found.validUntil
                  ? (found.daysLeft > 0
                    ? <b style={{ color: '#f3cd62' }}>{found.daysLeft} days left (valid until {fmtDate(found.validUntil)})</b>
                    : <b style={{ color: '#ff9a8a' }}>Expired {Math.abs(found.daysLeft)} days ago ({fmtDate(found.validUntil)})</b>)
                  : 'not started yet'}
              </Box>
            )}
            {msg && <Alert severity="error">{msg}</Alert>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={close} disabled={loading}>{done ? 'Close' : 'Cancel'}</Button>
        {found && !done && <Button variant="contained" color="secondary" size="large" onClick={pay} disabled={loading}>{loading ? 'Please wait...' : `Renew for ${MEMBERSHIP_DAYS === 365 ? '1 year' : `${MEMBERSHIP_DAYS} days`} · pay ₹${found.fee}`}</Button>}
      </DialogActions>
    </Dialog>
  );
}
