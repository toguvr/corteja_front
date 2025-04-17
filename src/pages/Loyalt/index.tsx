import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  LinearProgress,
  useTheme,
  Button,
  Collapse,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useBarbershop } from '../../hooks/barbershop';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function LoyaltyCard() {
  const theme = useTheme();
  const { barbershop } = useBarbershop();
  const [stamps, setStamps] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [redeemed, setRedeemed] = useState<boolean>(false);

  useEffect(() => {
    if (barbershop?.id) fetchStamps();
  }, [barbershop]);

  const fetchStamps = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/stamps/barbershop/${barbershop?.id}`);
      setStamps(data.totalStamps);
    } catch (err) {
      console.error('Erro ao buscar selos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    try {
      setLoading(true);
      await api.post(`/stamps`, {
        barbershopId: barbershop?.id,
      });
      toast.success('Bônus resgatado com sucesso!');
      fetchStamps(); // recarrega os dados
    } catch (err) {
      toast.error('Você ainda não pode resgatar.');
    } finally {
      setLoading(false);
    }
  };

  const totalRequired = barbershop?.loyaltyStamps || 5;
  const rewardValue = (barbershop?.loyaltyReward || 1000) / 100;
  const progress = (stamps / totalRequired) * 100;
  const isReadyToRedeem = stamps >= totalRequired;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fdfdfd',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Cartão Fidelidade
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={2}>
        Ganhe 1 selo por pagamento
        {barbershop?.minAmountToStamp &&
          ` acima de ${(barbershop?.minAmountToStamp / 100).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL',
            }
          )}`}
        . Ao completar {totalRequired}, você recebe{' '}
        <Typography component="span" fontWeight="bold" color="success.main">
          {rewardValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Typography>
        .
      </Typography>

      {loading ? (
        <Box mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={1} justifyContent="center" mb={2}>
            {[...Array(totalRequired)].map((_, index) => (
              <Grid item key={index}>
                {index < stamps ? (
                  <StarIcon color="warning" sx={{ fontSize: 32 }} />
                ) : (
                  <StarBorderIcon color="disabled" sx={{ fontSize: 32 }} />
                )}
              </Grid>
            ))}
          </Grid>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
          />

          <Typography variant="body2" color="text.secondary">
            {stamps} de {totalRequired} selos conquistados
          </Typography>

          <Collapse in={redeemed} timeout={600} unmountOnExit>
            <Box
              mt={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              <CheckCircleOutlineIcon color="success" fontSize="large" />
              <Typography
                variant="body1"
                color="success.main"
                fontWeight="bold"
              >
                Bônus resgatado com sucesso!
              </Typography>
            </Box>
          </Collapse>

          {isReadyToRedeem && !redeemed && (
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2, borderRadius: 10, px: 4 }}
              onClick={handleRedeem}
            >
              Resgatar Bônus
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
}
