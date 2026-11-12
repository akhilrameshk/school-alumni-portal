import { createTheme } from '@mui/material/styles';

const serif = 'var(--font-fraunces), Georgia, serif';
const heading = { fontFamily: serif, fontWeight: 700 };

// Dark green + gold theme used by the public website (the admin keeps the light theme).
export default createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2a7d4a' },
    secondary: { main: '#e0b43e', contrastText: '#1b1606' },
    background: { default: '#0a2015', paper: '#133a25' },
    text: { primary: '#f2efe3', secondary: 'rgba(242,239,227,.72)' },
    divider: 'rgba(150,200,170,.3)',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'var(--font-work), Arial, sans-serif',
    h1: heading, h2: heading, h3: heading, h4: heading, h5: heading, h6: heading,
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { html: { scrollBehavior: 'smooth' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: 'rgba(0,0,0,.18)' } } },
    MuiDialog: { styleOverrides: { paper: { backgroundImage: 'none', border: '1px solid rgba(150,200,170,.3)' } } },
  },
});
