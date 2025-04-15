import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import api from '../../../services/api';
import { useBarbershop } from '../../../hooks/barbershop';

export default function BarbersManagementPage() {
  const { barbershop } = useBarbershop();
  const [barbers, setBarbers] = useState([]);
  const [open, setOpen] = useState(false);
  const [barberToDelete, setBarberToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    barbershopId: barbershop?.id,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchBarbers();
  }, [barbershop?.id]);

  const fetchBarbers = async () => {
    if (barbershop?.id) {
      setLoading(true);
      try {
        const { data } = await api.get(`/barbers/barbershop/${barbershop.id}`);
        setBarbers(data);
      } catch (err) {
        console.error('Erro ao carregar barbeiros', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpen = (barber = null) => {
    setSelectedBarber(barber);
    setFormData(barber ? { name: barber.name } : { name: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBarber(null);
  };
  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setBarberToDelete(null);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedBarber) {
      await api.patch(`/barbers/${selectedBarber.id}`, formData);
    } else {
      formData.barbershopId = barbershop?.id;
      await api.post('/barbers', formData);
    }
    fetchBarbers();
    handleClose();
  };
  const handleDeleteClick = (barber) => {
    setBarberToDelete(barber);
    setConfirmDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (barberToDelete) {
      await api.delete(`/barbers/${barberToDelete.id}`);
      fetchBarbers();
      setConfirmDeleteOpen(false);
      setBarberToDelete(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        mb={2}
      >
        <Typography variant="h5">Profissionais</Typography>
        {!loading && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            disabled={barbers.length > 0}
          >
            Novo
          </Button>
        )}
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography variant="body1">Carregando profissionais...</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {barbers.map((barber) => (
            <Grid item xs={12} sm={6} md={4} key={barber.id}>
              <Paper
                elevation={3}
                style={{ padding: 16, position: 'relative' }}
              >
                <Typography variant="h6">{barber.name}</Typography>
                <Box position="absolute" top={8} right={8}>
                  <IconButton onClick={() => handleOpen(barber)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(barber)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedBarber ? 'Editar Profissional' : 'Novo Profissional'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>{' '}
      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o profissional "
            {barberToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
