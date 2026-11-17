import { connectDB } from '@/lib/db';
import { toCSV } from '@/lib/csv';
import Member from '@/models/Member';

export const dynamic = 'force-dynamic';

// Excel opens this CSV directly. Optional filters: ?batch=2004&profession=Teacher
export async function GET(req) {
  const sp = new URL(req.url).searchParams;
  const filter = {};
  if (sp.get('batch')) filter.batch = Number(sp.get('batch'));
  if (sp.get('profession')) filter.profession = sp.get('profession');

  await connectDB();
  const members = await Member.find(filter).sort({ batch: 1, name: 1 }).lean();
  const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
  const csv = toCSV(
    ['Name', 'Batch', 'Mobile', 'Email', 'Location', 'Profession', 'Approval', 'Payment', 'Last amount paid', 'Last paid on', 'Last transaction ID', 'Valid until', 'Days left', 'Total amount paid'],
    members.map((m) => [m.name, m.batch, m.mobile, m.email, m.location, m.profession, m.status, m.paymentStatus,
      m.lastPaidAmount || 0, day(m.lastPaidAt), [...(m.payments || [])].reverse().find((x) => x.paymentId)?.paymentId || '', day(m.validUntil), m.validUntil ? Math.ceil((new Date(m.validUntil) - Date.now()) / 864e5) : '', m.totalPaid || 0])
  );
  return new Response('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="members-${day(new Date())}.csv"`,
    },
  });
}
