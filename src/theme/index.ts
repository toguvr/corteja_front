import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#101F2C', // Azul-marinho profundo — base sólida, tecnológica
      light: '#333C4A', // Azul acinzentado mais claro, ótimo para fundo ou hover
      dark: '#0B1621', // Um azul ainda mais escuro, quase preto
      contrastText: '#FFFFFF', // Branco para garantir boa leitura
    },
    secondary: {
      main: '#FF671D', // Laranja escuro vibrante — agora como cor principal
      light: '#FFA05E', // Versão mais clara e suave do laranja
      dark: '#C74300', // Um tom ainda mais profundo e queimado do laranja
      contrastText: '#FFFFFF', // Branco para contraste em fundo escuro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
  },
});
