// Batches grow by themselves: the latest batch is last year's (so 2000..2025 in 2026, 2000..2026 from January 2027).
// Override with NEXT_PUBLIC_FIRST_BATCH / NEXT_PUBLIC_LAST_BATCH in the environment if needed.
const THIS_YEAR = new Date().getFullYear();
export const FIRST_BATCH = Number(process.env.NEXT_PUBLIC_FIRST_BATCH || 2000);
export const LAST_BATCH = Number(process.env.NEXT_PUBLIC_LAST_BATCH || THIS_YEAR - 1);
export const BATCHES = Array.from({ length: LAST_BATCH - FIRST_BATCH + 1 }, (_, i) => FIRST_BATCH + i);

export const FEES = {
  registration: Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE_INR || 100),
  renewal: Number(process.env.NEXT_PUBLIC_RENEWAL_FEE_INR || 100),
};

export const MEMBERSHIP_DAYS = Number(process.env.NEXT_PUBLIC_MEMBERSHIP_DAYS || 365); // validity added by every payment

export const SITE = {
  name: 'SDV HSS Alumni Association',
  short: 'SDV HSS Alumni',
  address: 'School address line, Alappuzha, Kerala',
  phone: '+91 00000 00000',
  email: 'email@example.com',
};

export const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Committee', short: 'Team', href: '/committee' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

// Executive committee as a tree: 11 members. Replace names (and optional photo URLs).
export const COMMITTEE = {
  name: 'Name', role: 'President', tier: 'top',
  children: [
    { name: 'Name', role: 'Vice President', tier: 'mid', children: [
      { name: 'Name', role: 'Executive Member' }, { name: 'Name', role: 'Executive Member' } ] },
    { name: 'Name', role: 'Secretary', tier: 'mid', children: [
      { name: 'Name', role: 'Joint Secretary' }, { name: 'Name', role: 'Executive Member' }, { name: 'Name', role: 'Executive Member' } ] },
    { name: 'Name', role: 'Treasurer', tier: 'mid', children: [
      { name: 'Name', role: 'Executive Member' }, { name: 'Name', role: 'Executive Member' } ] },
  ],
};

// Google AdSense. Leave NEXT_PUBLIC_ADSENSE_CLIENT empty to switch Google ads off.
// perPage = how many of the 4 ad spots each page shows (4 = all). Short pages look better with fewer.
export const ADS = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',            // e.g. ca-pub-1234567890123456
  slotBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || '',   // ad unit id for the wide banners
  slotRect: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECT || '',       // ad unit id for the 300x250 box
  showPlaceholders: process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === 'true', // dashed boxes while testing
  perPage: { home: 4, about: 4, events: 4, committee: 2, gallery: 4, contact: 2 },
};
