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
} from '@mui/material';
import {
  BarChart,
  BarPlot,
  LineChart,
  LinePlot,
  axisClasses,
} from '@mui/x-charts';
import api from '../../../services/api';

export default function BarbershopDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    appointments: 0,
    revenue: 0,
    subscriptions: 0,
  });
  const [appointmentsChart, setAppointmentsChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      </Typography>

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
