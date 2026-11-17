// Turns Mongo documents into plain JSON-safe objects.
export function plain(doc) {
  if (!doc) return doc;
  const o = JSON.parse(JSON.stringify(doc));
  o.id = String(o._id);
  delete o._id;
  delete o.__v;
  return o;
}

import { daysLeft } from './membership';

const payList = (m) =>
  (m.payments || []).map((p) => ({
    amount: p.amount || 0,
    paymentId: p.paymentId || '', // Razorpay transaction id (pay_...)
    orderId: p.orderId || '',
    purpose: p.purpose || 'registration',
    paidAt: p.paidAt ? new Date(p.paidAt).toISOString() : null,
  }));

export const toRow = (m) => ({
  payments: payList(m),
  lastPaymentId: [...payList(m)].reverse().find((p) => p.paymentId)?.paymentId || '',
  id: String(m._id),
  name: m.name,
  batch: m.batch,
  mobile: m.mobile,
  email: m.email,
  location: m.location,
  profession: m.profession,
  professionOther: m.professionOther || '',
  status: m.status,
  paymentStatus: m.paymentStatus || 'pending',
  totalPaid: m.totalPaid || 0,
  lastPaidAmount: m.lastPaidAmount || 0,
  lastPaidAt: m.lastPaidAt ? new Date(m.lastPaidAt).toISOString() : null,
  validUntil: m.validUntil ? new Date(m.validUntil).toISOString() : null,
  daysLeft: daysLeft(m.validUntil),
  createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : null,
});
