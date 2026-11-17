import { connectDB } from '@/lib/db';
import { toCSV } from '@/lib/csv';
import Member from '@/models/Member';

export const dynamic = 'force-dynamic';

// Every payment, one row each, newest first (for accounts). Optional filters: ?from=2026-01-01&to=2026-12-31
export async function GET(req) {
  const sp = new URL(req.url).searchParams;
  const from = sp.get('from') ? new Date(sp.get('from')) : null;
  const to = sp.get('to') ? new Date(new Date(sp.get('to')).getTime() + 864e5) : null;

  await connectDB();
  const members = await Member.find({ 'payments.0': { $exists: true } }).select('name batch mobile email payments').lean();
  const rows = [];
  members.forEach((m) => (m.payments || []).forEach((p) => {
    const d = p.paidAt ? new Date(p.paidAt) : null;
    if (from && (!d || d < from)) return;
    if (to && (!d || d >= to)) return;
    rows.push({ d, line: [d ? d.toISOString().slice(0, 10) : '', m.name, m.batch, m.mobile, m.email, p.amount || 0, p.purpose || '', p.paymentId || '', p.orderId || ''] });
  }));
  rows.sort((a, b) => (b.d?.getTime() || 0) - (a.d?.getTime() || 0));
  const csv = toCSV(['Date', 'Name', 'Batch', 'Mobile', 'Email', 'Amount', 'Type', 'Transaction ID', 'Order ID'], rows.map((r) => r.line));
  return new Response('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="payments-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
