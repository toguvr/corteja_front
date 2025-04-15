import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../../services/api';
import { useBarbershop } from '../../../hooks/barbershop';
import { toast } from 'react-toastify';

const weekDays = [
  { label: 'Domingo', value: '0' },
  { label: 'Segunda-feira', value: '1' },
  { label: 'Terça-feira', value: '2' },
  { label: 'Quarta-feira', value: '3' },
  { label: 'Quinta-feira', value: '4' },
  { label: 'Sexta-feira', value: '5' },
  { label: 'Sábado', value: '6' },
];

export default function ScheduleManagement() {
  const { barbershop } = useBarbershop();
  const [schedules, setSchedules] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [form, setForm] = useState({ weekDay: '', time: '', limit: 1 });
  const [bulkForm, setBulkForm] = useState({
    weekDay: '',
    start: '',
    end: '',
    interval: 40,
    limit: 1,
  });
  const [selectedWeekDay, setSelectedWeekDay] = useState('');
  const [mode, setMode] = useState('manual');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (barbershop?.id) fetchBarbers();
  }, [barbershop]);

  useEffect(() => {
    if (barbershop?.id && selectedBarberId) fetchSchedules();
  }, [barbershop, selectedBarberId]);

  const fetchBarbers = async () => {
    const { data } = await api.get(`/barbers/barbershop/${barbershop?.id}`);
    setBarbers(data);
  };
  const handleMaskedTimeChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
    let formatted = rawValue;

    if (rawValue.length >= 3) {
      formatted = `${rawValue.slice(0, 2)}:${rawValue.slice(2, 4)}`;
    }
    if (mode === 'bulk') {
      setBulkForm((prev) => ({
        ...prev,
        [e.target.name]: formatted,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: formatted,
      }));
    }
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
    if (!selectedBarberId) {
      toast.error('Selecione um profissional antes de adicionar o horário.');
      return;
    }
    setLoading(true);
    const payload = [
      {
        ...form,
        barbershopId: barbershop?.id,
        barberId: selectedBarberId,
      },
    ];
    try {
      await api.post('/schedules', payload);
      fetchSchedules();
      setForm({ weekDay: '', time: '', limit: 1 });
    } finally {
      setLoading(false);
    }
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
    if (!selectedBarberId) {
      toast.error('Selecione um profissional antes de adicionar o horário.');
      return;
    }
    setLoading(true);
    try {
      const bulk = generateBulkSchedules();
      if (bulk.length) {
        await api.post('/schedules', bulk);
        fetchSchedules();
      }
    } finally {
      setLoading(false);
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

      {selectedBarberId && (
        <>
          <Typography variant="h6" mt={4} mb={2}>
            Selecione o dia da semana
          </Typography>

          <ToggleButtonGroup
            value={selectedWeekDay}
            exclusive
            onChange={(e, newVal) => {
              if (newVal !== null) {
                setSelectedWeekDay(newVal);
                setBulkForm({ ...bulkForm, weekDay: newVal });
                setForm({ ...form, weekDay: newVal });
              }
            }}
            fullWidth
            sx={{ mb: 3, flexWrap: 'wrap' }}
          >
            {weekDays.map((d) => (
              <ToggleButton
                key={d.value}
                value={d.value}
                sx={{ flex: 1, minWidth: 100 }}
              >
                {d.label.split('-')[0]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {selectedWeekDay && (
            <>
              <Grid container spacing={2}>
                {schedules
                  .filter((s) => s.weekDay === selectedWeekDay)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((s) => (
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
                <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
                  <Button
                    variant={mode === 'manual' ? 'contained' : 'outlined'}
                    onClick={() => setMode('manual')}
                  >
                    Adição Manual
                  </Button>
                  <Button
                    variant={mode === 'bulk' ? 'contained' : 'outlined'}
                    onClick={() => setMode('bulk')}
                  >
                    Adição Automática
                  </Button>
                </ButtonGroup>

                {mode === 'manual' ? (
                  <Box>
                    <Typography variant="h6">
                      Adicionar horário manual
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="time"
                          label="Hora (HH:mm)"
                          value={form.time}
                          onChange={handleMaskedTimeChange}
                          fullWidth
                          placeholder="00:00"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="limit"
                          label="Quantos por horário"
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
                      loading={loading}
                      onClick={handleAddSchedule}
                      sx={{ mt: 2 }}
                      fullWidth={isMobile}
                    >
                      Adicionar
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6">
                      Gerar horários automaticamente
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          name="start"
                          label="Início (HH:mm)"
                          value={bulkForm.start}
                          onChange={handleMaskedTimeChange}
                          fullWidth
                          placeholder="00:00"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          name="end"
                          label="Fim (HH:mm)"
                          value={bulkForm.end}
                          onChange={handleMaskedTimeChange}
                          fullWidth
                          placeholder="00:00"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          name="interval"
                          label="Intervalo (min)"
                          type="number"
                          value={bulkForm.interval}
                          onChange={handleBulkChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="limit"
                          label="Quantos por horário"
                          type="number"
                          value={bulkForm.limit}
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
                      loading={loading}
                      fullWidth={isMobile}
                    >
                      Gerar horários
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </Container>
  );
}
