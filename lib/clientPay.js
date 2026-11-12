import { SITE } from './config';

export async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load the payment window. Check your connection.'));
    document.body.appendChild(s);
  });
}

// Opens Razorpay checkout for an order created by /api/payment/order and verifies the result.
export async function payWithRazorpay({ order, prefill, description, onSuccess, onFailure, onDismiss }) {
  await loadRazorpay();
  const rzp = new window.Razorpay({
    key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
    name: SITE.name, description, prefill, theme: { color: '#1f6b3a' },
    handler: async (resp) => {
      try { await post('/api/payment/verify', resp); onSuccess(); }
      catch (err) { onFailure(`${err.message} If money was deducted, it will be confirmed automatically shortly.`); }
    },
    modal: { ondismiss: onDismiss },
  });
  rzp.on('payment.failed', (r) => onFailure(r?.error?.description || 'Payment failed. Please try again.'));
  rzp.open();
}
