'use client';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Button, Typography, Chip, Alert, MenuItem, TextField, Box,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import { parseCSV, rowsToObjects, MEMBER_TEMPLATE } from '@/lib/csv';
import { validateMember } from '@/lib/validate';

function downloadTemplate() {
  const url = URL.createObjectURL(new Blob([MEMBER_TEMPLATE], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'members-template.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function BulkDialog({ open, onClose, onDone }) {
  const [file, setFile] = useState('');
  const [ready, setReady] = useState([]);
  const [issues, setIssues] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [offlineAmount, setOfflineAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function reset() { setFile(''); setReady([]); setIssues([]); setResult(null); setError(''); setPaymentStatus('pending'); setOfflineAmount(''); }
  function close() { if (result) onDone(); reset(); onClose(); }

  async function choose(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    reset();
    const objs = rowsToObjects(parseCSV(await f.text()));
    if (!objs.length) return setError('The file has no rows. Use the template and add one member per line.');
    if (objs.length > 2000) return setError('Please upload at most 2000 rows at a time.');
    const ok = [], bad = [];
    const seenM = new Set(), seenE = new Set();
    objs.forEach((r, i) => {
      const v = validateMember(r, { requireConsent: false });
      const line = i + 2;
      if (!v.ok) return bad.push({ row: line, name: r.name, reason: Object.values(v.errors)[0] });
      if (seenM.has(v.data.mobile) || seenE.has(v.data.email)) return bad.push({ row: line, name: v.data.name, reason: 'Duplicate inside the file' });
      seenM.add(v.data.mobile); seenE.add(v.data.email);
      ok.push(r);
    });
    setFile(`${f.name} · ${objs.length} rows`); setReady(ok); setIssues(bad);
  }

  async function run() {
    setBusy(true); setError('');
    const res = await fetch('/api/admin/members/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: ready, paymentStatus, offlineAmount: Number(offlineAmount) || 0 }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || 'Import failed');
    setResult(data);
  }

  const skipped = result ? result.skipped : issues;
  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>Bulk upload members</DialogTitle>
      <DialogContent>
        <Typography sx={{ opacity: 0.75, mb: 2 }}>Add many members at once from a CSV file. Columns: name, batch, mobile, email, location, profession.</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1, border: '1px solid #dcd6c5', borderRadius: 3, p: 2 }}>
            <b>1. Download the template</b><br />
            <Button size="small" variant="outlined" onClick={downloadTemplate} sx={{ mt: 1 }}>Download template</Button>
          </Box>
          <Box sx={{ flex: 1, border: '2px dashed #9ab89f', bgcolor: '#eef6f0', borderRadius: 3, p: 2 }}>
            <b>2. Upload your CSV</b>
            <Typography sx={{ fontSize: 14, opacity: 0.7 }}>{file || 'No file chosen'}</Typography>
            <Button component="label" size="small" variant="contained" sx={{ mt: 1 }}>
              Choose file<input hidden type="file" accept=".csv,text/csv" onChange={choose} />
            </Button>
          </Box>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {result ? (
          <Alert severity="success" sx={{ mb: 2 }}>{result.inserted} members imported. {result.skipped.length ? `${result.skipped.length} rows skipped.` : ''}</Alert>
        ) : file && (
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip color="success" label={`${ready.length} ready to import`} />
            {issues.length > 0 && <Chip color="warning" label={`${issues.length} need fixing`} />}
          </Stack>
        )}

        {skipped.length > 0 && (
          <Box sx={{ maxHeight: 220, overflow: 'auto', border: '1px solid #dcd6c5', borderRadius: 3, mb: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead><TableRow><TableCell>Row</TableCell><TableCell>Name</TableCell><TableCell>Problem</TableCell></TableRow></TableHead>
              <TableBody>{skipped.slice(0, 100).map((s, i) => <TableRow key={i}><TableCell>{s.row}</TableCell><TableCell>{s.name}</TableCell><TableCell>{s.reason}</TableCell></TableRow>)}</TableBody>
            </Table>
          </Box>
        )}

        {file && !result && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField select size="small" label="Payment status for imported members" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} sx={{ flex: 1 }}>
              <MenuItem value="pending">Pending</MenuItem><MenuItem value="paid">Paid (offline)</MenuItem>
            </TextField>
            {paymentStatus === 'paid' && (
              <TextField size="small" type="number" label="Amount paid each (₹, optional)" value={offlineAmount} onChange={(e) => setOfflineAmount(e.target.value)} sx={{ flex: 1 }} />
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={close}>{result ? 'Done' : 'Cancel'}</Button>
        {!result && <Button variant="contained" disabled={!ready.length || busy} onClick={run}>{busy ? 'Importing...' : `Import ${ready.length} members`}</Button>}
      </DialogActions>
    </Dialog>
  );
}
