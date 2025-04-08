import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  FormControl,
  Button,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
} from '@mui/material';
import { useAuth } from '../../../hooks/auth';
import { toast } from 'react-toastify';
import api from '../../../services/api';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
export default function RegisterInformationForm() {
  const { signIn } = useAuth();
  const [cepBuscado, setCepBuscado] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    trading_name: '',
    password: '',
    slug: '',
    avatar: '',
    fee: 10,
    haveLoyalty: true,
    document: '',
    type: 'individual',
    birth_date: '',
    monthly_income: '',
    professional_occupation: '',
    phone: '',
    mother_name: '',
    description: '',
    annual_revenue: '',
    bank_code: '',
    agencia: '',
    agencia_dv: '',
    conta: '',
    conta_dv: '',
    legal_name: '',
    company_name: '',
    charge_transfer_fees: true,
    transfer_interval: 'weekly',
    transfer_day: 5,
    representative: {
      name: '',
      email: '',
      document: '',
      mother_name: '',
      birthdate: '',
      monthly_income: '',
      professional_occupation: '',
      annual_revenue: '',
      corporation_type: '',
      founding_date: '',
      self_declared_legal_representative: true,
      address: {
        street: '',
        complementary: '',
        street_number: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        reference_point: '',
      },
    },
    address: {
      street: '',
      complementary: '',
      street_number: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      reference_point: '',
    },
    bank_account: {
      legal_name: '',
      type_receiver: 'checking',
      document_number: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const steps =
    form.type === 'individual'
      ? ['Seus dados', 'Endereço', 'Conta Bancária']
      : [
          'Dados da Barbearia',
          'Endereço',
          'Sócio Administrador',
          'Conta Bancária',
        ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit(); // Último passo envia
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const isCheckbox = inputType === 'checkbox';
    const finalValue = isCheckbox ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: finalValue,
        },
      }));
    } else {
      const updatedForm = {
        ...form,
        [name]: finalValue,
      };

      if (name === 'name') {
        updatedForm.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      setForm(updatedForm);
    }
  };
  const buscarEndereco = async () => {
    const cepLimpo = form.address.zip_code.replace(/\D/g, '');
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
        address: {
          ...prev.address,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        },
      }));

      setCepBuscado(true);
    } catch (err) {
      alert('Erro ao buscar o CEP.');
    }
  };
  const buscarEnderecoRepresentante = async () => {
    const cepLimpo = form.representative.address.zip_code.replace(/\D/g, '');
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
        representative: {
          ...prev.representative,
          address: {
            ...prev.representative.address,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          },
        },
      }));

      setCepBuscado(true);
    } catch (err) {
      alert('Erro ao buscar o CEP.');
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const [year, month, day] = form.birth_date.split('/');
      const isIndividual = form.type === 'individual';

      const payload = {
        password: '123456',
        register_information: {
          type: form.type,
          document: form.document,
          name: form.name,
          email: form.email,
          phone_numbers: [
            {
              ddd: form.phone.slice(0, 2),
              number: form.phone.slice(2).replace('-', ''),
              type: 'mobile',
            },
          ],
          site_url: null,
          company_name: form.company_name || '',
          trading_name: form.legal_name || '',
          annual_revenue: form.annual_revenue || '',
          founding_date: form.representative.founding_date || '',
          address: {
            street: form.address.street,
            complementary: form.address.complementary,
            street_number: form.address.street_number,
            neighborhood: form.address.neighborhood,
            city: form.address.city,
            state: form.address.state,
            zip_code: form.address.zip_code,
            reference_point: form.address.reference_point,
          },
          ...(form.type === 'company' && {
            main_address: {
              street: form.address.street,
              complement: form.address.complementary,
              number: form.address.street_number,
              neighborhood: form.address.neighborhood,
              city: form.address.city,
              state: form.address.state,
              zip_code: form.address.zip_code,
              reference_point: form.address.reference_point,
            },

            managing_partners: [
              {
                name: form.representative.name,
                email: form.representative.email,
                document: form.representative.document,
                type: 'individual',
                mother_name: form.representative.mother_name,
                birth_date: form.representative.birthdate,
                monthly_income: form.representative.monthly_income,
                professional_occupation:
                  form.representative.professional_occupation,
                self_declared_legal_representative:
                  form.representative.self_declared_legal_representative,
                address: {
                  street: form.address.street,
                  complement: form.address.complementary,
                  number: form.address.street_number,
                  neighborhood: form.address.neighborhood,
                  city: form.address.city,
                  state: form.address.state,
                  zip_code: form.address.zip_code,
                  reference_point: form.address.reference_point,
                },
                phone_numbers: [
                  {
                    ddd: form.phone.slice(1, 3),
                    number: form.phone.slice(5).replace('-', ''),
                    type: 'mobile',
                  },
                ],
              },
            ],
          }),
          ...(isIndividual && {
            birthdate: form.birth_date,
            professional_occupation: form.professional_occupation,
            mother_name: form.mother_name,
            monthly_income: form.monthly_income,
          }),
        },
        default_bank_account: {
          bank: form.bank_code,
          branch_number: form.agencia,
          branch_check_digit: form.agencia_dv,
          account_number: form.conta,
          account_check_digit: form.conta_dv,
          type: 'checking',
          holder_type: form.type,
          holder_document: form.bank_account.document_number,
          holder_name: form.bank_account.legal_name,
        },
      };

      const { data } = await api.post('/barbershops', payload);
      toast.success('Barbearia cadastrada com sucesso!');
      await signIn({ ...form, role: 'admin', page: '/empresa/dashboard' });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao cadastrar barbearia.');
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (value) => {
    const cents = Number(value || 0);
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleMoneyChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    const cents = Number(raw);
    setForm((prev) => ({
      ...prev,
      [e.target.name]: isNaN(cents) ? '' : cents,
    }));
  };
  const slugify = (text: string) =>
    text
      .toString()
      .normalize('NFD') // remove acentos
      .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // troca tudo por hífen
      .replace(/^-+|-+$/g, ''); // remove hífens extras
  return (
    <Box p={2}>
      {' '}
      <Typography variant="h5" gutterBottom>
        Tipo de Pessoa
      </Typography>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="person-type-label">Tipo</InputLabel>
        <Select
          labelId="person-type-label"
          value={form.type}
          label="Tipo"
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <MenuItem value="company">Pessoa Jurídica</MenuItem>
          <MenuItem value="individual">Pessoa Física</MenuItem>
        </Select>
      </FormControl>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <Box>
          {form.type === 'company' ? (
            <>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CNPJ"
                      fullWidth
                      autoComplete="off"
                      //  error={!!errors.holder_document}
                      //  helperText={errors.holder_document}
                      value={form.document}
                      onChange={(e) => {
                        let onlyNumbers = e.target.value.replace(/\D/g, '');

                        if (onlyNumbers.length > 12) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
                            '$1.$2.$3/$4-$5'
                          );
                        } else if (onlyNumbers.length > 8) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{3})(\d{3})(\d{0,4})/,
                            '$1.$2.$3/$4'
                          );
                        } else if (onlyNumbers.length > 5) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{3})(\d{0,3})/,
                            '$1.$2.$3'
                          );
                        } else if (onlyNumbers.length > 2) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{0,3})/,
                            '$1.$2'
                          );
                        }

                        setForm({ ...form, document: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 18 }} // 14 números + 4 pontuações
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={form.name}
                      onChange={handleChange}
                      name="name"
                      fullWidth
                      label="Nome da empresa"
                    />{' '}
                    {form.name && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, ml: 0.5, color: 'text.secondary' }}
                      >
                        Seu link: <strong>{slugify(form.name)}</strong>
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Senha"
                      value={form.password}
                      onChange={handleChange}
                      name="password"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Celular"
                      fullWidth
                      // error={!!errors.phone}
                      // helperText={errors.phone}
                      value={form.phone}
                      onChange={(e) => {
                        let onlyNumbers = e.target.value.replace(/\D/g, '');
                        if (onlyNumbers.length > 10) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{5})(\d{4}).*/,
                            '($1) $2-$3'
                          );
                        } else if (onlyNumbers.length > 5) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{4})(\d{0,4})/,
                            '($1) $2-$3'
                          );
                        } else if (onlyNumbers.length > 2) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{0,5})/,
                            '($1) $2'
                          );
                        }
                        setForm({ ...form, phone: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 15 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Razão Social"
                      value={form.trading_name}
                      onChange={handleChange}
                      name="trading_name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      value={form.company_name}
                      onChange={handleChange}
                      name="company_name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="annual_revenue"
                      label="Receita Anual"
                      value={formatCurrency(form.annual_revenue)}
                      onChange={handleMoneyChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          ) : (
            <>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CPF"
                      fullWidth
                      margin="normal"
                      placeholder="Digite o CPF"
                      autoComplete="off"
                      // error={!!errors.document}
                      // helperText={errors.document}
                      value={form.document}
                      onChange={(e) => {
                        let onlyNumbers = e.target.value.replace(/\D/g, '');
                        if (onlyNumbers.length > 9) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{3})(\d{3})(\d{3})(\d{0,2})/,
                            '$1.$2.$3-$4'
                          );
                        } else if (onlyNumbers.length > 6) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{3})(\d{3})(\d{0,3})/,
                            '$1.$2.$3'
                          );
                        } else if (onlyNumbers.length > 3) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{3})(\d{0,3})/,
                            '$1.$2'
                          );
                        }
                        setForm({ ...form, [e.target.name]: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 14 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={form.name}
                      onChange={handleChange}
                      name="name"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Celular"
                      fullWidth
                      // error={!!errors.phone}
                      // helperText={errors.phone}
                      value={form.phone}
                      onChange={(e) => {
                        let onlyNumbers = e.target.value.replace(/\D/g, '');
                        if (onlyNumbers.length > 10) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{5})(\d{4}).*/,
                            '($1) $2-$3'
                          );
                        } else if (onlyNumbers.length > 5) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{4})(\d{0,4})/,
                            '($1) $2-$3'
                          );
                        } else if (onlyNumbers.length > 2) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{0,5})/,
                            '($1) $2'
                          );
                        }
                        setForm({ ...form, phone: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 15 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Data de Nascimento"
                      type="date"
                      value={form.birth_date}
                      onChange={handleChange}
                      name="birth_date"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ocupação"
                      value={form.professional_occupation}
                      onChange={handleChange}
                      name="professional_occupation"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Renda Mensal"
                      value={formatCurrency(form.monthly_income)}
                      onChange={handleMoneyChange}
                      name="monthly_income"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome da Mãe"
                      value={form.mother_name}
                      onChange={handleChange}
                      name="mother_name"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          {
            <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={form.address.zip_code}
                    onChange={handleChange}
                    name="address.zip_code"
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rua"
                    value={form.address.street}
                    onChange={handleChange}
                    name="address.street"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={form.address.street_number}
                    onChange={handleChange}
                    name="address.street_number"
                    label="Número"
                    defaultValue="10"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    value={form.address.complementary}
                    onChange={handleChange}
                    name="address.complementary"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={form.address.neighborhood}
                    onChange={handleChange}
                    name="address.neighborhood"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={form.address.city}
                    onChange={handleChange}
                    name="address.city"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={form.address.state}
                    onChange={handleChange}
                    name="address.state"
                    label="Estado"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ponto de Referência"
                    value={form.address.reference_point}
                    onChange={handleChange}
                    name="address.reference_point"
                  />
                </Grid>
              </Grid>
            </Paper>
          }
        </Box>
      )}
      {activeStep === 2 && (
        <Box>
          {
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Banco"
                    value={form.bank_code}
                    onChange={handleChange}
                    name="bank_code"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Agência"
                    value={form.agencia}
                    onChange={handleChange}
                    name="agencia"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dígito da Agência"
                    value={form.agencia_dv}
                    onChange={handleChange}
                    name="agencia_dv"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Conta"
                    value={form.conta}
                    onChange={handleChange}
                    name="conta"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dígito da Conta"
                    value={form.conta_dv}
                    onChange={handleChange}
                    name="conta_dv"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Documento do Titular"
                    onChange={handleChange}
                    name="bank_account.document_number"
                    value={form.bank_account.document_number}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome do Titular"
                    value={form.bank_account.legal_name}
                    onChange={handleChange}
                    name="bank_account.legal_name"
                  />
                </Grid>
              </Grid>{' '}
            </Paper>
          }
        </Box>
      )}
      {activeStep === 3 && (
        <Box>
          {
            <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={form.representative.name}
                    onChange={handleChange}
                    name="representative.name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={form.representative.email}
                    onChange={handleChange}
                    name="representative.email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={form.representative.document}
                    onChange={handleChange}
                    name="representative.document"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome da Mãe"
                    value={form.representative.mother_name}
                    onChange={handleChange}
                    name="representative.mother_name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    type="date"
                    value={form.representative.birthdate}
                    onChange={handleChange}
                    name="representative.birthdate"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Renda Mensal"
                    onChange={handleMoneyChange}
                    value={formatCurrency(form.representative.monthly_income)}
                    name="representative.monthly_income"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ocupação"
                    value={form.representative.professional_occupation}
                    onChange={handleChange}
                    name="representative.professional_occupation"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label="Representante Legal Autodeclarado"
                    value={
                      form.representative.self_declared_legal_representative
                    }
                    onChange={handleChange}
                    name="representative.self_declared_legal_representative"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom mt={2}>
                Endereço do Sócio
              </Typography>
              <Grid container spacing={2}>
                {' '}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={form.representative.address.zip_code}
                    onChange={handleChange}
                    name="representative.address.zip_code"
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="medium"
                    onClick={buscarEnderecoRepresentante}
                  >
                    Buscar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rua"
                    value={form.representative.address.street}
                    onChange={handleChange}
                    name="representative.address.street"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número"
                    value={form.representative.address.street_number}
                    onChange={handleChange}
                    name="representative.address.street_number"
                    defaultValue="10"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={form.representative.address.complementary}
                    onChange={handleChange}
                    name="representative.address.complementary"
                    label="Complemento"
                    defaultValue="com"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={form.representative.address.neighborhood}
                    onChange={handleChange}
                    name="representative.address.neighborhood"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={form.representative.address.city}
                    onChange={handleChange}
                    name="representative.address.city"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estado"
                    value={form.representative.address.state}
                    onChange={handleChange}
                    name="representative.address.state"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ponto de Referência"
                    value={form.representative.address.reference_point}
                    onChange={handleChange}
                    name="representative.address.reference_point"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom mt={2}>
                Telefone do Sócio
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DDD"
                    value={form.representative.phone_numbers[0].ddd}
                    onChange={handleChange}
                    name="representative.phone_numbers[0].ddd"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número"
                    value={form.representative.phone_numbers[0].number}
                    onChange={handleChange}
                    name="representative.phone_numbers[0].number"
                  />
                </Grid>
              </Grid>
            </Paper>
          }
        </Box>
      )}
      <MobileStepper
        variant="dots"
        steps={steps.length}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} loading={loading}>
            {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Voltar
          </Button>
        }
      />
    </Box>
  );
}
