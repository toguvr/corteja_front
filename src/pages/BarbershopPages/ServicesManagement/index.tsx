import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Delete, Add, Edit } from '@mui/icons-material';
import { useBarbershop } from '../../../hooks/barbershop';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { theme } from '../../../theme';

export default function ServicesManagement() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { barbershop } = useBarbershop();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    timeRequired: '',
    amount: '',
  });

  useEffect(() => {
    if (barbershop?.id) fetchServices();
  }, [barbershop]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/services/barbershop/${barbershop.id}`);
      setServices(data);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (service = null) => {
    if (service) {
      setEditingId(service.id);
      setForm({
        name: service.name || '',
        description: service.description || '',
        timeRequired: service.timeRequired || '',
        amount: service.amount || '',
      });
    } else {
      setEditingId(null);
      setForm({ name: '', description: '', timeRequired: '', amount: '' });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm({ name: '', description: '', timeRequired: '', amount: '' });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMaskedTime = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length >= 3) {
      formatted = `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
    }
    setForm((prev) => ({ ...prev, timeRequired: formatted }));
  };

  const formatCurrency = (value) => {
    const cents = Number(value || 0);
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleMoneyChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    const cents = Number(raw);
    setForm((prev) => ({
      ...prev,
      amount: isNaN(cents) ? '' : cents,
    }));
  };

  const handleSubmit = async () => {
    const { name, description, timeRequired, amount } = form;

    if (!name || !amount) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (editingId) {
        await api.patch(`/services/${editingId}`, {
          name,
          description,
          timeRequired: String(timeRequired || 1),
          amount: form.passFeeToClient
            ? form.amount
            : Math.round(form.amount / (1 + barbershop.fee / 100)),
        });
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await api.post('/services', {
          name,
          description,
          timeRequired,
          amount: form.passFeeToClient
            ? form.amount
            : Math.round(form.amount / (1 + barbershop.fee / 100)),
          barbershopId: barbershop?.id,
        });
        toast.success('Serviço cadastrado com sucesso!');
      }

      closeDialog();
      fetchServices();
    } catch (err) {
      toast.error('Erro ao salvar serviço.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      'Tem certeza que deseja excluir este serviço?'
    );
    if (!confirm) return;

    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch {
      toast.error('Erro ao excluir serviço.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" mt={4} mb={2}>
        Serviços da Barbearia
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => openDialog()}
      >
        Novo Serviço
      </Button>

      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : services.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <Typography variant="subtitle1">Nenhum serviço encontrado</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {services.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography fontWeight={600}>{s.name}</Typography>
                <Typography>
                  Valor:{' '}
                  {(s.amount / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <IconButton onClick={() => openDialog(s)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(s.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? 'Editar Serviço' : 'Novo Serviço'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nome do serviço"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Valor base (sem taxa)"
                value={formatCurrency(form.amount)}
                onChange={handleMoneyChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.passFeeToClient || false}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        passFeeToClient: e.target.checked,
                      }))
                    }
                  />
                }
                label={`Repassar a taxa de ${barbershop?.fee}% para o cliente`}
              />
            </Grid>

            {form.amount && (
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Resumo para o cliente:
                  </Typography>

                  <Typography>
                    Total para o cliente: {formatCurrency(form.amount)}
                  </Typography>

                  <Typography>
                    Taxa de processamento ({barbershop?.fee}%):{' '}
                    {form.passFeeToClient
                      ? formatCurrency(
                          Math.round(form.amount * (barbershop.fee / 100))
                        )
                      : formatCurrency(
                          Math.round(
                            form.amount -
                              form.amount / (1 + barbershop.fee / 100)
                          )
                        )}
                  </Typography>

                  <Typography fontWeight="bold">
                    Você receberá:{' '}
                    {formatCurrency(
                      form.passFeeToClient
                        ? form.amount
                        : Math.round(form.amount / (1 + barbershop.fee / 100))
                    )}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
