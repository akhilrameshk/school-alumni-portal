'use client';
import { createContext, useContext, useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { ADS } from '@/lib/config';
import { cld } from '@/lib/format';

// Direct sponsor banners (managed in Admin -> Advertisements) are passed in by the site layout.
const AdsContext = createContext([]);
export function AdsProvider({ ads, children }) {
  return <AdsContext.Provider value={ads}>{children}</AdsContext.Provider>;
}

function GoogleAd({ slot, rect }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* ad blocked */ }
  }, []);
  return (
    <ins className="adsbygoogle" data-ad-client={ADS.client} data-ad-slot={slot}
      data-ad-format={rect ? 'rectangle' : 'horizontal'} data-full-width-responsive="true"
      style={{ display: 'block', width: '100%', minHeight: rect ? 250 : 90 }} />
  );
}

/**
 * One ad spot. Order of preference: sponsor banner n, then a Google ad, then (testing only) a placeholder.
 * page = key in ADS.perPage, n = spot number 1..4, rect = 300x250 box, bare = no outer container.
 */
export default function AdSlot({ page, n, rect = false, bare = false, flush = false }) {
  const ads = useContext(AdsContext);
  if (n > (ADS.perPage[page] ?? 4)) return null;

  const direct = ads[n - 1];
  const slot = rect ? ADS.slotRect : ADS.slotBanner;
  let inner = null;
  if (direct) {
    const img = <Box component="img" src={cld(direct.imageUrl, 1000)} alt={direct.name} sx={{ width: '100%', display: 'block', borderRadius: 3, border: '1px solid #e0b43e', maxHeight: rect ? 250 : 120, objectFit: 'cover' }} />;
    inner = direct.link ? <a href={direct.link} target="_blank" rel="noopener noreferrer sponsored">{img}</a> : img;
  } else if (ADS.client && slot) {
    inner = <GoogleAd slot={slot} rect={rect} />;
  } else if (ADS.showPlaceholders) {
    inner = (
      <Box sx={{ height: rect ? 250 : { xs: 100, md: 90 }, border: '1.5px dashed rgba(255,255,255,.25)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.55)', fontWeight: 600,
        background: 'repeating-linear-gradient(45deg,rgba(255,255,255,.04),rgba(255,255,255,.04) 10px,rgba(255,255,255,.08) 10px,rgba(255,255,255,.08) 20px)' }}>
        Ad space {rect ? '300×250' : '728×90'}
      </Box>
    );
  }
  if (!inner) return null;

  const body = (
    <Box sx={{ maxWidth: rect ? 300 : 728, mx: 'auto', mt: bare && !flush ? 4 : 0 }}>
      <Typography sx={{ fontSize: 11, letterSpacing: '.14em', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', textAlign: 'center', mb: 0.75 }}>Advertisement</Typography>
      {inner}
    </Box>
  );
  return bare ? body : <Container maxWidth="lg" sx={{ pt: 3.5 }}>{body}</Container>;
}
