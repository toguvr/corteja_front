import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
  Grid,
} from '@mui/material';
import PrivateLayout from '../../components/PrivateLayout';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { CustomerDto } from '../../dtos';

interface Props {
  customer: CustomerDto;
  onSave: (customer: Partial<CustomerDto>) => void;
}

const EditCustomerProfile: React.FC<Props> = () => {
  const { user: customer } = useAuth();
  const [formData, setFormData] = useState<Partial<CustomerDto>>(customer);

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`customers`, formData);
  };

  return (
    <PrivateLayout>
      <Container maxWidth="sm">
        <Typography variant="h5" gutterBottom>
          Editar Perfil
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                sx={{ width: 80, height: 80 }}
                src={formData.avatar || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nome"
                name="name"
                fullWidth
                value={formData.name || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="E-mail"
                name="email"
                type="email"
                fullWidth
                value={formData.email || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Telefone"
                name="phone"
                fullWidth
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Documento"
                name="document"
                fullWidth
                value={formData.document || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>
            Salvar
          </Button>
        </Box>
      </Container>
    </PrivateLayout>
  );
};

export default EditCustomerProfile;
