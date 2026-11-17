'use client';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, MenuItem, Button, Alert, Autocomplete } from '@mui/material';
import { BATCHES, PROFESSIONS } from '@/lib/config';
import { dateInput } from '@/lib/format';

const BLANK = { name: '', batch: '', mobile: '', email: '', location: '', profession: '', status: 'approved', paymentStatus: 'pending', offlineAmount: '' };

// Used for both "Add member" (member = null) and "View / Edit".
export default function MemberDialog({ open, member, onClose, onSaved }) {
  const isNew = !member;
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const data = form || (member ? { ...member, offlineAmount: '' } : BLANK);
  const set = (k) => (e) => setForm({ ...data, [k]: e.target.value });

  function close() { setForm(null); setError(''); onClose(); }

  async function save() {
    setSaving(true); setError('');
    const body = { ...data, offlineAmount: Number(data.offlineAmount) || 0 };
    const res = await fetch(isNew ? '/api/admin/members' : `/api/admin/members/${member.id}`, {
      method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(json.error || 'Could not save');
    onSaved(json.member);
    close();
  }

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>{isNew ? 'Add member' : 'Member details'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Name" value={data.name} onChange={set('name')} />
          <TextField select label="Batch" value={data.batch} onChange={set('batch')}>
            {BATCHES.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
          <TextField label="Mobile" value={data.mobile} onChange={set('mobile')} />
          <TextField label="Email" value={data.email} onChange={set('email')} />
          <TextField label="Location" value={data.location} onChange={set('location')} />
          <Autocomplete freeSolo options={PROFESSIONS} value={data.profession || ''} onInputChange={(_, v) => setForm({ ...data, profession: v })}
            renderInput={(params) => <TextField {...params} label="Profession" helperText={data.professionOther ? `Member wrote: ${data.professionOther}` : 'Pick from the list or type'} />} />
          <TextField select label="Approval" value={data.status} onChange={set('status')}>
            <MenuItem value="pending">Pending</MenuItem><MenuItem value="approved">Approved</MenuItem>
          </TextField>
          <TextField select label="Payment" value={data.paymentStatus} onChange={set('paymentStatus')}>
            <MenuItem value="pending">Pending</MenuItem><MenuItem value="paid">Paid</MenuItem>
          </TextField>
          <TextField label="Valid until" type="date" value={dateInput(data.validUntil)} onChange={set('validUntil')} InputLabelProps={{ shrink: true }}
            helperText="End of the subscription. Every payment adds the membership period automatically." />
          <TextField label="Record an offline / cash payment (₹)" type="number" value={data.offlineAmount} onChange={set('offlineAmount')}
            helperText="Optional. Adds this amount to the member's total paid and sets the payment to Paid." />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={close}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}
