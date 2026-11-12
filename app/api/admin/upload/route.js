import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { cloudinaryEnabled, uploadToCloudinary } from '@/lib/cloudinary';
import StoredImage from '@/models/StoredImage';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX = 4 * 1024 * 1024; // the admin screens compress photos before uploading

// Uploads go to Cloudinary when CLOUDINARY_* is configured; otherwise they are kept in MongoDB (fallback for local testing).
export async function POST(req) {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') return NextResponse.json({ error: 'No file received' }, { status: 400 });
  if (!TYPES.includes(file.type)) return NextResponse.json({ error: 'Only JPG, PNG or WebP images are allowed' }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: 'Image is too large (max 4 MB)' }, { status: 400 });

  const data = Buffer.from(await file.arrayBuffer());
  if (cloudinaryEnabled()) {
    try {
      const { url } = await uploadToCloudinary(data, file.type);
      return NextResponse.json({ url }, { status: 201 });
    } catch (err) {
      console.error('Cloudinary upload', err);
      return NextResponse.json({ error: `Upload failed: ${err.message}` }, { status: 502 });
    }
  }

  await connectDB();
  const img = await StoredImage.create({ data, contentType: file.type, size: data.length });
  return NextResponse.json({ url: `/api/images/${img._id}` }, { status: 201 });
}
