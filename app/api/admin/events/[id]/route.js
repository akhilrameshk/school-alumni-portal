import { itemRoutes, str, isoDate } from '@/lib/crud';
import Event from '@/models/Event';


function sanitize(b) {
  const type = ['event', 'announcement'].includes(b.type) ? b.type : 'event';
  const title = str(b.title, 150);
  const date = isoDate(b.date);
  if (title.length < 2) return { error: 'Enter a title' };
  if (!date) return { error: 'Enter a valid date' };
  const status = b.status === 'draft' ? 'draft' : 'published';
  return { data: { type, title, date, time: str(b.time, 30), venue: str(b.venue, 150), description: str(b.description, 1500), imageUrl: str(b.imageUrl, 300) || undefined, status } };
}


const item = itemRoutes({ Model: Event, sanitize });
export const PATCH = item.PATCH;
export const DELETE = item.DELETE;
