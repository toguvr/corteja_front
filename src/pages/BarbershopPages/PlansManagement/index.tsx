import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { useBarbershop } from '../../../hooks/barbershop';

export default function PlansManagement() {
  const { barbershop } = useBarbershop();
  const [plans, setPlans] = useState([]);
  const [services, setServices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    serviceId: '',
    interval: 'week',
    price: '',
  });

  useEffect(() => {
    if (barbershop?.id) {
      fetchPlans();
      fetchServices();
    }
  }, [barbershop]);

  const fetchPlans = async () => {
    const { data } = await api.get(`/plans/${barbershop?.id}`);
    setPlans(data);
  };

  const fetchServices = async () => {
    const { data } = await api.get(`/services/barbershop/${barbershop?.id}`);
    setServices(data);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    setForm((prev) => ({ ...prev, price: isNaN(cents) ? '' : cents }));
  };

  const openDialog = (plan = null) => {
    if (plan) {
      setEditingId(plan.id);
      setForm({
        serviceId: plan.serviceId || '',
        interval: plan.interval || 'week',
        price: plan.price || '',
      });
    } else {
      setEditingId(null);
      setForm({ serviceId: '', interval: 'week', price: '' });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm({ serviceId: '', interval: 'week', price: '' });
  };

  const handleSubmit = async () => {
    const { serviceId, interval, price } = form;
    if (!serviceId || !interval || !price) {
      toast.error('Preencha todos os campos.');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/plans/${editingId}`, {
          serviceId,
          interval,
          price: Number(price),
        });
        toast.success('Plano atualizado com sucesso.');
      } else {
        await api.post('/plans', {
          serviceId,
          interval,
          price: Number(price),
          barbershopId: barbershop?.id,
        });
        toast.success('Plano cadastrado com sucesso.');
      }
      closeDialog();
      fetchPlans();
    } catch (err) {
      toast.error('Erro ao salvar plano.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Deseja excluir este plano?');
    if (!confirm) return;
    try {
      await api.delete(`/plans/${id}`);
      fetchPlans();
    } catch {
      toast.error('Erro ao excluir plano.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" mt={4} mb={2}>
        Planos da Barbearia
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => openDialog()}
        sx={{ mb: 3 }}
      >
        Novo Plano
      </Button>

      <Grid container spacing={2}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography fontWeight={600}>
                {services.find((s) => s.id === plan.serviceId)?.name ||
                  'Serviço'}
              </Typography>
              <Typography>Intervalo: {plan.interval}</Typography>
              <Typography>Valor: {formatCurrency(plan.price)}</Typography>
              <Box display="flex" gap={1} mt={1}>
                {/* <IconButton onClick={() => openDialog(plan)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(plan.id)}>
                  <Delete />
                </IconButton> */}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                select
                label="Serviço"
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                fullWidth
              >
                {services.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Intervalo"
                name="interval"
                value={form.interval}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="week">Semanal</MenuItem>
                <MenuItem value="month">Mensal</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Preço"
                value={formatCurrency(form.price)}
                onChange={handleMoneyChange}
                fullWidth
              />
            </Grid>
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
