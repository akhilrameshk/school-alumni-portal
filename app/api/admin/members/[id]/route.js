import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { validateMember } from '@/lib/validate';
import { toRow } from '@/lib/serialize';
import Member from '@/models/Member';
import { extendFrom } from '@/lib/membership';

const PERSONAL = ['name', 'batch', 'mobile', 'email', 'location', 'profession'];

export async function PATCH(req, { params }) {
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = (await req.json().catch(() => null)) || {};

  await connectDB();
  const member = await Member.findById(id);
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const update = { $set: {} };
  if (PERSONAL.some((k) => k in body)) {
    const merged = { ...member.toObject() };
    PERSONAL.forEach((k) => { if (k in body) merged[k] = body[k]; });
    const { data, errors, ok } = validateMember(merged, { requireConsent: false });
    if (!ok) return NextResponse.json({ error: Object.values(errors)[0] }, { status: 400 });
    Object.assign(update.$set, data);
  }
  if (body.status) {
    if (!['pending', 'approved'].includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    update.$set.status = body.status;
  }
  if (body.paymentStatus) {
    if (!['pending', 'paid'].includes(body.paymentStatus)) return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    update.$set.paymentStatus = body.paymentStatus;
    if (body.paymentStatus === 'paid' && !member.validUntil) update.$set.validUntil = extendFrom(null);
  }
  // cash / offline payment recorded by the admin
  const offline = Number(body.offlineAmount);
  if (offline > 0) {
    const paidAt = new Date();
    update.$push = { payments: { amount: offline, purpose: 'offline', paidAt } };
    update.$inc = { totalPaid: offline };
    Object.assign(update.$set, { paymentStatus: 'paid', lastPaidAmount: offline, lastPaidAt: paidAt, validUntil: extendFrom(member.validUntil) });
  }

  // the admin can also set the end of the subscription directly
  if (body.validUntil) {
    const v = new Date(body.validUntil);
    if (!Number.isNaN(v.getTime())) update.$set.validUntil = v;
  }

  try {
    const updated = await Member.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    return NextResponse.json({ member: toRow(updated) });
  } catch (err) {
    if (err?.code === 11000) return NextResponse.json({ error: 'Mobile or email is already used by another member.' }, { status: 409 });
    throw err;
  }
}

export async function DELETE(_req, { params }) {
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  await connectDB();
  await Member.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
