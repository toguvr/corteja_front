import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import api from '../../services/api';
import PrivateLayout from '../../components/PrivateLayout';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ScheduleList from './schedules';
import { useBarbershop } from '../../hooks/barbershop';
import { toast } from 'react-toastify';
import { useBarbershopServices } from '../../hooks/service';
import { useBalance } from '../../hooks/balance';

export default function CustomerAppointment() {
  const { barbershop } = useBarbershop();
  const { fetchBalance } = useBalance();
  const { services } = useBarbershopServices();
  const [form, setForm] = useState({
    barberId: '',
    barbershopId: barbershop?.id,
    scheduleId: '',
    serviceId: '',
    date: dayjs().format('YYYY-MM-DDTHH:mm'),
  });
  const [barbers, setBarbers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  useEffect(() => {
    if (barbershop?.id) {
      setForm({ ...form, barbershopId: barbershop?.id });
      api.get(`/barbers/barbershop/${barbershop?.id}`).then(({ data }) => {
        setBarbers(data);
        if (data.length === 1) {
          setForm((prev) => ({
            ...prev,
            barberId: data[0].id,
          }));
        }
      });
    }
  }, [barbershop?.id]);
  const getSchedules = async () => {
    setLoading(true);

    api
      .get(`/schedules/barbershop/${barbershop?.id}/barber/${form?.barberId}`)
      .then(({ data }) => setSchedules(data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (form?.barberId && barbershop?.id) {
      getSchedules();
    }
  }, [barbershop?.id, form?.barberId]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = () => {
    setConfirmOpen(true);
  };
  const handleConfirmSubmit = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      await api.post('/appointments', {
        ...form,
        date: new Date(form.date).toISOString(),
      });
      getSchedules();
      fetchBalance();
      toast.success('Agendamento criado com sucesso!');
    } catch (err) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message || 'Erro ao fazer login'
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSelectSchedule = (schedule) => {
    const [hour, minute] = schedule.time?.split(':') ?? ['00', '00'];
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

    setForm((prev) => ({
      ...prev,
      scheduleId: schedule.id,
      date: dayjs(updatedDate).format('YYYY-MM-DDTHH:mm'),
    }));
  };
  const realToday = new Date();
  realToday.setHours(0, 0, 0, 0);

  const getStartOfWeek = (referenceDate: Date) => {
    const day = referenceDate.getDay(); // 0 = domingo
    const start = new Date(referenceDate);
    start.setDate(referenceDate.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getNextWeekStart = (current: Date) => {
    const next = new Date(current);
    next.setDate(current.getDate() + 7);
    return getStartOfWeek(next);
  };

  const currentWeekStart = getStartOfWeek(realToday);
  const nextWeekStart = getNextWeekStart(realToday);
  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [selectedDate, setSelectedDate] = useState(realToday);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const generateWeek = (start: Date) => {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      day.setHours(0, 0, 0, 0);
      week.push(day);
    }
    return week;
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isBeforeToday = (date: Date) => date < realToday;
  const numberOfWeeks = barbershop?.weeksToSchedule;
  const canGoBack = weekStart.getTime() > currentWeekStart.getTime();

  const canGoForward =
    weekStart.getTime() <
    getStartOfWeek(
      new Date(
        realToday.getTime() + (numberOfWeeks - 1) * 7 * 24 * 60 * 60 * 1000
      )
    ).getTime();

  const handleNextWeek = () => {
    if (canGoForward) {
      const newWeekStart = getNextWeekStart(weekStart);
      setWeekStart(newWeekStart);

      // Seleciona o primeiro dia da nova semana (domingo)
      setSelectedDate(new Date(newWeekStart));
    }
  };

  const handlePreviousWeek = () => {
    if (canGoBack) {
      const newWeekStart = new Date(weekStart);
      newWeekStart.setDate(weekStart.getDate() - 7);
      const startOfNewWeek = getStartOfWeek(newWeekStart);
      setWeekStart(startOfNewWeek);

      // Seleciona o último dia da nova semana (sábado)
      const saturday = new Date(startOfNewWeek);
      saturday.setDate(startOfNewWeek.getDate() + 6);
      setSelectedDate(saturday);
    }
  };

  const daysToShow = generateWeek(weekStart);
  return (
    <PrivateLayout>
      <Box sx={{ alignSelf: 'center', flexDirection: 'column', width: '100%' }}>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Profissional"
              name="barberId"
              value={form.barberId}
              onChange={handleChange}
            >
              {barbers.map((barber) => (
                <MenuItem key={barber?.id} value={barber?.id}>
                  {barber?.name || 'Sem nome'}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Serviço"
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
            >
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {`${service.name} - ${(service.amount
                    ? Number(service.amount) / 100
                    : 0
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <IconButton onClick={handlePreviousWeek} disabled={!canGoBack}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <Typography variant="subtitle2">
              {selectedDate.toLocaleString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </Typography>

            <IconButton onClick={handleNextWeek} disabled={!canGoForward}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>

          <Grid container spacing={1}>
            {daysToShow.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const disabled = isBeforeToday(date);

              return (
                <Grid item xs={1.7} key={date.toDateString()}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Typography
                      variant="caption"
                      align="center"
                      display="block"
                    >
                      {weekDays[date.getDay()]}
                    </Typography>
                    <Button
                      fullWidth
                      variant={isSelected ? 'contained' : 'outlined'}
                      disabled={disabled}
                      onClick={() => setSelectedDate(date)}
                      sx={{
                        borderRadius: '50%',
                        minWidth: 0,
                        width: 40,
                        height: 40,
                        padding: 0,
                        marginTop: '2px',
                      }}
                    >
                      {date.getDate()}
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        <ScheduleList
          schedules={schedules}
          selectedDate={selectedDate}
          selectedScheduleId={form.scheduleId}
          onSelectTime={handleSelectSchedule}
        />
        <Box
          position="fixed"
          bottom={0}
          right={0}
          sx={{ width: 'calc(100% - 56px)' }}
          bgcolor="white"
          boxShadow={3}
          p={2}
          zIndex={999}
        >
          <Container>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              loading={loading}
              disabled={
                !form.barberId ||
                !form.serviceId ||
                !form.scheduleId ||
                !form.date
              }
            >
              Agendar
            </Button>
          </Container>
        </Box>
      </Box>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar agendamento</DialogTitle>
        <DialogContent>
          <Typography>
            Ao agendar por aqui, o cancelamento só pode ser feito com pelo menos{' '}
            <strong>
              {Math.floor((barbershop?.minutesToCancel ?? 0) / 60)} horas
            </strong>{' '}
            de antecedência. Após esse período, não será possível cancelar.
          </Typography>
          <Typography mt={1}>
            O valor do agendamento cancelado será restituído como{' '}
            <strong>saldo</strong> na plataforma, que poderá ser utilizado em
            outro horário.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Voltar
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </PrivateLayout>
  );
}
