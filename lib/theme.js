import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1f6b3a' },
    secondary: { main: '#f5c84c', contrastText: '#1b1206' },
    background: { default: '#f7f5ee' },
    text: { primary: '#22302a' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'var(--font-work), Arial, sans-serif',
    h1: { fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 700 },
    h3: { fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 700 },
    h4: { fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 700 },
    h5: { fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { html: { scrollBehavior: 'smooth' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
  },
});

export default theme;
