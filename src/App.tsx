import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './hooks/index';
import { theme } from './theme';
import AppRouter from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <AppRouter />
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
