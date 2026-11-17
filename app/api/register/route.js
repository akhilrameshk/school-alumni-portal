import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { validateMember } from '@/lib/validate';
import Member from '@/models/Member';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { data, errors, ok } = validateMember(body, { strictProfession: true });
  if (!ok) return NextResponse.json({ error: Object.values(errors)[0] }, { status: 400 });

  await connectDB();
  try {
    const existing = await Member.findOne({ $or: [{ email: data.email }, { mobile: data.mobile }] });
    if (existing) {
      if (existing.paymentStatus === 'paid') {
        return NextResponse.json({ error: 'You are already registered. Use Renew to pay your membership again.' }, { status: 409 });
      }
      // unpaid earlier attempt (or imported by the admin): update details and let them pay
      Object.assign(existing, data, { consent: true });
      await existing.save();
      return NextResponse.json({ memberId: String(existing._id) });
    }
    const member = await Member.create({ ...data, consent: true });
    return NextResponse.json({ memberId: String(member._id) }, { status: 201 });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: 'This mobile number or email is already registered.' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Could not register. Please try again.' }, { status: 500 });
  }
}
