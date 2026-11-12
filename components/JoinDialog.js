'use client';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Stack,
  Checkbox, FormControlLabel, FormHelperText, Alert, Typography, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BATCHES, FEES } from '@/lib/config';
import { validateMember } from '@/lib/validate';
import { post, payWithRazorpay } from '@/lib/clientPay';

const EMPTY = { name: '', batch: '', mobile: '', email: '', location: '', profession: '', consent: false };

export default function JoinDialog({ open, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function close() {
    if (loading) return;
    onClose();
    if (done) { setForm(EMPTY); setDone(false); }
    setErrors({}); setMsg('');
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    const { errors: errs, ok } = validateMember(form);
    setErrors(errs);
    if (!ok) return;
    setLoading(true);
    try {
      const { memberId } = await post('/api/register', form);
      const order = await post('/api/payment/order', { memberId, purpose: 'registration' });
      await payWithRazorpay({
        order, description: 'Registration',
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        onSuccess: () => { setDone(true); setLoading(false); },
        onFailure: (m) => { setMsg(m); setLoading(false); },
        onDismiss: () => setLoading(false),
      });
    } catch (err) {
      setMsg(err.message);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={close} fullScreen={fullScreen} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 5 } }}>
      {done ? (
        <>
          <DialogTitle>Welcome to the association!</DialogTitle>
          <DialogContent><Typography>Your payment is received and your registration is complete. We will contact you on your mobile or email.</Typography></DialogContent>
          <DialogActions sx={{ p: 2 }}><Button variant="contained" onClick={close}>Close</Button></DialogActions>
        </>
      ) : (
        <form onSubmit={submit} noValidate>
          <DialogTitle>New registration</DialogTitle>
          <DialogContent>
            <Typography sx={{ opacity: 0.8, mb: 1.5 }}>Registration fee: <b>₹{FEES.registration}</b></Typography>
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              <TextField label="Full name" value={form.name} onChange={set('name')} error={!!errors.name} helperText={errors.name} />
              <TextField select label="Batch / year of passing" value={form.batch} onChange={set('batch')} error={!!errors.batch} helperText={errors.batch}>
                {BATCHES.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
              <TextField label="Mobile / WhatsApp number" value={form.mobile} onChange={set('mobile')} error={!!errors.mobile} helperText={errors.mobile} inputProps={{ inputMode: 'tel' }} />
              <TextField label="Email" type="email" value={form.email} onChange={set('email')} error={!!errors.email} helperText={errors.email} />
              <TextField label="Current location" value={form.location} onChange={set('location')} error={!!errors.location} helperText={errors.location} />
              <TextField label="Profession" value={form.profession} onChange={set('profession')} error={!!errors.profession} helperText={errors.profession} />
              <div>
                <FormControlLabel
                  control={<Checkbox checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />}
                  label="I agree to the association storing my details for alumni communication."
                />
                {errors.consent && <FormHelperText error>{errors.consent}</FormHelperText>}
              </div>
              {msg && <Alert severity="error">{msg}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={close} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Please wait...' : `Pay ₹${FEES.registration} and register`}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
