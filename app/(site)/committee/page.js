import CommitteeView from '@/components/CommitteeView';
import { getCommitteeTree } from '@/lib/public';
import './tree.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Executive Committee · SDV HSS Alumni' };

export default async function Page() {
  return <CommitteeView root={await getCommitteeTree()} />;
}
