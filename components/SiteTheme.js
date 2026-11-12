'use client';
import { ThemeProvider } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import theme from '@/lib/siteTheme';

export default function SiteTheme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: { background: 'linear-gradient(180deg,#0a2015 0%,#0e2b1c 50%,#0a2015 100%)', color: '#f2efe3' } }} />
      {children}
    </ThemeProvider>
  );
}
