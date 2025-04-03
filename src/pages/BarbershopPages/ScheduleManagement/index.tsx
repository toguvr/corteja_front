import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../../services/api';
import { useBarbershop } from '../../../hooks/barbershop';

const weekDays = [
  { label: 'Segunda-feira', value: '1' },
  { label: 'Terça-feira', value: '2' },
  { label: 'Quarta-feira', value: '3' },
  { label: 'Quinta-feira', value: '4' },
  { label: 'Sexta-feira', value: '5' },
  { label: 'Sábado', value: '6' },
  { label: 'Domingo', value: '0' },
];

export default function ScheduleManagement() {
  const { barbershop } = useBarbershop();
  const [schedules, setSchedules] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [form, setForm] = useState({ weekDay: '', time: '', limit: 1 });
  const [bulkForm, setBulkForm] = useState({
    weekDay: '',
    start: '',
    end: '',
    interval: 15,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (barbershop?.id) {
      fetchBarbers();
    }
  }, [barbershop]);

  useEffect(() => {
    if (barbershop?.id && selectedBarberId) {
      fetchSchedules();
    }
  }, [barbershop, selectedBarberId]);

  const fetchBarbers = async () => {
    const { data } = await api.get(`/barbers/barbershop/${barbershop?.id}`);
    setBarbers(data);
  };

  const fetchSchedules = async () => {
    const { data } = await api.get(
      `/schedules/barbershop/${barbershop?.id}/barber/${selectedBarberId}`
    );
    setSchedules(data);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBulkChange = (e) => {
    setBulkForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSchedule = async () => {
    const payload = [
      {
        ...form,
        barbershopId: barbershop?.id,
        barberId: selectedBarberId,
      },
    ];
    await api.post('/schedules', payload);
    fetchSchedules();
    setForm({ weekDay: '', time: '', limit: 1 });
  };

  const handleDelete = async (id) => {
    await api.delete(`/schedules/${id}`);
    fetchSchedules();
  };

  const generateBulkSchedules = () => {
    const { weekDay, start, end, interval } = bulkForm;
    if (!weekDay || !start || !end || !interval) return [];

    const result = [];
    let current = dayjs(`2020-01-01T${start}`);
    const endTime = dayjs(`2020-01-01T${end}`);

    while (current.isBefore(endTime)) {
      result.push({
        weekDay,
        time: current.format('HH:mm'),
        limit: 1,
        barbershopId: barbershop.id,
        barberId: selectedBarberId,
      });
      current = current.add(interval, 'minute');
    }

    return result;
  };

  const handleSaveBulk = async () => {
    const bulk = generateBulkSchedules();
    if (bulk.length) {
      await api.post('/schedules', bulk);
      fetchSchedules();
      setBulkForm({ weekDay: '', start: '', end: '', interval: 15 });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" mt={4} mb={2}>
        Horários da Barbearia
      </Typography>

      <TextField
        select
        label="Profissional"
        value={selectedBarberId}
        onChange={(e) => setSelectedBarberId(e.target.value)}
        fullWidth
        sx={{ mb: 4 }}
      >
        {barbers.map((barber) => (
          <MenuItem key={barber.id} value={barber.id}>
            {barber.name}
          </MenuItem>
        ))}
      </TextField>

      <Grid container spacing={2}>
        {schedules.map((s) => (
          <Grid item xs={6} sm={4} key={s.id}>
            <Paper elevation={2} style={{ padding: 12 }}>
              <Typography variant="subtitle2">
                {weekDays.find((d) => d.value === s.weekDay)?.label}
              </Typography>
              <Typography>{s.time}</Typography>
              <Typography fontSize={12}>Limite: {s.limit}</Typography>
              <IconButton onClick={() => handleDelete(s.id)}>
                <Delete />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h6">Adicionar horário manual</Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              name="weekDay"
              label="Dia da semana"
              value={form.weekDay}
              onChange={handleChange}
              fullWidth
            >
              {weekDays.map((d) => (
                <MenuItem key={d.value} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              name="time"
              label="Hora (HH:mm)"
              value={form.time}
              onChange={handleChange}
              fullWidth
              placeholder="00:00"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              name="limit"
              label="Limite"
              type="number"
              value={form.limit}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSchedule}
          sx={{ mt: 2 }}
        >
          Adicionar
        </Button>
      </Box>

      <Box mt={6}>
        <Typography variant="h6">Gerar horários automaticamente</Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              name="weekDay"
              label="Dia da semana"
              value={bulkForm.weekDay}
              onChange={handleBulkChange}
              fullWidth
            >
              {weekDays.map((d) => (
                <MenuItem key={d.value} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              name="start"
              label="Início (HH:mm)"
              value={bulkForm.start}
              onChange={handleBulkChange}
              fullWidth
              placeholder="00:00"
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              name="end"
              label="Fim (HH:mm)"
              value={bulkForm.end}
              onChange={handleBulkChange}
              fullWidth
              placeholder="00:00"
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              name="interval"
              label="Intervalo (min)"
              type="number"
              value={bulkForm.interval}
              onChange={handleBulkChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleSaveBulk}
          sx={{ mt: 2 }}
        >
          Gerar horários
        </Button>
      </Box>
    </Container>
  );
}
