import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim();
  const message = String(b.message || '').trim();
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 3) {
    return NextResponse.json({ error: 'Please fill in all fields correctly.' }, { status: 400 });
  }
  await connectDB();
  await Enquiry.create({ name, email, message });
  return NextResponse.json({ ok: true }, { status: 201 });
}
