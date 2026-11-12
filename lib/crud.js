import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from './db';
import { plain } from './serialize';
import { deleteStoredImage } from './images';

const bad = (error, status = 400) => NextResponse.json({ error }, { status });

// List + create handlers for a simple collection (events, photos, ads).
export function collectionRoutes({ Model, sanitize, sort = { createdAt: -1 } }) {
  return {
    async GET() {
      await connectDB();
      const items = await Model.find().sort(sort).lean();
      return NextResponse.json(items.map(plain));
    },
    async POST(req) {
      const body = await req.json().catch(() => ({}));
      const r = sanitize(body);
      if (r.error) return bad(r.error);
      await connectDB();
      const doc = await Model.create(r.data);
      return NextResponse.json(plain(doc.toObject()), { status: 201 });
    },
  };
}

// Update + delete handlers for one item.
export function itemRoutes({ Model, sanitize }) {
  return {
    async PATCH(req, { params }) {
      if (!mongoose.isValidObjectId(params.id)) return bad('Invalid id');
      const body = (await req.json().catch(() => null)) || {};
      await connectDB();
      const doc = await Model.findById(params.id);
      if (!doc) return bad('Not found', 404);
      const old = doc.toObject();
      const r = sanitize({ ...old, ...body });
      if (r.error) return bad(r.error);
      doc.set(r.data);
      await doc.save();
      if (old.imageUrl && old.imageUrl !== doc.imageUrl) await deleteStoredImage(old.imageUrl);
      return NextResponse.json(plain(doc.toObject()));
    },
    async DELETE(_req, { params }) {
      if (!mongoose.isValidObjectId(params.id)) return bad('Invalid id');
      await connectDB();
      const doc = await Model.findByIdAndDelete(params.id);
      if (doc?.imageUrl) await deleteStoredImage(doc.imageUrl);
      return NextResponse.json({ ok: true });
    },
  };
}

export const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);
export const isoDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
};
