import EventsView from '@/components/EventsView';
import { getEventsData } from '@/lib/public';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Events · SDV HSS Alumni' };

export default async function Page() {
  return <EventsView {...(await getEventsData())} />;
}
