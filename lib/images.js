import { connectDB } from './db';
import StoredImage from '@/models/StoredImage';
import { deleteFromCloudinary } from './cloudinary';

// Removes an uploaded image when it is no longer used.
// Cloudinary URLs are deleted from Cloudinary; /api/images/<id> (MongoDB fallback) from the database.
export async function deleteStoredImage(url) {
  const u = String(url || '');
  if (u.startsWith('https://res.cloudinary.com/')) return deleteFromCloudinary(u);
  const m = /^\/api\/images\/([a-f0-9]{24})$/.exec(u);
  if (!m) return;
  await connectDB();
  await StoredImage.findByIdAndDelete(m[1]);
}
