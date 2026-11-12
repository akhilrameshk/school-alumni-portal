import { NextResponse } from 'next/server';
import { hmac, safeEqual, markPaid } from '@/lib/razorpay';

export async function POST(req) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json().catch(() => ({}));
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const expected = hmac(process.env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
  if (!safeEqual(expected, razorpay_signature)) {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
  }
  const member = await markPaid({ orderId: razorpay_order_id, paymentId: razorpay_payment_id });
  if (!member) return NextResponse.json({ error: 'Member not found for this payment.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
