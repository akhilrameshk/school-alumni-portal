import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DialogProvider } from '@/components/Dialogs';
import { AdsProvider } from '@/components/AdSlot';
import { getActiveAds } from '@/lib/public';
import { ADS } from '@/lib/config';
import SiteTheme from '@/components/SiteTheme';

export const dynamic = 'force-dynamic';

// Ads are only loaded on the public pages (never in /admin).
export default async function SiteLayout({ children }) {
  const ads = await getActiveAds(4);
  return (
    <SiteTheme>
    <AdsProvider ads={ads}>
      <DialogProvider>
        {ADS.client && (
          <Script id="adsense" async strategy="afterInteractive" crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.client}`} />
        )}
        <Navbar />
        <main>{children}</main>
        <Footer />
      </DialogProvider>
    </AdsProvider>
    </SiteTheme>
  );
}
