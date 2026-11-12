import HomeView from '@/components/HomeView';
import { getHomeData } from '@/lib/public';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getHomeData();
  return <HomeView {...data} />;
}
