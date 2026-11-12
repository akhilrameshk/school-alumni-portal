import { itemRoutes, str, isoDate } from '@/lib/crud';
import Photo from '@/models/Photo';


function sanitize(b) {
  const imageUrl = str(b.imageUrl, 300);
  if (!imageUrl) return { error: 'Upload a photo first' };
  return { data: { imageUrl, caption: str(b.caption, 150), album: str(b.album, 60) || 'General' } };
}


const item = itemRoutes({ Model: Photo, sanitize });
export const PATCH = item.PATCH;
export const DELETE = item.DELETE;
