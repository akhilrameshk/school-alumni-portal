import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { FEES } from '@/lib/config';
import Member from '@/models/Member';
import { daysLeft } from '@/lib/membership';

const mask = (name) => String(name).split(' ').map((w) => w.charAt(0) + '*'.repeat(Math.max(2, w.length - 1))).join(' ');

export async function POST(req) {
  const { identifier } = await req.json().catch(() => ({}));
  const id = String(identifier || '').trim().toLowerCase();
  if (id.length < 5) return NextResponse.json({ error: 'Enter your mobile number or email.' }, { status: 400 });

  const digits = id.replace(/[\s-]/g, '');
  const mobiles = [digits];
  if (/^\d{10}$/.test(digits)) mobiles.push(`+91${digits}`, `91${digits}`);
  await connectDB();
  const member = await Member.findOne(id.includes('@') ? { email: id } : { mobile: { $in: mobiles } });
  if (!member) return NextResponse.json({ error: 'We could not find a membership with these details.' }, { status: 404 });

  // only a masked name is returned, so this cannot be used to look people up
  return NextResponse.json({
    memberId: String(member._id),
    displayName: mask(member.name),
    batch: member.batch,
    lastPaidAt: member.lastPaidAt || null,
    validUntil: member.validUntil || null,
    daysLeft: daysLeft(member.validUntil),
    fee: FEES.renewal,
  });
}
