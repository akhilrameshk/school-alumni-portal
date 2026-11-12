import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import StoredImage from '@/models/StoredImage';

export async function GET(_req, { params }) {
  if (!mongoose.isValidObjectId(params.id)) return new Response('Not found', { status: 404 });
  await connectDB();
  const img = await StoredImage.findById(params.id);
  if (!img) return new Response('Not found', { status: 404 });
  return new Response(img.data, {
    headers: { 'Content-Type': img.contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
