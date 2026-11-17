import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { plain } from '@/lib/serialize';
import { deleteStoredImage } from '@/lib/images';
import CommitteeMember from '@/models/CommitteeMember';
import { sanitizeCommittee } from '@/lib/committee';

const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function PATCH(req, { params }) {
  if (!mongoose.isValidObjectId(params.id)) return bad('Invalid id');
  const body = (await req.json().catch(() => null)) || {};
  await connectDB();
  const doc = await CommitteeMember.findById(params.id);
  if (!doc) return bad('Not found', 404);
  const old = doc.toObject();
  const r = sanitizeCommittee({ ...old, ...body });
  if (r.error) return bad(r.error);

  // a person cannot report to themselves or to someone below them
  let cur = r.data.parentId;
  for (let i = 0; cur && i < 50; i++) {
    if (String(cur) === String(doc._id)) return bad('A member cannot report to themselves or to someone below them.');
    const p = await CommitteeMember.findById(cur).select('parentId').lean();
    cur = p?.parentId ? String(p.parentId) : null;
  }

  doc.set(r.data);
  await doc.save();
  if (old.imageUrl && old.imageUrl !== doc.imageUrl) await deleteStoredImage(old.imageUrl);
  return NextResponse.json(plain(doc.toObject()));
}

export async function DELETE(_req, { params }) {
  if (!mongoose.isValidObjectId(params.id)) return bad('Invalid id');
  await connectDB();
  const doc = await CommitteeMember.findByIdAndDelete(params.id);
  if (doc) {
    // people who reported to the deleted member move up one level
    await CommitteeMember.updateMany({ parentId: doc._id }, { parentId: doc.parentId || null });
    if (doc.imageUrl) await deleteStoredImage(doc.imageUrl);
  }
  return NextResponse.json({ ok: true });
}
