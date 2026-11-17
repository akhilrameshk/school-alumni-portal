'use client';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Stack,
  Checkbox, FormControlLabel, FormHelperText, Alert, Typography, Box, IconButton, Chip,
} from '@mui/material';
import { BATCHES, FEES, PROFESSIONS } from '@/lib/config';
import { validateMember } from '@/lib/validate';
import { post, payWithRazorpay } from '@/lib/clientPay';

const EMPTY = {
  name: '',
  batch: '',
  mobile: '',
  email: '',
  location: '',
  profession: '',
  professionOther: '',
  consent: false,
};

export default function JoinDialog({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function close() {
    if (loading) return;
    onClose();
    if (done) {
      setForm(EMPTY);
      setDone(false);
    }
    setErrors({});
    setMsg('');
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    const { errors: errs, ok } = validateMember(form, { strictProfession: true });
    setErrors(errs);
    if (!ok) return;
    setLoading(true);
    try {
      const { memberId } = await post('/api/register', form);
      const order = await post('/api/payment/order', { memberId, purpose: 'registration' });
      await payWithRazorpay({
        order,
        description: 'Registration',
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        onSuccess: () => {
          setDone(true);
          setLoading(false);
        },
        onFailure: (m) => {
          setMsg(m);
          setLoading(false);
        },
        onDismiss: () => setLoading(false),
      });
    } catch (err) {
      setMsg(err.message);
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-container': {
          alignItems: { xs: 'stretch', sm: 'center' },
        },
        '& .MuiDialog-paper': {
          m: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'calc(100% - 32px)' },
          maxWidth: { xs: '100%', sm: 580 },
          height: { xs: '100dvh', sm: 'auto' },
          maxHeight: { xs: '100dvh', sm: '90dvh' },
          borderRadius: { xs: 0, sm: 4 },
          bgcolor: '#0e2b1c',
          border: { xs: 'none', sm: '1px solid rgba(229, 184, 60, 0.35)' },
          backgroundImage: 'none',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
          overflowX: 'hidden',
        },
      }}
      PaperProps={
        done
          ? {}
          : {
              component: 'form',
              onSubmit: submit,
              noValidate: true,
              autoComplete: 'on',
            }
      }
    >
      {done ? (
        <>
          <DialogTitle sx={{ color: 'secondary.light', fontWeight: 700, pt: 3, px: 3 }}>
            Welcome to the association!
          </DialogTitle>
          <DialogContent sx={{ px: 3 }}>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Your payment is received and your registration is complete. We will contact you on your mobile or email.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button variant="contained" color="secondary" onClick={close} fullWidth>
              Close
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          {/* Header */}
          <DialogTitle
            sx={{
              px: { xs: 2, sm: 3.5 },
              pt: { xs: 2, sm: 3 },
              pb: 1.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: 19, sm: 23 } }}>
                  New Registration
                </Typography>
                <Chip
                  label={`Fee: ₹${FEES.registration}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(229, 184, 60, 0.16)',
                    color: 'secondary.light',
                    border: '1px solid rgba(229, 184, 60, 0.4)',
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                />
              </Stack>
              <Typography sx={{ color: 'text.secondary', fontSize: 12.5, mt: 0.5 }}>
                All fields are required · takes under a minute
              </Typography>
            </Box>

            <IconButton
              onClick={close}
              disabled={loading}
              size="small"
              aria-label="Close"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                bgcolor: 'rgba(255,255,255,0.06)',
                flexShrink: 0,
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' },
              }}
            >
              ✕
            </IconButton>
          </DialogTitle>

          {/* Form Fields */}
          <DialogContent
            sx={{
              px: { xs: 2, sm: 3.5 },
              py: 2,
              overflowX: 'hidden',
              '&::-webkit-scrollbar': { width: 5 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
            }}
          >
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              <TextField
                label="Full name"
                required
                fullWidth
                size="small"
                value={form.name}
                onChange={set('name')}
                error={!!errors.name}
                helperText={errors.name}
              />

              {/* 2-Column Row on Desktop, 1-Column on Mobile */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  select
                  label="Batch / year of passing"
                  required
                  fullWidth
                  size="small"
                  value={form.batch}
                  onChange={set('batch')}
                  error={!!errors.batch}
                  helperText={errors.batch}
                >
                  {BATCHES.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Mobile / WhatsApp number"
                  required
                  fullWidth
                  size="small"
                  value={form.mobile}
                  onChange={set('mobile')}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  inputProps={{ inputMode: 'tel' }}
                />
              </Box>

              {/* 2-Column Row on Desktop, 1-Column on Mobile */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Email"
                  required
                  fullWidth
                  size="small"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                />

                <TextField
                  label="Current location"
                  required
                  fullWidth
                  size="small"
                  value={form.location}
                  onChange={set('location')}
                  error={!!errors.location}
                  helperText={errors.location}
                />
              </Box>

              <TextField
                select
                label="Profession"
                required
                fullWidth
                size="small"
                value={form.profession}
                onChange={set('profession')}
                error={!!errors.profession}
                helperText={errors.profession}
              >
                {PROFESSIONS.map((j) => (
                  <MenuItem key={j} value={j}>
                    {j}
                  </MenuItem>
                ))}
              </TextField>

              {form.profession === 'Other' && (
                <TextField
                  label="Please tell us your profession"
                  required
                  fullWidth
                  size="small"
                  value={form.professionOther}
                  onChange={set('professionOther')}
                  error={!!errors.professionOther}
                  helperText={errors.professionOther}
                />
              )}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid',
                  borderColor: errors.consent ? 'error.main' : 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <FormControlLabel
                  sx={{ m: 0, alignItems: 'flex-start' }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{ p: 0.5, mr: 1, mt: -0.25 }}
                      checked={form.consent}
                      onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.45 }}>
                      I agree to the association storing my details for alumni communication.
                    </Typography>
                  }
                />
                {errors.consent && <FormHelperText error sx={{ ml: 3.5 }}>{errors.consent}</FormHelperText>}
              </Box>

              {msg && <Alert severity="error" sx={{ borderRadius: 2 }}>{msg}</Alert>}
            </Stack>
          </DialogContent>

          {/* Sticky Footer Actions */}
          <DialogActions
            sx={{
              px: { xs: 2, sm: 3.5 },
              py: 1.75,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              bgcolor: 'rgba(0, 0, 0, 0.22)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Button
              onClick={close}
              disabled={loading}
              sx={{ color: 'text.secondary', minWidth: 'auto', px: 1.5 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{
                fontWeight: 700,
                px: { xs: 2, sm: 3 },
                fontSize: { xs: 13.5, sm: 15 },
                borderRadius: 2.5,
                flex: { xs: 1, sm: 'initial' },
              }}
            >
              {loading ? 'Please wait...' : `Pay ₹${FEES.registration} & Register`}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}