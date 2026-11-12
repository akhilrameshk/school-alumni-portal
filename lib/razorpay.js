import Razorpay from 'razorpay';
import crypto from 'crypto';
import { connectDB } from './db';
import Member from '@/models/Member';
import { extendFrom } from './membership';

export function getRazorpay() {
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

export const hmac = (secret, text) => crypto.createHmac('sha256', secret || '').update(text).digest('hex');

export function safeEqual(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// Records a successful payment once (idempotent on paymentId) and updates the member's totals.
// The member is found by order id, falling back to the memberId stored in the Razorpay order notes.
export async function markPaid({ orderId, paymentId, memberId, amountPaise, purpose }) {
  await connectDB();
  if (!paymentId) return null;

  let member = orderId ? await Member.findOne({ 'pendingOrder.orderId': orderId }) : null;
  if (!member && !memberId && orderId) {
    const order = await getRazorpay().orders.fetch(orderId);
    memberId = order?.notes?.memberId;
    purpose = purpose || order?.notes?.purpose;
  }
  if (!member && memberId) member = await Member.findById(memberId);
  if (!member) return null;

  if ((member.payments || []).some((p) => p.paymentId === paymentId)) return member; // already recorded

  const amount = amountPaise ? amountPaise / 100 : member.pendingOrder?.amount || 0;
  const paidAt = new Date();
  return Member.findOneAndUpdate(
    { _id: member._id, 'payments.paymentId': { $ne: paymentId } },
    {
      $push: { payments: { amount, paymentId, orderId, purpose: purpose || member.pendingOrder?.purpose || 'registration', paidAt } },
      $set: { paymentStatus: 'paid', lastPaidAmount: amount, lastPaidAt: paidAt, validUntil: extendFrom(member.validUntil) },
      $inc: { totalPaid: amount },
      $unset: { pendingOrder: 1 },
    },
    { new: true }
  );
}
