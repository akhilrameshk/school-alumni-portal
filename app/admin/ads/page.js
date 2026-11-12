import AdminShell from '@/components/admin/AdminShell';
import AdsAdmin from '@/components/admin/AdsAdmin';

export const metadata = { title: 'Admin · SDV HSS Alumni' };

export default function Page() {
  return (
    <AdminShell tab="ads">
      <AdsAdmin />
    </AdminShell>
  );
}
