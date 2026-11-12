import AdminShell from '@/components/admin/AdminShell';
import EventsAdmin from '@/components/admin/EventsAdmin';

export const metadata = { title: 'Admin · SDV HSS Alumni' };

export default function Page() {
  return (
    <AdminShell tab="events">
      <EventsAdmin />
    </AdminShell>
  );
}
