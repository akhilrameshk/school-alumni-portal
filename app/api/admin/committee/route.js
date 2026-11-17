import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { plain } from '@/lib/serialize';
import { sanitizeCommittee } from '@/lib/committee';
import CommitteeMember from '@/models/CommitteeMember';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const rows = await CommitteeMember.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json(rows.map(plain));
}

export async function POST(req) {
  const r = sanitizeCommittee(await req.json().catch(() => ({})));
  if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
  await connectDB();
  const doc = await CommitteeMember.create(r.data);
  return NextResponse.json(plain(doc.toObject()), { status: 201 });
}
