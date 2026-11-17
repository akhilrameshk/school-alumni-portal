'use client';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Box } from '@mui/material';
import { fmtDate, rupees } from '@/lib/format';

const LABEL = { registration: 'Registration', renewal: 'Renewal', offline: 'Offline' };
const mono = { fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 13 };

// Payment history of one member, with the Razorpay transaction id of every payment.
export default function PaymentsDialog({ member, onClose }) {
  const list = [...(member?.payments || [])].reverse();
  return (
    <Dialog open={!!member} onClose={onClose} fullWidth maxWidth="md">
      {member && (
        <>
          <DialogTitle>Payments · {member.name}</DialogTitle>
          <DialogContent>
            <Typography sx={{ opacity: 0.75, mb: 2 }}>Total paid: <b>{rupees(member.totalPaid)}</b>. The transaction ID is the Razorpay payment id; search for it in the Razorpay dashboard.</Typography>
            {list.length === 0 ? <Typography>No payments yet.</Typography> : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Amount</TableCell><TableCell>Type</TableCell><TableCell>Transaction ID</TableCell><TableCell>Order ID</TableCell></TableRow></TableHead>
                  <TableBody>
                    {list.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{fmtDate(p.paidAt)}</TableCell>
                        <TableCell><b>{rupees(p.amount)}</b></TableCell>
                        <TableCell><Chip size="small" label={LABEL[p.purpose] || p.purpose} color={p.purpose === 'offline' ? 'default' : 'success'} variant="outlined" /></TableCell>
                        <TableCell sx={mono}>
                          {p.paymentId || '—'}
                          {p.paymentId && <Button size="small" onClick={() => navigator.clipboard?.writeText(p.paymentId)} sx={{ ml: 1, minWidth: 0 }}>Copy</Button>}
                        </TableCell>
                        <TableCell sx={mono}>{p.orderId || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Close</Button></DialogActions>
        </>
      )}
    </Dialog>
  );
}
