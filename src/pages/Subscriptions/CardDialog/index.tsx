import React, { useState, useEffect } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../../hooks/auth';
import api from '../../../services/api';
import { useUserAddresses } from '../../../hooks/address';
import { useUserCards } from '../../../hooks/cards';

export default function CardDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { refreshCards } = useUserCards();
  const { address } = useUserAddresses();
  const [activeStep, setActiveStep] = useState(0);
  const [cepBuscado, setCepBuscado] = useState(false);

  const [form, setForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: '',
    street: address?.street,
    street_number: address?.street_number,
    neighborhood: address?.neighborhood,
    complementary: address?.complementary,
    referencePoint: address?.referencePoint,
    zipCode: address?.zipCode,
    city: address?.city,
    state: address?.state,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setForm({ ...form, focus: e.target.name });
  };

  const buscarEndereco = async () => {
    const cepLimpo = form.zipCode.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      alert('Digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      }));

      setCepBuscado(true);
    } catch (err) {
      alert('Erro ao buscar o CEP.');
    }
  };

  const createCard = async () => {
    await api.post('/customers/card', {
      ...form,
      number: form.number.replace(/\s/g, ''),
      holder_name: form.name,
      exp_month: form.expiry.split('/')[0],
      exp_year: form.expiry.split('/')[1],
      cvv: form.cvc,
      holder_document: user.document,
    });
    refreshCards();
    onClose();
  };

  const steps = ['Endereço de Cobrança', 'Dados do Cartão'];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Cadastro de Cartão</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="CEP"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="medium"
                  onClick={buscarEndereco}
                >
                  Buscar
                </Button>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Rua"
                  name="street"
                  value={form.street}
                  onChange={handleInputChange}
                  disabled={!cepBuscado}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Número"
                  name="street_number"
                  value={form.street_number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Bairro"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleInputChange}
                  disabled={!cepBuscado}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Complemento"
                  name="complementary"
                  value={form.complementary}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ponto de Referência"
                  name="referencePoint"
                  value={form.referencePoint}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Cidade"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  disabled={!cepBuscado}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="UF"
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  disabled={!cepBuscado}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Cards
              number={form.number}
              name={form.name}
              expiry={form.expiry}
              cvc={form.cvc}
              focused={form.focus}
            />

            <TextField
              label="Número do cartão"
              name="number"
              value={form.number}
              onChange={handleInputChange}
              onFocus={handleFocus}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nome impresso"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              onFocus={handleFocus}
              fullWidth
              margin="normal"
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Validade (MM/AA)"
                name="expiry"
                value={form.expiry}
                onChange={handleInputChange}
                onFocus={handleFocus}
                fullWidth
                margin="normal"
              />
              <TextField
                label="CVV"
                name="cvc"
                value={form.cvc}
                onChange={handleInputChange}
                onFocus={handleFocus}
                fullWidth
                margin="normal"
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {activeStep === 0 && (
          <Button onClick={() => setActiveStep(1)} disabled={!cepBuscado}>
            Próximo
          </Button>
        )}
        {activeStep === 1 && (
          <Button variant="contained" onClick={createCard}>
            Cadastrar Cartão
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
