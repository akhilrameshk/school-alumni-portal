import GalleryView from '@/components/GalleryView';
import { getGalleryData } from '@/lib/public';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Gallery · SDV HSS Alumni' };

export default async function Page() {
  return <GalleryView photos={await getGalleryData()} />;
}
