import { Fraunces, Work_Sans } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeRegistry from '@/components/ThemeRegistry';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const work = Work_Sans({ subsets: ['latin'], variable: '--font-work', display: 'swap' });

export const metadata = {
  title: 'SDV HSS Alumni Association',
  description: 'Samanvayam – the home of every SDV HSS alumnus.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${work.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
