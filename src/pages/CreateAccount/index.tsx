import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  Typography,
  Stack,
  Button,
} from '@mui/material';
import PersonSharp from '@mui/icons-material/PersonSharp';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import PhoneSharpIcon from '@mui/icons-material/PhoneSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import PublicLayout from '../../components/PublicLayout';
import InputMask from 'react-input-mask';
import { LoginTitle, LoginEmail, LoginPassword, RegisterLink } from './styles';
import { theme } from '../../theme';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { isValidCellphone, isValidCPF } from '../../utils/validators';
import { key } from '../../config/key';
export const CreateAccount = () => {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    document: '',
    confirmPassword: '',
  });
  const handleChange = (e) => {
    // Remove todos os caracteres não numéricos antes de salvar
    const rawValue = e.target.value.replace(/\D/g, '');
    setValues({ ...values, phone: rawValue });
  };
  async function handleCreateAccount() {
    setErrors({});
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        document: Yup.string()
          .test('is-valid-cpf', 'CPF inválido', (value) =>
            value ? isValidCPF(value) : false
          )
          .required('CPF obrigatório'),
        phone: Yup.string()
          .test('is-valid-cellphone', 'Celular inválido', (value) =>
            value ? isValidCellphone(value) : false
          )
          .required('Celular obrigatório'),
        email: Yup.string()
          .email('Email inválido')
          .required('Email obrigatório'),
        password: Yup.string()
          .min(6, 'Mínimo de 6 caracteres')
          .required('Senha obrigatória'),
      });

      await schema.validate(values, { abortEarly: false });
      await api.post('/customers', {
        ...values,
        phone: values.phone.replace(/\D/g, ''),
        document: values.document.replace(/\D/g, ''),
      });

      toast.success('Cadastrado com sucesso!');
      const slug = localStorage.getItem(key.slug);
      await signIn({
        email: values.email,
        password: values.password,
        role: 'customer',
        page: '/agendar/' + slug,
      });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          validationErrors[error.path as string] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
      toast.error(
        err?.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <LoginTitle>Criar uma conta</LoginTitle>
      <Typography variant="body2" textAlign="center">
        Por favor, insira seus dados para se cadastrar
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Nome"
          id="name"
          color="primary"
          size="small"
          fullWidth
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          value={values.name}
          error={!!errors.name}
          helperText={errors.name}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonSharp
                  sx={{ fontSize: 18, color: theme.palette.primary.main }}
                />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Celular"
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.phone}
          helperText={errors.phone}
          value={values.phone}
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
              onlyNumbers = onlyNumbers.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            }
            setValues({ ...values, phone: onlyNumbers });
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneSharpIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 15 }}
        />
        <TextField
          label="CPF"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          autoComplete="off"
          error={!!errors.document}
          helperText={errors.document}
          value={values.document}
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
              onlyNumbers = onlyNumbers.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
            }
            setValues({ ...values, document: onlyNumbers });
          }}
          inputProps={{ maxLength: 14 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIndIcon
                  sx={{ fontSize: 18, color: theme.palette.primary.main }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          id="email"
          label="Email"
          type="email"
          size="small"
          fullWidth
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          value={values.email}
          error={!!errors.email}
          helperText={errors.email}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailSharpIcon
                  sx={{ fontSize: 18, color: theme.palette.primary.main }}
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Senha"
          id="password"
          size="small"
          fullWidth
          type="password"
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          value={values.password}
          error={!!errors.password}
          helperText={errors.password}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockSharpIcon
                  sx={{ fontSize: 18, color: theme.palette.primary.main }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleCreateAccount}
        loading={loading}
      >
        Cadastrar
      </Button>

      <Typography
        color="primary"
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
      >
        Já possui uma conta? <RegisterLink href="/">Entrar</RegisterLink>
      </Typography>
    </PublicLayout>
  );
};
