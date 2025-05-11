import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Box,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  AlertTitle,
} from '@mui/material';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/auth';
import { toast } from 'react-toastify';

export default function RecipientBalancePage() {
  const [balance, setBalance] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchBalance = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get(`/payments/barbershop`);
      setBalance(data);
    } catch (err) {
      toast.error('Erro ao buscar o saldo do recebedor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async (page = 1, append = false) => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get(
        `/payments/barbershop/withdrawals?page=${page}`
      );
      setWithdrawals((prev) => (append ? [...prev, ...data.data] : data.data));
      setHasMore(!!data.paging?.next);
      setCurrentPage(page);
    } catch (err) {
      toast.error('Erro ao buscar o histórico de saques.');
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchWithdrawals();
  }, [isAuthenticated]);

  const handleWithdrawRequest = () => {
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      await api.post('/payments/barbershop/withdraw', {
        amount: parseInt(withdrawAmount.replace(/\D/g, ''), 10),
      });
      toast.success('Saque solicitado com sucesso!');
      setWithdrawDialogOpen(false);
      setWithdrawAmount('');
      fetchBalance();
      fetchWithdrawals();
    } catch (err) {
      toast.error('Erro ao solicitar saque.');
    }
  };

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
      <Alert severity="info" sx={{ mb: 4 }}>
        <AlertTitle>Importante sobre o saque</AlertTitle>
        <strong>
          Cada saque possui uma taxa fixa de R$ 3,67, referente à operação
          bancária.
        </strong>
        <br />A transferência ocorre via TED comum, ou seja, será efetivada
        apenas em dias úteis.
      </Alert>
      <Typography variant="h5" mt={4} mb={2}>
        Extrato Financeiro
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleWithdrawRequest}
            >
              Solicitar Saque
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Histórico de Saques
      </Typography>
      {withdrawals.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          Nenhum saque realizado ainda.
        </Typography>
      ) : (
        <>
          <Paper variant="outlined">
            <List>
              {withdrawals.map((item, index) => (
                <React.Fragment key={item.id || index}>
                  <ListItem>
                    <ListItemText
                      primary={` ${(item.amount / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })} - ${new Date(item.created_at).toLocaleString('pt-BR')}`}
                      secondary={
                        item.status === 'failed'
                          ? 'falha'
                          : item.status === 'pending'
                            ? 'pendente'
                            : 'concluído'
                      }
                      secondaryTypographyProps={{
                        color:
                          item.status === 'failed'
                            ? 'red'
                            : item.status === 'pending'
                              ? 'orange'
                              : 'green',
                        fontWeight: 'bold',
                      }}
                    />
                  </ListItem>
                  {index < withdrawals.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          {hasMore && (
            <Box textAlign="center" p={2}>
              <Button
                variant="outlined"
                onClick={() => fetchWithdrawals(currentPage + 1, true)}
              >
                Carregar mais
              </Button>
            </Box>
          )}
        </>
      )}

      <Dialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
      >
        <DialogTitle>Solicitar Saque</DialogTitle>
        <DialogContent>
          <TextField
            label="Valor do saque"
            fullWidth
            autoFocus
            value={withdrawAmount}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              const formatted = (Number(onlyNumbers) / 100).toLocaleString(
                'pt-BR',
                {
                  style: 'currency',
                  currency: 'BRL',
                }
              );
              setWithdrawAmount(formatted);
            }}
            placeholder="R$ 0,00"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleWithdrawConfirm}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
