'use client';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

function left(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return [Math.floor(ms / 864e5), Math.floor((ms % 864e5) / 36e5), Math.floor((ms % 36e5) / 6e4)];
}

// "42 : 06 : 15" shown as digit tiles (days : hours : minutes)
export default function Countdown({ date }) {
  const [t, setT] = useState(null);
  useEffect(() => {
    setT(left(date));
    const id = setInterval(() => setT(left(date)), 30000);
    return () => clearInterval(id);
  }, [date]);
  if (!t) return null;
  const tile = (d, k) => (
    <Box key={k} sx={{ width: { xs: 30, md: 38 }, height: { xs: 42, md: 50 }, borderRadius: 2, bgcolor: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: { xs: 24, md: 30 }, fontWeight: 600 }}>{d}</Box>
  );
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center', alignItems: 'center' }}>
        {t.map((n, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
            {i > 0 && <Typography sx={{ fontSize: 26, mx: 0.5 }}>:</Typography>}
            {String(n).padStart(2, '0').split('').map((d, j) => tile(d, j))}
          </Box>
        ))}
      </Box>
      <Typography sx={{ mt: 1, fontSize: 13, opacity: 0.7 }}>Days : Hours : Minutes</Typography>
    </Box>
  );
}
