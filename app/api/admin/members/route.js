import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { validateMember } from '@/lib/validate';
import { toRow } from '@/lib/serialize';
import Member from '@/models/Member';
import { extendFrom } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const members = await Member.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(members.map(toRow));
}

// Add a single member by hand (admin)
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { data, errors, ok } = validateMember(body, { requireConsent: false });
  if (!ok) return NextResponse.json({ error: Object.values(errors)[0] }, { status: 400 });

  const doc = { ...data, consent: true, status: body.status === 'pending' ? 'pending' : 'approved' };
  const offline = Number(body.offlineAmount);
  if (body.paymentStatus === 'paid') {
    doc.paymentStatus = 'paid';
    doc.validUntil = extendFrom(null);
    if (offline > 0) {
      const paidAt = new Date();
      Object.assign(doc, { payments: [{ amount: offline, purpose: 'offline', paidAt }], totalPaid: offline, lastPaidAmount: offline, lastPaidAt: paidAt });
    }
  }
  await connectDB();
  try {
    const m = await Member.create(doc);
    return NextResponse.json({ member: toRow(m) }, { status: 201 });
  } catch (err) {
    if (err?.code === 11000) return NextResponse.json({ error: 'Mobile or email is already registered.' }, { status: 409 });
    throw err;
  }
}
