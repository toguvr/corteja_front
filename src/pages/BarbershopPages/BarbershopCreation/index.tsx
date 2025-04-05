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
  const [form, setForm] = useState({
    name: '',
    email: '',
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
            birthdate: '23/11/1993',
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
                      fullWidth
                      label="CNPJ"
                      value={form.document}
                      onChange={handleChange}
                      name="document"
                      type="text"
                      InputProps={{
                        inputProps: {
                          maxLength: 14,
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={form.name}
                      onChange={handleChange}
                      name="name"
                      fullWidth
                      label="Nome"
                    />
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
                      fullWidth
                      label="Celular"
                      value={form.phone}
                      onChange={handleChange}
                      name="phone"
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
                      fullWidth
                      label="Receita Anual"
                      value={form.annual_revenue}
                      onChange={handleChange}
                      name="annual_revenue"
                      InputProps={{
                        inputProps: {
                          maxLength: 14,
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                      placeholder="R$ 300.000,00"
                      type="text"
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
                      fullWidth
                      label="CPF"
                      value={form.document}
                      onChange={handleChange}
                      name="document"
                      type="text"
                      InputProps={{
                        inputProps: {
                          maxLength: 11,
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
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
                      defaultValue="augustotf93@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Celular"
                      value={form.phone}
                      onChange={handleChange}
                      name="phone"
                      InputProps={{
                        inputProps: {
                          maxLength: 11,
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                      type="text"
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
                      value={form.monthly_income}
                      onChange={handleChange}
                      name="monthly_income"
                      InputProps={{
                        inputProps: {
                          maxLength: 14,
                        },
                      }}
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
                    label="CEP"
                    value={form.address.zip_code}
                    onChange={handleChange}
                    name="address.zip_code"
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
                    value={form.representative.birth_date}
                    onChange={handleChange}
                    name="representative.birth_date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Renda Mensal"
                    value={form.representative.monthly_income}
                    onChange={handleChange}
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
                    label="CEP"
                    value={form.representative.address.zip_code}
                    onChange={handleChange}
                    name="representative.address.zip_code"
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
