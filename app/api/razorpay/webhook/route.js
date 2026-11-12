import { NextResponse } from 'next/server';
import { hmac, safeEqual, markPaid } from '@/lib/razorpay';

// Razorpay Dashboard -> Settings -> Webhooks
//   URL: https://YOUR-DOMAIN/api/razorpay/webhook
//   Events: payment.captured, order.paid     Secret: RAZORPAY_WEBHOOK_SECRET
export async function POST(req) {
  const raw = await req.text();
  const expected = hmac(process.env.RAZORPAY_WEBHOOK_SECRET, raw);
  if (!safeEqual(expected, req.headers.get('x-razorpay-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  const event = JSON.parse(raw);
  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const pay = event.payload?.payment?.entity;
    await markPaid({
      orderId: pay?.order_id || event.payload?.order?.entity?.id,
      paymentId: pay?.id,
      memberId: pay?.notes?.memberId,
      purpose: pay?.notes?.purpose,
      amountPaise: pay?.amount,
    });
  }
  return NextResponse.json({ ok: true });
}
