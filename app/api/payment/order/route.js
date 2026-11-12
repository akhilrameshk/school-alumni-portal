import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { FEES } from '@/lib/config';
import { getRazorpay } from '@/lib/razorpay';
import Member from '@/models/Member';

export async function POST(req) {
  const { memberId, purpose } = await req.json().catch(() => ({}));
  if (!mongoose.isValidObjectId(memberId) || !['registration', 'renewal'].includes(purpose)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  await connectDB();
  const member = await Member.findById(memberId);
  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  if (purpose === 'registration' && member.paymentStatus === 'paid') {
    return NextResponse.json({ error: 'Payment already received. Use Renew for the next payment.' }, { status: 409 });
  }

  const fee = purpose === 'renewal' ? FEES.renewal : FEES.registration;
  const amount = Math.round(fee * 100); // paise
  if (!Number.isFinite(amount) || amount < 100) {
    return NextResponse.json({ error: 'The fee is not configured.' }, { status: 500 });
  }

  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      receipt: `m_${member._id}`,
      notes: { memberId: String(member._id), purpose },
    });
    member.set('pendingOrder', { orderId: order.id, purpose, amount: fee });
    await member.save();
    return NextResponse.json({
      orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order error', err);
    return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 502 });
  }
}
