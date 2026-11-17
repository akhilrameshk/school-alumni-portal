'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Box, Container } from '@mui/material';
import { ADS } from '@/lib/config';
import { cld } from '@/lib/format';

// Direct sponsor banners (managed in Admin -> Advertisements) are passed in by the site layout.
const AdsContext = createContext([]);
export function AdsProvider({ ads, children }) {
  return <AdsContext.Provider value={ads}>{children}</AdsContext.Provider>;
}

// ചെറിയ, അദൃശ്യമായ രീതിയിലുള്ള Google Ad (ബോർഡറോ ലേബലോ ഇല്ലാതെ)
export function SubtleGoogleAd({ slot }) {
  const pushed = useRef(false);
  const adSlot = slot || ADS.slotBanner;

  useEffect(() => {
    if (pushed.current || !ADS.client || !adSlot) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      /* ad blocked */
    }
  }, [adSlot]);

  if (!ADS.client || !adSlot) return null;

  return (
    <Box
      sx={{
        my: 1.5,
        mx: 'auto',
        maxWidth: 728,
        width: '100%',
        maxHeight: 55, // വളരെ ചെറിയ ഉയരം മാത്രം
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9,
        '&:empty': { display: 'none' }, // ആഡ് ലോഡ് ആയില്ലെങ്കിൽ സ്പേസ് തീരെ എടുക്കില്ല
      }}
    >
      <ins
        className="adsbygoogle"
        data-ad-client={ADS.client}
        data-ad-slot={adSlot}
        style={{ display: 'inline-block', width: '100%', height: '50px' }}
      />
    </Box>
  );
}

/**
 * Local Sponsor Banner with 15s rotation & unique ads per slot.
 * page = key in ADS.perPage, n = spot number 1..4, rect = box format, bare = no outer container.
 */
export default function AdSlot({ page, n, rect = false, bare = false, flush = false }) {
  const ads = useContext(AdsContext);
  const [tick, setTick] = useState(0);

  // 15 സെക്കൻഡ് കൂടുമ്പോൾ ആഡ് മാറാനുള്ള ടൈമർ
  useEffect(() => {
    if (!ads || ads.length <= 1) return;
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, [ads]);

  if (n > (ADS.perPage[page] ?? 4)) return null;

  // ഒരേ സമയം വ്യത്യസ്ത സ്ലോട്ടുകളിൽ (n=1, n=2, n=3) വ്യത്യസ്ത ആഡുകൾ കാണിക്കാൻ
  const direct = ads && ads.length > 0 ? ads[(tick + (n - 1)) % ads.length] : null;

  let inner = null;
  if (direct) {
    const img = (
      <Box
  component="img"
  src={cld(direct.imageUrl, 1000)}
  alt={direct.name || 'Partner'}
  sx={{
    width: 'auto',
    maxWidth: '100%', // മൊബൈലിൽ ഓവർഫ്ലോ ആകാതിരിക്കാൻ
    height: 'auto',
    display: 'block',
    mx: 'auto', // ചിത്രം കൃത്യം സെന്ററിൽ വരാൻ
    borderRadius: 2.5,
    border: '1px solid rgba(224, 180, 62, 0.35)',
    maxHeight: rect ? 180 : { xs: 115, sm: 165, md: 180 },
    objectFit: 'contain',
    bgcolor: 'rgba(0,0,0,0.15)',
    transition: 'opacity 0.4s ease-in-out',
  }}
/>
    );
    inner = direct.link ? (
      <a href={direct.link} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block' }}>
        {img}
      </a>
    ) : (
      img
    );
  } else if (ADS.client) {
    // ലോക്കൽ ആഡ് ഇല്ലെങ്കിൽ ചെറിയ Google Ad കാണിക്കും
    return <SubtleGoogleAd slot={rect ? ADS.slotRect : ADS.slotBanner} />;
  } else if (ADS.showPlaceholders) {
    inner = (
      <Box
        sx={{
          height: rect ? 110 : { xs: 90, md: 110 },
          border: '1px dashed rgba(255,255,255,.2)',
          borderRadius: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,.45)',
          fontSize: 13,
        }}
      >
        Partner Space {n}
      </Box>
    );
  }

  if (!inner) return null;

  const body = (
    <Box sx={{ maxWidth: rect ? 320 : 820, mx: 'auto', mt: bare && !flush ? { xs: 2.5, md: 3.5 } : 0 }}>
      {/* "Advertisement" എന്ന ലേബൽ ഒഴിവാക്കി, ഡിസൈനിനോട് ചേർന്ന് നിൽക്കുന്ന രീതിയിലാക്കി */}
      {inner}
    </Box>
  );

  return bare ? body : <Container maxWidth="lg" sx={{ pt: 3 }}>{body}</Container>;
}