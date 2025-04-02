import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SyncIcon from '@mui/icons-material/Sync';
import PrivateLayout from '../../components/PrivateLayout';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { AppointmentDto, BarberDto, SubscriptionDto } from '../../dtos';
import { useBalance } from '../../hooks/balance';

const weekDays = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function Schedules() {
  const { fetchBalance } = useBalance();
  const [nexts, setNexts] = useState([]);
  const [pasts, setPast] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [cancelingAppointmentId, setCancelingAppointmentId] = useState<
    string | null
  >(null);
  const fetchPastAppointments = async (pageToLoad = 1) => {
    const { data } = await api.get(`/appointments/past`, {
      params: {
        page: pageToLoad,
        limit: 5,
      },
    });

    if (pageToLoad === 1) {
      setPast(data.data);
    } else {
      setPast((prev) => [...prev, ...data.data]);
    }

    setHasMore(pageToLoad < data?.meta?.totalPages);
    setPage(pageToLoad);
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [nextData, subData] = await Promise.all([
          api.get(`/appointments/next`),
          api.get(`/subscriptions/mine`),
        ]);

        setNexts(nextData.data);
        setSubscriptions(subData.data.filter((s) => s.active));
        await fetchPastAppointments(1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);
  const openCancelDialog = (id: string) => {
    setSelectedAppointmentId(id);
    setCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  const cancelAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      setCancelingAppointmentId(selectedAppointmentId);
      await api.delete(`/appointments/${selectedAppointmentId}`);
      fetchBalance();
      const { data } = await api.get(`/appointments/next`);
      setNexts(data);
      closeCancelDialog();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    } finally {
      setCancelingAppointmentId(null);
    }
  };
  const ProfessorInfo = ({ barber }: { barber: BarberDto }) => (
    <Stack direction="row" spacing={2} alignItems="center">
      {/* <Avatar src="/avatar.jpg" /> */}
      <Box>
        <Typography>{barber?.name}</Typography>
      </Box>
    </Stack>
  );

  const SubscriptionInfo = ({
    subscription,
  }: {
    subscription: SubscriptionDto;
  }) => (
    <Stack direction="row" spacing={2} sx={{ my: 1 }} alignItems="center">
      <Card sx={{ width: '100%', my: 1 }} variant="outlined">
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography fontWeight="bold">
              <SyncIcon
                fontSize="small"
                sx={{ mr: 1, verticalAlign: 'middle' }}
              />
              {weekDays[Number(subscription?.schedule?.weekDay)] +
                ', ' +
                subscription?.schedule?.time}
            </Typography>
            {/* <IconButton>
              <MoreVertIcon />
            </IconButton> */}
          </Stack>
          <ProfessorInfo barber={subscription?.barber} />
        </CardContent>
      </Card>
    </Stack>
  );

  const AulaCard = (appointment: AppointmentDto) => (
    <Card variant="outlined" sx={{ my: 1 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontWeight="bold">
              {formatDate(appointment?.date)}, {formatTime(appointment?.date)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              color="error"
              onClick={() => openCancelDialog(appointment.id)}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
        <ProfessorInfo barber={appointment?.barber} />
      </CardContent>
    </Card>
  );

  const AulaAnteriorCard = ({ date, time, barber }: any) => (
    <Card variant="outlined" sx={{ my: 1 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2}>
            {/* <Avatar src="/avatar.jpg" /> */}
            <Box>
              <Typography fontWeight="bold">
                {date}, {time}
              </Typography>
              {/* <Typography variant="body2">Pago: {valor}</Typography> */}
            </Box>
          </Stack>
        </Stack>
        <ProfessorInfo barber={barber} />
      </CardContent>
    </Card>
  );

  return (
    <PrivateLayout>
      <Box
        sx={{ alignSelf: 'center', flexDirection: 'column', width: '100%' }}
        p={3}
      >
        {loading ? (
          <Stack alignItems="center" mt={4}>
            <CircularProgress />
            <Typography mt={2}>Carregando dados...</Typography>
          </Stack>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Próximos
            </Typography>
            {nexts.length ? (
              nexts.map((next, i) => <AulaCard key={i} {...next} />)
            ) : (
              <Typography mt={2} gutterBottom>
                Nenhum encontrado
              </Typography>
            )}

            <Typography variant="h5" fontWeight="bold" mt={4} gutterBottom>
              Agendamentos semanais
            </Typography>
            {subscriptions.length ? (
              subscriptions.map((sub) => (
                <SubscriptionInfo subscription={sub} />
              ))
            ) : (
              <Typography mt={2} gutterBottom>
                Nenhum encontrado
              </Typography>
            )}

            <Typography variant="h5" fontWeight="bold" mt={4} gutterBottom>
              Anteriores
            </Typography>
            {pasts.length ? (
              pasts.map((aula, i) => (
                <AulaAnteriorCard
                  key={i}
                  barber={aula?.barber}
                  date={formatDate(aula?.date)}
                  time={formatTime(aula?.date)}
                  valor={`R$ ${(
                    aula?.payment?.amount / 100 || 0
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}`}
                />
              ))
            ) : (
              <Typography mt={2} gutterBottom>
                Nenhum encontrado
              </Typography>
            )}
            {hasMore && (
              <Button onClick={() => fetchPastAppointments(page + 1)}>
                Mais anteriores
              </Button>
            )}
          </>
        )}
      </Box>
      <Dialog
        open={cancelDialogOpen}
        onClose={closeCancelDialog}
        aria-labelledby="cancel-appointment-dialog-title"
      >
        <DialogTitle id="cancel-appointment-dialog-title">
          Cancelar agendamento
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar este agendamento? Isso não poderá
            ser desfeito.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeCancelDialog}
            disabled={!!cancelingAppointmentId}
          >
            Voltar
          </Button>
          <Button
            onClick={cancelAppointment}
            color="error"
            variant="contained"
            disabled={!!cancelingAppointmentId}
          >
            {cancelingAppointmentId ? 'Cancelando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </PrivateLayout>
  );
}
