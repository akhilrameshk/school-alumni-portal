import AdminShell from '@/components/admin/AdminShell';
import GalleryAdmin from '@/components/admin/GalleryAdmin';

export const metadata = { title: 'Admin · SDV HSS Alumni' };

export default function Page() {
  return (
    <AdminShell tab="gallery">
      <GalleryAdmin />
    </AdminShell>
  );
}
