import AdminShell from '@/components/admin/AdminShell';
import CommitteeAdmin from '@/components/admin/CommitteeAdmin';

export const metadata = { title: 'Admin · Committee' };

export default function Page() {
  return (
    <AdminShell tab="committee">
      <CommitteeAdmin />
    </AdminShell>
  );
}
