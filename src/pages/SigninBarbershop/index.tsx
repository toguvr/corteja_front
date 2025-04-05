// pages/entrar/barbearia.tsx
import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  Typography,
  Stack,
  IconButton,
  Button,
} from '@mui/material';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils';
import { toast } from 'react-toastify';

import { theme } from '../../theme';
import PublicLayout from '../../components/PublicLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ForgotPassword, LoginTitle, RegisterLink } from './styles';

const SignInBarbershop = () => {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleSignIn() {
    setErrors({});
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Email inválido')
          .required('Email obrigatório'),
        password: Yup.string()
          .min(6, 'Mínimo de 6 caracteres')
          .required('Senha obrigatória'),
      });

      await schema.validate(values, { abortEarly: false });

      await signIn({
        ...values,
        role: 'admin',
        page: '/empresa/dashboard',
      });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      toast.error(err?.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <LoginTitle>Login de Admin</LoginTitle>
      <Typography variant="body2" textAlign="center">
        Faça login para gerenciar sua empresa.
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Email"
          size="small"
          fullWidth
          type="email"
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          value={values.email}
          error={!!errors.email}
          helperText={errors.email}
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
          size="small"
          fullWidth
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          value={values.password}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
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

      <ForgotPassword href="/esqueci-senha/barbearia">
        Esqueceu a senha?
      </ForgotPassword>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSignIn}
        loading={loading}
      >
        Entrar
      </Button>

      <Typography
        color="primary"
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
      >
        Ainda não tem uma empresa?{' '}
        <RegisterLink href="/criar-empresa">Cadastre-se</RegisterLink>
      </Typography>
    </PublicLayout>
  );
};

export default SignInBarbershop;
