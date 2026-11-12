import { Box } from '@mui/material';

const paths = {
  cal: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.5 2.8-6 6-6s6 2.5 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M16 14.3c3 .2 5 2.3 5 5.2" /></>,
  bell: <><path d="M6 17h12l-1.6-2.4V10a4.4 4.4 0 0 0-8.8 0v4.6z" /><path d="M10 20h4" /></>,
  img: <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="M4 18l5-5 4 4 3-3 4 4" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 7l8 6 8-6" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  filter: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
};

export function Icon({ name, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// rounded square holding an icon (gold on translucent green)
export function IconBox({ name, size = 44 }) {
  return (
    <Box sx={{ width: size, height: size, borderRadius: 3, bgcolor: 'rgba(255,255,255,.08)', border: '1px solid', borderColor: 'divider', color: 'secondary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <Icon name={name} />
    </Box>
  );
}

export function Person({ size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <circle cx="32" cy="24" r="11" fill="#e8b48a" /><path d="M8 64c2-16 12-22 24-22s22 6 24 22z" fill="#25364a" /><path d="M26 42l6 8 6-8" fill="#fff" />
    </svg>
  );
}

export function Mountain({ width = 68, height = 44, color = '#7e9a86' }) {
  return (
    <svg viewBox="0 0 120 80" width={width} height={height} fill={color}><circle cx="82" cy="24" r="9" /><path d="M6 70l32-34 22 22 16-16 38 28z" /></svg>
  );
}
