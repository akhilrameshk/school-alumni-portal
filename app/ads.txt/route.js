import { ADS } from '@/lib/config';

// Google asks for /ads.txt. It is generated from NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-XXXX -> pub-XXXX).
export function GET() {
  if (!ADS.client) return new Response('# AdSense is not configured\n', { status: 404 });
  return new Response(`google.com, ${ADS.client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
