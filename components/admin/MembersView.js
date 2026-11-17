'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Stack, Paper, TextField, MenuItem, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BATCHES } from '@/lib/config';
import { fmtDate, rupees } from '@/lib/format';
import MemberDialog from './MemberDialog';
import BulkDialog from './BulkDialog';
import PaymentsDialog from './PaymentsDialog';

export default function MembersView() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [batch, setBatch] = useState('');
  const [profession, setProfession] = useState('');
  const [edit, setEdit] = useState(undefined); // undefined = closed, null = add, object = edit
  const [del, setDel] = useState(null);
  const [bulk, setBulk] = useState(false);
  const [pays, setPays] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/members');
    if (res.status === 401) { router.replace('/admin/login'); return; }
    if (!res.ok) { setError('Could not load members'); setLoading(false); return; }
    setRows(await res.json());
    setError(''); setLoading(false);
  }, [router]);
  useEffect(() => { load(); }, [load]);

  const professions = useMemo(() => Array.from(new Set(rows.map((r) => r.profession))).sort(), [rows]);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) =>
      (!batch || r.batch === Number(batch)) && (!profession || r.profession === profession) &&
      (!t || [r.name, r.mobile, r.email].some((v) => String(v).toLowerCase().includes(t))));
  }, [rows, q, batch, profession]);

  const paid = rows.filter((r) => r.paymentStatus === 'paid').length;
  const collected = rows.reduce((s, r) => s + (r.totalPaid || 0), 0);

  async function approve(id) {
    const res = await fetch(`/api/admin/members/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) setRows((rs) => rs.map((r) => (r.id === id ? data.member : r)));
  }
  async function remove() {
    const res = await fetch(`/api/admin/members/${del.id}`, { method: 'DELETE' });
    if (res.ok) setRows((rs) => rs.filter((r) => r.id !== del.id));
    setDel(null);
  }
  const exportUrl = `/api/admin/members/export?${new URLSearchParams({ ...(batch && { batch }), ...(profession && { profession }) })}`;

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'batch', headerName: 'Batch', width: 80 },
    { field: 'mobile', headerName: 'Mobile', width: 140 },
    { field: 'profession', headerName: 'Profession', width: 190, renderCell: (p) => (p.row.profession === 'Other' && p.row.professionOther ? `Other: ${p.row.professionOther}` : p.row.profession) },
    { field: 'lastPaidAmount', headerName: 'Last amount paid', width: 140, renderCell: (p) => (p.row.lastPaidAt ? rupees(p.row.lastPaidAmount) : '–') },
    { field: 'lastPaidAt', headerName: 'Last paid on', width: 125, renderCell: (p) => fmtDate(p.row.lastPaidAt) },
    {
      field: 'lastPaymentId', headerName: 'Transaction ID', width: 210, sortable: false,
      renderCell: (p) => (p.value
        ? <span style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 13 }}>{p.value}</span>
        : (p.row.paymentStatus === 'paid' ? 'Offline' : '–')),
    },
    { field: 'totalPaid', headerName: 'Total amount paid', width: 150, renderCell: (p) => <b>{rupees(p.row.totalPaid)}</b> },
    { field: 'validUntil', headerName: 'Valid until', width: 125, renderCell: (p) => fmtDate(p.row.validUntil) },
    {
      field: 'daysLeft', headerName: 'Days left', width: 115,
      renderCell: (p) => {
        const d = p.row.daysLeft;
        if (d === null || d === undefined) return '–';
        if (d <= 0) return <Chip size="small" color="error" label="Expired" />;
        return <Chip size="small" color={d <= 30 ? 'warning' : 'success'} label={`${d} days`} />;
      },
    },
    { field: 'paymentStatus', headerName: 'Payment', width: 105, renderCell: (p) => <Chip size="small" label={p.value === 'paid' ? 'Paid' : 'Pending'} color={p.value === 'paid' ? 'success' : 'warning'} /> },
    { field: 'status', headerName: 'Approval', width: 105, renderCell: (p) => <Chip size="small" variant="outlined" label={p.value === 'approved' ? 'Approved' : 'Pending'} color={p.value === 'approved' ? 'success' : 'default'} /> },
    {
      field: 'actions', headerName: 'Actions', width: 370, sortable: false, filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <Button size="small" variant="outlined" onClick={() => setEdit(p.row)}>View / Edit</Button>
          <Button size="small" onClick={() => setPays(p.row)}>Payments</Button>
          {p.row.status !== 'approved' && <Button size="small" onClick={() => approve(p.row.id)}>Approve</Button>}
          <Button size="small" color="error" onClick={() => setDel(p.row)}>Delete</Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="h4">Members</Typography>
        <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Button variant="outlined" onClick={() => setEdit(null)}>Add member</Button>
          <Button variant="outlined" component="a" href={exportUrl}>Export members</Button>
          <Button variant="outlined" component="a" href="/api/admin/payments/export">Export payments</Button>
          <Button variant="contained" onClick={() => setBulk(true)}>Bulk upload (CSV)</Button>
        </Stack>
      </Box>

      <Stack direction="row" spacing={2} sx={{ my: 2.5, flexWrap: 'wrap', rowGap: 2 }}>
        {[['Total members', rows.length], ['Paid', paid], ['Pending', rows.length - paid], ['Total collected', rupees(collected)]].map(([l, n], i) => (
          <Paper key={l} variant="outlined" sx={{ px: 3, py: 1.5, borderRadius: 3, ...(i === 3 && { bgcolor: 'primary.main', color: '#fff', borderColor: 'primary.main' }) }}>
            <Typography variant="h5">{n}</Typography><Typography fontSize={14}>{l}</Typography>
          </Paper>
        ))}
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField sx={{ flex: 2 }} size="small" placeholder="Search by name, mobile or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <TextField sx={{ flex: 1 }} size="small" select label="Batch" value={batch} onChange={(e) => setBatch(e.target.value)}>
          <MenuItem value="">All batches</MenuItem>{BATCHES.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
        </TextField>
        <TextField sx={{ flex: 1 }} size="small" select label="Profession" value={profession} onChange={(e) => setProfession(e.target.value)}>
          <MenuItem value="">All professions</MenuItem>{professions.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <DataGrid autoHeight rows={filtered} columns={columns} loading={loading} disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]} initialState={{ pagination: { paginationModel: { pageSize: 25 } } }} />
      </Paper>

      <MemberDialog open={edit !== undefined} member={edit || null} onClose={() => setEdit(undefined)} onSaved={load} />
      <PaymentsDialog member={pays} onClose={() => setPays(null)} />
      <BulkDialog open={bulk} onClose={() => setBulk(false)} onDone={load} />
      <Dialog open={!!del} onClose={() => setDel(null)}>
        <DialogTitle>Delete member?</DialogTitle>
        <DialogContent><Typography>{del?.name} will be removed permanently.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setDel(null)}>Cancel</Button><Button color="error" variant="contained" onClick={remove}>Delete</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
