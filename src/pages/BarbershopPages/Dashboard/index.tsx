import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  BarChart,
  BarPlot,
  LineChart,
  LinePlot,
  axisClasses,
} from '@mui/x-charts';
import api from '../../../services/api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useBarbershopServices } from '../../../hooks/service';
import { useBarbershop } from '../../../hooks/barbershop';
export default function BarbershopDashboard() {
  const navigate = useNavigate();
  const { services } = useBarbershopServices();
  const { barbershop } = useBarbershop();
  const barbershopLink = `${import.meta.env.VITE_APP}/agendar/${barbershop?.slug}`;
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    appointments: 0,
    revenue: 0,
    subscriptions: 0,
  });
  const [appointmentsChart, setAppointmentsChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [checklist, setChecklist] = useState({
    hasBarber: false,
    hasService: false,
    hasSchedule: false,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchBarbers = async () => {
    if (barbershop?.id) {
      api.get(`/barbers/barbershop/${barbershop?.id}`).then(({ data }) => {
        if (!!data.length) {
          setBarbers(data);
          setChecklist((prev) => ({ ...prev, hasBarber: true }));
        }
      });
    }
  };

  useEffect(() => {
    if (barbershop?.id) {
      fetchBarbers();
    }
  }, [barbershop?.id]);

  const fetchSchedules = async () => {
    const { data } = await api.get(
      `/schedules/barbershop/${barbershop?.id}/barber/${barbers[0]?.id}`
    );
    if (!!data.length) {
      setChecklist((prev) => ({ ...prev, hasSchedule: true }));
    }
  };

  useEffect(() => {
    if (barbers.length && barbershop?.id) {
      fetchSchedules();
    }
  }, [barbershop?.id, barbers]);

  useEffect(() => {
    console.log('services:', services);
    if (Array.isArray(services) && services.length > 0) {
      setChecklist((prev) => {
        const updated = { ...prev, hasService: true };
        console.log('Checklist atualizado:', updated);
        return updated;
      });
    }
  }, [services]);
  console.log('Checklist:', checklist);
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const allStepsCompleted =
    checklist.hasBarber && checklist.hasService && checklist.hasSchedule;

  const handleCopyLink = () => {
    const siteUrl = barbershopLink; // ajuste o domínio e slug conforme necessário
    navigator.clipboard.writeText(siteUrl);
    toast.success('Link copiado!');
  };
  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/barbershops/dashboard');
      setSummary(data.summary);
      setAppointmentsChart(data.appointmentsChart);
      setRevenueChart(data.revenueChart);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" mt={4} mb={3}>
        Dashboard da Barbearia
      </Typography>{' '}
      <Paper elevation={3} style={{ padding: 16, marginBottom: 24 }}>
        <Typography variant="h6" gutterBottom>
          Checklist para publicar seu site
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <FormControlLabel
              control={<Checkbox checked={checklist.hasBarber} disabled />}
              label="Cadastrar pelo menos um profissional"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={() => navigate('/empresa/profissionais')}
              fullWidth
            >
              Ir para tela
            </Button>
          </Grid>

          <Grid item xs={12} sm={8}>
            <FormControlLabel
              control={<Checkbox checked={checklist.hasService} disabled />}
              label="Criar pelo menos um serviço"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={() => navigate('/empresa/servicos')}
              fullWidth
            >
              Ir para tela
            </Button>
          </Grid>

          <Grid item xs={12} sm={8}>
            <FormControlLabel
              control={<Checkbox checked={checklist.hasSchedule} disabled />}
              label="Definir os horários de atendimento"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={() => navigate('/empresa/horarios')}
              fullWidth
            >
              Ir para tela
            </Button>
          </Grid>
        </Grid>

        <Box mt={2}>
          {allStepsCompleted ? (
            <>
              <Typography mb={4} color="green">
                ✅ Site publicado
              </Typography>
              <Tooltip title="Copiar link do site">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Link da sua agenda"
                  value={barbershopLink} // substitua por variável real
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copiar link">
                          <IconButton onClick={handleCopyLink} edge="end">
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Tooltip>
            </>
          ) : (
            <Typography color="text.secondary">
              🔒 Site ainda não publicado. Complete os passos acima para
              liberá-lo.
            </Typography>
          )}
        </Box>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="subtitle1">Agendamentos (mês)</Typography>
            <Typography variant="h5">{summary.appointments}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="subtitle1">Receita Total (mês)</Typography>
            <Typography variant="h5">
              {summary.revenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="subtitle1">Assinaturas Ativas</Typography>
            <Typography variant="h5">{summary.subscriptions}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16, overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Agendamentos por Dia
            </Typography>
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: appointmentsChart.map((item) => item.day),
                },
              ]}
              series={[
                {
                  data: appointmentsChart.map((item) => item.appointments),
                  label: 'Agendamentos',
                },
              ]}
              width={isMobile ? 200 : 500}
              height={300}
              sx={{
                [`& .${axisClasses.left} .MuiChartsAxis-tickLabel`]: {
                  fontSize: 12,
                },
              }}
            >
              <BarPlot />
            </BarChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16, overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Receita por Dia
            </Typography>
            <LineChart
              xAxis={[
                {
                  scaleType: 'point',
                  data: revenueChart.map((item) => item.day),
                },
              ]}
              series={[
                {
                  data: revenueChart.map((item) => item.revenue),
                  label: 'Receita (R$)',
                },
              ]}
              width={isMobile ? 200 : 500}
              height={300}
              sx={{
                [`& .${axisClasses.left} .MuiChartsAxis-tickLabel`]: {
                  fontSize: 12,
                },
              }}
            >
              <LinePlot />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
