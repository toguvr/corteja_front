import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import api from '../../services/api';
import PrivateLayout from '../../components/PrivateLayout';
import ScheduleDialog from './DialogSubscription';
import { useBarbershop } from '../../hooks/barbershop';
import { useUserCards } from '../../hooks/cards';
import CardDialog from './CardDialog';
import { SubscriptionDto } from '../../dtos';
import { toast } from 'react-toastify';

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  amount: number;
  next_billing_at: string;
  active: boolean;
  plan: {
    price: number;
  };
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
}

export default function Assinaturas() {
  const { barbershop } = useBarbershop();
  const { cards } = useUserCards();
  const [assinaturas, setAssinaturas] = useState<SubscriptionDto[]>([]);
  const [planos, setPlanos] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id);
  const [barbers, setBarbers] = useState([]);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const weekDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];
  const openCancelDialog = (id: string) => {
    setSelectedSubscriptionId(id);
    setConfirmDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedSubscriptionId(null);
  };
  useEffect(() => {
    if (barbershop?.id) {
      api.get(`/barbers/barbershop/${barbershop?.id}`).then(({ data }) => {
        setBarbers(data);
        setSelectedBarberId(data[0]?.id);
      });
    }
  }, [barbershop?.id]);

  const handleSelectSchedule = (schedule) => {
    setSelectedScheduleId((prev) => schedule.id);
  };
  const handleSelectCard = (e) => {
    setSelectedCardId(e.target.value);
  };

  const handleSelectBarber = (e) => {
    setSelectedBarberId(e.target.value);
  };
  const loadAssinaturas = async () => {
    try {
      const { data } = await api.get('/subscriptions/mine');
      setAssinaturas(data);
    } catch (err) {
      console.error('Erro ao carregar assinaturas', err);
    }
  };
  const cancelarAssinatura = async () => {
    if (!selectedSubscriptionId) return;
    try {
      setCancelingId(selectedSubscriptionId);
      await api.delete(`/subscriptions/${selectedSubscriptionId}`);
      toast.success('Assinatura cancelada com sucesso');
      loadAssinaturas();
    } catch (err) {
      toast.error('Erro ao cancelar assinatura');
    } finally {
      setCancelingId(null);
      closeCancelDialog();
    }
  };
  const loadPlanos = async () => {
    try {
      const { data } = await api.get(`/plans/${barbershop?.id}`);
      setPlanos(data);
    } catch (err) {
      console.error('Erro ao carregar planos', err);
    }
  };
  const loadSchedules = async () => {
    try {
      api
        .get(
          `/schedules/barbershop/${barbershop?.id}/barber/${selectedBarberId}`
        )
        .then(({ data }) => setSchedules(data));
    } catch (err) {
      console.error('Erro ao carregar planos', err);
    }
  };

  const handleOpenModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
  };

  const confirmarAssinatura = async () => {
    if (!selectedPlan) return;
    try {
      await api.post('/subscriptions', {
        planId: selectedPlan.id,
        cardId: selectedCardId,
        barbershopId: barbershop?.id,
        scheduleId: selectedScheduleId,
      });
      loadAssinaturas();
      handleCloseModal();
    } catch (err) {
      alert('Erro ao assinar plano');
    }
  };

  useEffect(() => {
    if (barbershop?.id) {
      Promise.all([loadAssinaturas(), loadPlanos()]).finally(() =>
        setLoading(false)
      );
    }
  }, [barbershop?.id]);

  useEffect(() => {
    if (barbershop?.id && selectedBarberId) {
      loadSchedules();
    }
  }, [barbershop?.id, selectedBarberId]);

  return (
    <PrivateLayout>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Minhas Assinaturas
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {assinaturas.length ? (
                assinaturas.map((sub) => (
                  <Grid item xs={12} sm={6} md={4} key={sub.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{sub.plan_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {sub.active ? 'Ativa' : 'Inativa'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Valor:{' '}
                          {(sub?.plan?.price / 100).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}{' '}
                          / ciclo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dia : {weekDays[sub.schedule.weekDay]}
                          {', '}
                          {sub.schedule.time}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => openCancelDialog(sub.id)}
                        >
                          Cancelar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography gutterBottom mt={2}>
                  Você ainda não tem nenhuma assinatura.
                </Typography>
              )}
            </Grid>

            <Typography variant="h5" gutterBottom>
              Planos Disponíveis
            </Typography>
            <Grid container spacing={3}>
              {planos.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{plan.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Valor:{' '}
                        {(plan.price / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}{' '}
                        / {plan.interval === 'week' ? 'semana' : 'mês'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenModal(plan)}
                      >
                        Assinar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
      <CardDialog
        open={openCardDialog}
        onClose={() => setOpenCardDialog(false)}
      />
      <ScheduleDialog
        selectedPlan={selectedPlan}
        open={modalOpen}
        onClose={handleCloseModal}
        schedules={schedules}
        handleSelectSchedule={handleSelectSchedule}
        selectedScheduleId={selectedScheduleId}
        selectedBarberId={selectedBarberId}
        barbers={barbers}
        handleSelectBarber={handleSelectBarber}
        selectedCardId={selectedCardId}
        cards={cards}
        handleSelectCard={handleSelectCard}
        handleOpenCardDialog={() => setOpenCardDialog(true)}
        confirmarAssinatura={confirmarAssinatura}
      />
      <Dialog
        open={confirmDialogOpen}
        onClose={closeCancelDialog}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">Cancelar assinatura</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Tem certeza que deseja cancelar esta assinatura? Essa ação não pode
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} disabled={!!cancelingId}>
            Voltar
          </Button>
          <Button
            onClick={cancelarAssinatura}
            color="error"
            variant="contained"
            disabled={!!cancelingId}
          >
            {cancelingId ? 'Cancelando...' : 'Confirmar cancelamento'}
          </Button>
        </DialogActions>
      </Dialog>
    </PrivateLayout>
  );
}
