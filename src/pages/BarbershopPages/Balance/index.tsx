import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import api from '../../../services/api'; // ajuste conforme sua estrutura
import { useAuth } from '../../../hooks/auth';

export default function RecipientBalancePage() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth(); // ajuste conforme sua estrutura
  useEffect(() => {
    const fetchBalance = async () => {
      if (!isAuthenticated) return;
      try {
        const { data } = await api.get(`/payments/barbershop`);
        setBalance(data);
      } catch (err) {
        setError('Erro ao buscar o saldo do recebedor.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mt={4} mb={2}>
        Extrato Financeiro
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Saldo Disponível</Typography>
            <Typography variant="h6">
              {(balance?.available_amount / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">
              A Receber (Próximos dias)
            </Typography>
            <Typography variant="h6">
              {(balance?.waiting_funds_amount / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Saldo Transferido</Typography>
            <Typography variant="h6">
              {(balance?.transferred_amount / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
