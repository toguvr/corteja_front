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
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import PrivateLayout from '../../components/PrivateLayout';
import { PaymentDto } from '../../dtos';

export default function PaymentStatement() {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Box p={3} sx={{ width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Extrato de Pagamentos
        </Typography>

        <TableContainer component={Paper}>
          <Table>
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
                  <TableCell colSpan={6}>Carregando...</TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
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
                        label={p.status}
                        color={p.status === 'paid' ? 'success' : 'warning'}
                        size="small"
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
