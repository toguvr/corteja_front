import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useBarbershop } from '../../../hooks/barbershop';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
interface Appointment {
  id: string;
  customer: {
    name: string;
    avatar?: string;
  };
  service: {
    name: string;
  };
  date: string;
}

export default function BarberAgenda() {
  const { barbershop } = useBarbershop();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (barbershop?.id) {
      api.get(`/barbers/barbershop/${barbershop?.id}`).then(({ data }) => {
        setBarbers(data);
        if (data.length === 1) {
          setSelectedBarber(data[0].id);
        }
      });
    }
  }, [barbershop?.id]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatHour = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`;
  };

  const getWeekDayName = (date: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/appointments/barber/${selectedBarber}?date=${formatDate(selectedDate)}`
      );
      setAppointments(data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBarber) {
      fetchAppointments();
    }
  }, [selectedDate, selectedBarber]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <Box p={2}>
      {barbers.length > 1 && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Selecione o barbeiro
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
          >
            {barbers.map((barber: any) => (
              <MenuItem key={barber.id} value={barber.id}>
                {barber.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => changeDate(-1)}>
            <ArrowBack />
          </IconButton>
          <Box textAlign="center">
            <Typography variant="subtitle2">
              {getWeekDayName(selectedDate)}
            </Typography>
            <Typography variant="h6">
              {selectedDate.toLocaleDateString('pt-BR')}
            </Typography>
          </Box>
          <IconButton onClick={() => changeDate(1)}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Paper>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {appointments.length === 0 ? (
            <Typography align="center" mt={4} color="text.secondary">
              Nenhum agendamento encontrado.
            </Typography>
          ) : (
            appointments.map((item) => (
              <Box key={item.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={item.customer?.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Serviço: {item.service?.name}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          component="a"
                          href={`https://wa.me/${item.customer?.phone?.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: 'none', color: '#25D366' }}
                        >
                          <WhatsAppIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography fontSize="0.9rem" fontWeight="bold">
                            {item.customer?.phone}
                          </Typography>
                        </Box>
                        <Chip
                          label={`Horário: ${formatHour(item.date)}`}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Box>
            ))
          )}
        </List>
      )}
    </Box>
  );
}
