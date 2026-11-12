import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { validateMember } from '@/lib/validate';
import Member from '@/models/Member';
import { extendFrom } from '@/lib/membership';

// Bulk import: the browser parses the CSV and sends the rows; every row is validated again here.
export async function POST(req) {
  const { rows, paymentStatus, offlineAmount } = await req.json().catch(() => ({}));
  if (!Array.isArray(rows) || !rows.length || rows.length > 2000) {
    return NextResponse.json({ error: 'Send between 1 and 2000 rows.' }, { status: 400 });
  }

  const skipped = [];
  const valid = [];
  const seenM = new Set(), seenE = new Set();
  rows.forEach((r, i) => {
    const line = i + 2; // row 1 is the header
    const v = validateMember(r, { requireConsent: false });
    if (!v.ok) return skipped.push({ row: line, name: r?.name || '', reason: Object.values(v.errors)[0] });
    if (seenM.has(v.data.mobile) || seenE.has(v.data.email)) return skipped.push({ row: line, name: v.data.name, reason: 'Duplicate inside the file' });
    seenM.add(v.data.mobile); seenE.add(v.data.email);
    valid.push({ line, data: v.data });
  });

  await connectDB();
  const existing = await Member.find(
    { $or: [{ mobile: { $in: valid.map((v) => v.data.mobile) } }, { email: { $in: valid.map((v) => v.data.email) } }] },
    'mobile email'
  ).lean();
  const exM = new Set(existing.map((e) => e.mobile));
  const exE = new Set(existing.map((e) => e.email));

  const paid = paymentStatus === 'paid';
  const amount = Number(offlineAmount) > 0 ? Number(offlineAmount) : 0;
  const paidAt = new Date();
  const toInsert = [];
  valid.forEach(({ line, data }) => {
    if (exM.has(data.mobile) || exE.has(data.email)) return skipped.push({ row: line, name: data.name, reason: 'Already registered' });
    const doc = { ...data, consent: true, status: 'approved', paymentStatus: paid ? 'paid' : 'pending' };
    if (paid) doc.validUntil = extendFrom(null);
    if (paid && amount) Object.assign(doc, { payments: [{ amount, purpose: 'offline', paidAt }], totalPaid: amount, lastPaidAmount: amount, lastPaidAt: paidAt });
    toInsert.push(doc);
  });

  let inserted = 0;
  if (toInsert.length) {
    try {
      inserted = (await Member.insertMany(toInsert, { ordered: false })).length;
    } catch (err) {
      inserted = err?.insertedDocs?.length ?? err?.result?.insertedCount ?? 0;
      skipped.push({ row: '-', name: '', reason: 'Some rows were skipped because they already exist' });
    }
  }
  return NextResponse.json({ inserted, skipped });
}
