import { itemRoutes, str, isoDate } from '@/lib/crud';
import Ad from '@/models/Ad';


function sanitize(b) {
  const name = str(b.name, 120);
  const imageUrl = str(b.imageUrl, 300);
  const link = str(b.link, 300);
  const startDate = isoDate(b.startDate);
  const endDate = isoDate(b.endDate);
  if (name.length < 2) return { error: 'Enter the advertiser name' };
  if (!imageUrl) return { error: 'Upload the banner image' };
  if (link && !/^https?:\/\//i.test(link)) return { error: 'The link must start with http:// or https://' };
  if (startDate === undefined || endDate === undefined) return { error: 'Enter valid dates' };
  if (startDate && endDate && endDate < startDate) return { error: 'The end date must be after the start date' };
  return { data: { name, imageUrl, link, startDate, endDate, active: b.active !== false } };
}


const item = itemRoutes({ Model: Ad, sanitize });
export const PATCH = item.PATCH;
export const DELETE = item.DELETE;
