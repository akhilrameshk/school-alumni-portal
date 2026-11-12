import AdminShell from '@/components/admin/AdminShell';
import MembersView from '@/components/admin/MembersView';

export const metadata = { title: 'Admin · SDV HSS Alumni' };

export default function Page() {
  return (
    <AdminShell tab="members">
      <MembersView />
    </AdminShell>
  );
}
