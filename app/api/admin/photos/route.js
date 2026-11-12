import { collectionRoutes, itemRoutes, str, isoDate } from '@/lib/crud';
import Photo from '@/models/Photo';

export const dynamic = 'force-dynamic';


function sanitize(b) {
  const imageUrl = str(b.imageUrl, 300);
  if (!imageUrl) return { error: 'Upload a photo first' };
  return { data: { imageUrl, caption: str(b.caption, 150), album: str(b.album, 60) || 'General' } };
}


const sort = { createdAt: -1 };
const list = collectionRoutes({ Model: Photo, sanitize, sort });
export const GET = list.GET;
export const POST = list.POST;
