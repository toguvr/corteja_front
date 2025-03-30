import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils';
import { toast } from 'react-toastify';
import {
  LoginTitle,
  LoginEmail,
  LoginPassword,
  ForgotPassword,
  RegisterLink,
  LogoIcon,
} from './styles';
import { theme } from '../../theme';
import PublicLayout from '../../components/PublicLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { key } from '../../config/key';

export const SignIn = () => {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);
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
      const slug = localStorage.getItem(key.slug);

      await signIn({ ...values, role: 'customer', page: '/agendar/' + slug });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message || 'Erro ao fazer login'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <LoginTitle>Bem-vindo de volta!</LoginTitle>
      <Typography variant="body2" textAlign="center">
        Por favor, insira seus dados para fazer login
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          color="primary"
          label="Email"
          id="email"
          size="small"
          type="email"
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
          id="password"
          label="Senha"
          size="small"
          fullWidth
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          value={values.password}
          error={!!errors.password}
          helperText={errors.password}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  edge="end"
                >
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
      <ForgotPassword href="/esqueci-senha">Esqueceu a senha?</ForgotPassword>
      <LoadingButton
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSignIn}
        loading={loading}
      >
        Entrar
      </LoadingButton>
      <Typography
        color="primary"
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
      >
        Não tem uma conta?{' '}
        <RegisterLink href="/criar-conta">Cadastre-se</RegisterLink>
      </Typography>
    </PublicLayout>
  );
};
