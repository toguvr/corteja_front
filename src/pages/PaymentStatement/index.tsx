import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import PrivateLayout from '../../components/PrivateLayout';
import { PaymentDto } from '../../dtos';
import { useTheme } from '@mui/material/styles';

export default function PaymentStatement() {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function fetchPayments() {
      try {
        const { data } = await api.get(`/payments/mine`);
        setPayments(data);
      } catch (error) {
        console.error('Erro ao buscar pagamentos', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  return (
    <PrivateLayout>
      <Box p={isMobile ? 2 : 3} sx={{ width: '100%' }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
          Extrato de Pagamentos
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            overflowX: 'auto',
            maxWidth: '100%',
          }}
        >
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Local</TableCell>
                <TableCell>Agendamento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Valor (R$)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>Carregando...</TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    Nenhum pagamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {new Date(p?.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{p.barbershop?.name || '-'}</TableCell>
                    <TableCell>{p.type || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.status === 'paid' ? 'Pago' : 'Pendente'}
                        color={p.status === 'paid' ? 'success' : 'warning'}
                        size={isMobile ? 'small' : 'medium'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {((p.amount || 0) / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </PrivateLayout>
  );
}
