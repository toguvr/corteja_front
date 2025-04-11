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
  Autocomplete,
} from '@mui/material';
import { useAuth } from '../../../hooks/auth';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import * as yup from 'yup';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { banks } from '../../../utils/banks';

const companyStepSchemas = [
  // Step 0: Dados da empresa
  yup.object({
    name: yup.string().required('Nome da empresa é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup
      .string()
      .min(6, 'Mínimo 6 caracteres')
      .required('Senha obrigatória'),
    phone: yup.string().required('Celular obrigatório'),
    document: yup.string().required('CNPJ obrigatório'),
    trading_name: yup.string().required('Razão social obrigatória'),
    company_name: yup.string().required('Nome fantasia obrigatório'),
    annual_revenue: yup.string().required('Receita anual obrigatória'),
  }),

  // Step 1: Endereço (igual ao individual)
  yup.object({
    address: yup.object({
      zip_code: yup.string().required('CEP obrigatório'),
      street: yup.string().required('Rua obrigatória'),
      street_number: yup.string().required('Número obrigatório'),
      neighborhood: yup.string().required('Bairro obrigatório'),
      city: yup.string().required('Cidade obrigatória'),
      state: yup.string().required('Estado obrigatório'),
    }),
  }),

  // Step 3: Conta Bancária
  yup.object({
    bank_code: yup.string().required('Banco obrigatório'),
    agencia: yup.string().required('Agência obrigatória'),
    agencia_dv: yup.string().required('Dígito da agência obrigatório'),
    conta: yup.string().required('Conta obrigatória'),
    conta_dv: yup.string().required('Dígito da conta obrigatório'),
    bank_account: yup.object({
      document_number: yup
        .string()
        .required('Documento do titular obrigatório'),
      legal_name: yup.string().required('Nome do titular obrigatório'),
    }),
  }),

  // Step 2: Sócio administrador
  yup.object({
    representative: yup.object({
      name: yup.string().required('Nome obrigatório'),
      email: yup.string().email('Email inválido').required('Email obrigatório'),
      document: yup.string().required('CPF obrigatório'),
      mother_name: yup.string().required('Nome da mãe obrigatório'),
      birthdate: yup.string().required('Data de nascimento obrigatória'),
      monthly_income: yup.string().required('Renda mensal obrigatória'),
      professional_occupation: yup.string().required('Ocupação obrigatória'),
      address: yup.object({
        zip_code: yup.string().required('CEP obrigatório'),
        street: yup.string().required('Rua obrigatória'),
        street_number: yup.string().required('Número obrigatório'),
        neighborhood: yup.string().required('Bairro obrigatório'),
        city: yup.string().required('Cidade obrigatória'),
        state: yup.string().required('Estado obrigatório'),
      }),
      phone: yup.string().required('Telefone obrigatório'),
    }),
  }),
];

const individualStepSchemas = [
  // Step 0: Dados pessoais
  yup.object().shape({
    barbershopName: yup.string().required('Nome da empresa é obrigatório'),
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup
      .string()
      .min(6, 'Mínimo 6 caracteres')
      .required('Senha obrigatória'),
    document: yup.string().required('CPF é obrigatório'),
    phone: yup.string().required('Celular obrigatório'),
    birth_date: yup.string().required('Data de nascimento obrigatória'),
    professional_occupation: yup.string().required('Ocupação obrigatória'),
    monthly_income: yup.string().required('Renda mensal obrigatória'),
    mother_name: yup.string().required('Nome da mãe obrigatório'),
  }),

  // Step 1: Endereço
  yup.object().shape({
    address: yup.object().shape({
      zip_code: yup.string().required('CEP obrigatório'),
      street: yup.string().required('Rua obrigatória'),
      street_number: yup.string().required('Número obrigatório'),
      neighborhood: yup.string().required('Bairro obrigatório'),
      city: yup.string().required('Cidade obrigatória'),
      state: yup.string().required('Estado obrigatório'),
    }),
  }),

  // Step 2: Conta Bancária
  yup.object().shape({
    bank_code: yup.string().required('Banco obrigatório'),
    agencia: yup.string().required('Agência obrigatória'),
    conta: yup.string().required('Conta obrigatória'),
    conta_dv: yup.string().required('Dígito obrigatório'),
    bank_account: yup.object().shape({
      document_number: yup
        .string()
        .required('Documento do titular obrigatório'),
      legal_name: yup.string().required('Nome do titular obrigatório'),
    }),
  }),
];
export default function RegisterInformationForm() {
  const { signIn } = useAuth();
  const [cepBuscado, setCepBuscado] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepBuscadoRepresentante, setCepBuscadoRepresentante] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    barbershopName: '',
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
      phone: '',
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
          'Conta Bancária',
          'Sócio Administrador',
        ];

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = async () => {
    const isIndividual = form.type === 'individual';

    const currentSchemas = isIndividual
      ? individualStepSchemas
      : companyStepSchemas;

    const currentSchema = currentSchemas[activeStep];
    const isLastStep = activeStep === currentSchemas.length - 1;

    try {
      await currentSchema.validate(form, { abortEarly: false });
      setFormErrors({});

      if (isLastStep) {
        await handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach((e) => {
          if (e.path && !errors[e.path]) {
            errors[e.path] = e.message;
          }
        });
        setFormErrors(errors);
        toast.error('Preencha todos os campos obrigatórios');
      } else {
        toast.error('Erro inesperado na validação');
      }
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
      const keys = name.split('.');

      if (keys.length === 2) {
        const [parent, child] = keys;
        setForm((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: finalValue,
          },
        }));
      } else if (keys.length === 3) {
        const [grandparent, parent, child] = keys;
        setForm((prev) => ({
          ...prev,
          [grandparent]: {
            ...prev[grandparent],
            [parent]: {
              ...prev[grandparent]?.[parent],
              [child]: finalValue,
            },
          },
        }));
      }
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
  function formatBirthdate(value: string): string {
    const cleaned = value.replace(/\D/g, ''); // remove tudo que não é número

    if (cleaned.length >= 7) {
      return cleaned.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1/$2/$3');
    } else if (cleaned.length >= 5) {
      return cleaned.replace(/^(\d{2})(\d{2})(\d{0,2})/, '$1/$2/$3');
    } else if (cleaned.length >= 3) {
      return cleaned.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    }

    return cleaned;
  }
  const buscarEndereco = async () => {
    setCepLoading(true);
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
    } finally {
      setCepLoading(false);
    }
  };
  const buscarEnderecoRepresentante = async () => {
    setCepLoading(true);
    const cepLimpo = form?.representative?.address?.zip_code.replace(/\D/g, '');
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

      setCepBuscadoRepresentante(true);
    } catch (err) {
      alert('Erro ao buscar o CEP.');
    } finally {
      setCepLoading(false);
    }
  };

  function formatPhoneNumber(phoneNumber: string) {
    // Extrai o DDD (área) e o número
    const areaCode = phoneNumber.slice(0, 2); // Primeiro os dois dígitos
    const number = phoneNumber.slice(2); // O restante do número

    return { ddd: areaCode, number: number, type: 'mobile' };
  }
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const isIndividual = form.type === 'individual';

      const payload = {
        barbershopName: isIndividual ? form.barbershopName : form.name,
        password: form.password,
        register_information: {
          type: form.type,
          document: form.document.replace(/\D/g, ''),
          name: form.name,
          email: form.email,
          phone_numbers: [formatPhoneNumber(form.phone.replace(/\D/g, ''))],
          site_url: null,
          company_name: form.company_name || '',
          trading_name: form.trading_name || '',
          annual_revenue: form.annual_revenue || '',
          address: {
            street: form.address.street,
            complementary: form.address.complementary || 'sem complemento',
            street_number: form.address.street_number,
            neighborhood: form.address.neighborhood,
            city: form.address.city,
            state: form.address.state,
            zip_code: form.address.zip_code,
            reference_point: form.address.reference_point || 'sem referencia',
          },
          ...(form.type === 'corporation' && {
            main_address: {
              street: form.address.street,
              complementary: form.address.complementary || 'sem complemento',
              street_number: form.address.street_number,
              neighborhood: form.address.neighborhood,
              city: form.address.city,
              state: form.address.state,
              zip_code: form.address.zip_code,
              reference_point: form.address.reference_point || 'sem referencia',
            },

            managing_partners: [
              {
                name: form.representative.name,
                email: form.representative.email,
                document: form.representative.document.replace(/\D/g, ''),
                type: 'individual',
                mother_name: form.representative.mother_name,
                birthdate: form.representative.birthdate,
                monthly_income: form.representative.monthly_income,
                professional_occupation:
                  form.representative.professional_occupation,
                self_declared_legal_representative:
                  form.representative.self_declared_legal_representative,
                address: {
                  street: form.address.street,
                  complementary:
                    form.address.complementary || 'sem complemento',
                  street_number: form.address.street_number,
                  neighborhood: form.address.neighborhood,
                  city: form.address.city,
                  state: form.address.state,
                  zip_code: form.address.zip_code,
                  reference_point:
                    form.address.reference_point || 'sem referencia',
                },
                phone_numbers: [
                  formatPhoneNumber(
                    form.representative.phone.replace(/\D/g, '')
                  ),
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
          holder_type: form.type === 'corporation' ? 'company' : 'individual',
          holder_document: form.bank_account.document_number.replace(/\D/g, ''),
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
    const value = isNaN(cents) ? '' : cents;

    const nameParts = e.target.name.split('.');
    if (nameParts.length === 2) {
      const [parent, child] = nameParts;
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    }
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
          <MenuItem value="corporation">Pessoa Jurídica</MenuItem>
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
          {form.type === 'corporation' ? (
            <>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CNPJ"
                      fullWidth
                      error={!!formErrors.document}
                      helperText={formErrors.document}
                      autoComplete="off"
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
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      onChange={handleChange}
                      name="name"
                      fullWidth
                      label="Nome da empresa"
                    />
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
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Senha"
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      value={form.password}
                      onChange={handleChange}
                      name="password"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Celular"
                      fullWidth
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
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
                      error={!!formErrors.trading_name}
                      helperText={formErrors.trading_name}
                      value={form.trading_name}
                      onChange={handleChange}
                      name="trading_name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      error={!!formErrors.company_name}
                      helperText={formErrors.company_name}
                      value={form.company_name}
                      onChange={handleChange}
                      name="company_name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="annual_revenue"
                      label="Receita Anual"
                      error={!!formErrors.annual_revenue}
                      helperText={formErrors.annual_revenue}
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
                      value={form.barbershopName}
                      onChange={handleChange}
                      name="barbershopName"
                      fullWidth
                      error={!!formErrors.barbershopName}
                      helperText={formErrors.barbershopName}
                      label="Nome da empresa"
                    />
                    {form.barbershopName && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, ml: 0.5, color: 'text.secondary' }}
                      >
                        Seu link:{' '}
                        <strong>
                          {import.meta.env.VITE_APP +
                            '/' +
                            slugify(form.barbershopName)}
                        </strong>
                      </Typography>
                    )}
                  </Grid>{' '}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={form.name}
                      onChange={handleChange}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      name="name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={form.email}
                      onChange={handleChange}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Senha"
                      value={form.password}
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      onChange={handleChange}
                      name="password"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CPF"
                      fullWidth
                      placeholder="Digite o CPF"
                      autoComplete="off"
                      error={!!formErrors.document}
                      helperText={formErrors.document}
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
                        setForm({ ...form, document: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 14 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Celular"
                      fullWidth
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
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
                      label="Data de nascimento"
                      fullWidth
                      error={!!formErrors.birth_date}
                      helperText={formErrors.birth_date}
                      name="birth_date"
                      value={formatBirthdate(form.birth_date)}
                      onChange={(e) => {
                        // const onlyNumbers = .replace(/\D/g, '');
                        setForm({ ...form, birth_date: e.target.value });
                      }}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ocupação"
                      error={!!formErrors.professional_occupation}
                      helperText={formErrors.professional_occupation}
                      value={form.professional_occupation}
                      onChange={handleChange}
                      name="professional_occupation"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Renda Mensal"
                      error={!!formErrors.monthly_income}
                      helperText={formErrors.monthly_income}
                      value={formatCurrency(form.monthly_income)}
                      onChange={handleMoneyChange}
                      name="monthly_income"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome da Mãe"
                      error={!!formErrors.mother_name}
                      helperText={formErrors.mother_name}
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
                    error={!!formErrors.zip_code}
                    helperText={formErrors.zip_code}
                    value={form.address.zip_code}
                    onChange={handleChange}
                    name="address.zip_code"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    loading={cepLoading}
                    onClick={buscarEndereco}
                  >
                    Buscar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rua"
                    error={!!formErrors['address.street']}
                    helperText={formErrors['address.street']}
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
                    error={!!formErrors['address.street_number']}
                    helperText={formErrors['address.street_number']}
                    name="address.street_number"
                    label="Número"
                    InputLabelProps={{ shrink: true }}
                    defaultValue="10"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    error={!!formErrors['address.complementary']}
                    helperText={formErrors['address.complementary']}
                    value={form.address.complementary}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    name="address.complementary"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={form.address.neighborhood}
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors['address.neighborhood']}
                    helperText={formErrors['address.neighborhood']}
                    onChange={handleChange}
                    name="address.neighborhood"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    error={!!formErrors['address.city']}
                    helperText={formErrors['address.city']}
                    value={form.address.city}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    name="address.city"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={form.address.state}
                    onChange={handleChange}
                    name="address.state"
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors['address.state']}
                    helperText={formErrors['address.state']}
                    label="Estado"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ponto de Referência"
                    InputLabelProps={{ shrink: true }}
                    value={form.address.reference_point}
                    error={!!formErrors['address.reference_point']}
                    helperText={formErrors['address.reference_point']}
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
                  <Autocomplete
                    options={banks}
                    getOptionLabel={(option) => option.name}
                    value={
                      banks.find((bank) => bank.value === form.bank_code) ||
                      null
                    }
                    onChange={(_, newValue) =>
                      setForm({ ...form, bank_code: newValue?.value || '' })
                    }
                    renderInput={(params) => (
                      <TextField
                        error={!!formErrors['bank_code']}
                        helperText={formErrors['bank_code']}
                        {...params}
                        label="Banco"
                        name="bank_code"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Agência"
                    error={!!formErrors['agencia']}
                    helperText={formErrors['agencia']}
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
                    error={!!formErrors['agencia_dv']}
                    helperText={formErrors['agencia_dv']}
                    onChange={handleChange}
                    name="agencia_dv"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Conta"
                    error={!!formErrors['conta']}
                    helperText={formErrors['conta']}
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
                    error={!!formErrors['conta_dv']}
                    helperText={formErrors['conta_dv']}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Documento do Titular"
                    onChange={handleChange}
                    name="bank_account.document_number"
                    value={form.bank_account.document_number}
                    error={!!formErrors['bank_account.document_number']}
                    helperText={formErrors['bank_account.document_number']}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome do Titular"
                    value={form.bank_account.legal_name}
                    onChange={handleChange}
                    name="bank_account.legal_name"
                    error={!!formErrors['bank_account.legal_name']}
                    helperText={formErrors['bank_account.legal_name']}
                  />
                </Grid>
              </Grid>
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
                    error={!!formErrors['representative.name']}
                    helperText={formErrors['representative.name']}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={form.representative.email}
                    onChange={handleChange}
                    name="representative.email"
                    error={!!formErrors['representative.email']}
                    helperText={formErrors['representative.email']}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={form.representative.document}
                    onChange={handleChange}
                    name="representative.document"
                    error={!!formErrors['representative.document']}
                    helperText={formErrors['representative.document']}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome da Mãe"
                    value={form.representative.mother_name}
                    onChange={handleChange}
                    name="representative.mother_name"
                    error={!!formErrors['representative.mother_name']}
                    helperText={formErrors['representative.mother_name']}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data de nascimento"
                    fullWidth
                    name="representative.birthdate"
                    error={!!formErrors['representative.birthdate']}
                    helperText={formErrors['representative.birthdate']}
                    value={formatBirthdate(form.representative.birthdate)}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value;
                      setForm({
                        ...form,
                        representative: {
                          ...form.representative,
                          birthdate: onlyNumbers,
                        },
                      });
                    }}
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Renda Mensal"
                    error={!!formErrors['representative.monthly_income']}
                    helperText={formErrors['representative.monthly_income']}
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
                    error={
                      !!formErrors['representative.professional_occupation']
                    }
                    helperText={
                      formErrors['representative.professional_occupation']
                    }
                    name="representative.professional_occupation"
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
                    label="CEP"
                    InputLabelProps={{ shrink: true }}
                    value={form.representative.address.zip_code}
                    onChange={handleChange}
                    name="representative.address.zip_code"
                    error={!!formErrors['representative.address.zip_code']}
                    helperText={formErrors['representative.address.zip_code']}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    loading={cepLoading}
                    onClick={buscarEnderecoRepresentante}
                  >
                    Buscar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rua"
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors['representative.address.street']}
                    helperText={formErrors['representative.address.street']}
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
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors['representative.address.street_number']}
                    helperText={
                      formErrors['representative.address.street_number']
                    }
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
                    InputLabelProps={{ shrink: true }}
                    error={!!formErrors['representative.address.complementary']}
                    helperText={
                      formErrors['representative.address.complementary']
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    InputLabelProps={{ shrink: true }}
                    value={form.representative.address.neighborhood}
                    onChange={handleChange}
                    name="representative.address.neighborhood"
                    error={!!formErrors['representative.address.neighborhood']}
                    helperText={
                      formErrors['representative.address.neighborhood']
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={form.representative.address.city}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    name="representative.address.city"
                    error={!!formErrors['representative.address.city']}
                    helperText={formErrors['representative.address.city']}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estado"
                    value={form.representative.address.state}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    name="representative.address.state"
                    error={!!formErrors['representative.address.state']}
                    helperText={formErrors['representative.address.state']}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ponto de Referência"
                    value={form.representative.address.reference_point}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    name="representative.address.reference_point"
                    error={
                      !!formErrors['representative.address.reference_point']
                    }
                    helperText={
                      formErrors['representative.address.reference_point']
                    }
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom mt={2}>
                Telefone do Sócio
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Celular"
                    fullWidth
                    margin="normal"
                    size="small"
                    error={!!formErrors['representative.phone']}
                    helperText={formErrors['representative.phone']}
                    value={form.representative.phone}
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
                      setForm({
                        ...form,
                        representative: {
                          ...form.representative,
                          phone: onlyNumbers,
                        },
                      });
                    }}
                    inputProps={{ maxLength: 15 }}
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
