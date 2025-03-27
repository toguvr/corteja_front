import React, { useState } from 'react';
import { TextField, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import { toast } from 'react-toastify';
import {
  ForgotPasswordTitle,
  ForgotPasswordText,
  ForgotPasswordEmail,
  RegisterLink,
} from './styles';
import PublicLayout from '../../components/PublicLayout';
import { theme } from '../../theme';
import api from '../../services/api';
import { LoginEmail } from '../CreateAccount/styles';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [values, setValues] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const code = searchParams.get('token');

  async function handleForgotPassword() {
    setErrors({});
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        password: Yup.string()
          .required('Senha obrigatória')
          .min(6, 'A senha deve conter no mínimo 6 dígitos'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password'), null],
          'Confirmação incorreta'
        ),
      });

      await schema.validate(values, { abortEarly: false });

      await api.post('/users/reset-password', {
        code,
        password: values.password,
      });

      toast.success('Senha alterada!');
      navigate('/');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors({ email: err.errors[0] });
        return;
      }
      toast.error(
        err?.response?.data?.message ||
          'Erro ao alterar senha. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <ForgotPasswordTitle>Redefinir senha</ForgotPasswordTitle>
      <ForgotPasswordText>
        Por favor, insira uma nova senha para redefini-la
      </ForgotPasswordText>

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

      <TextField
        label="Confirmar Senha"
        id="confirmPassword"
        size="small"
        fullWidth
        type="password"
        onChange={(e) =>
          setValues({ ...values, confirmPassword: e.target.value })
        }
        value={values.confirmPassword}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
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

      <LoadingButton
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleForgotPassword}
        loading={loading}
      >
        Redefinir Senha
      </LoadingButton>

      <Typography
        color="primary"
        variant="body2"
        textAlign="center"
        sx={{ mt: 2 }}
      >
        Lembrou sua senha? <RegisterLink href="/">Entrar</RegisterLink>
      </Typography>
    </PublicLayout>
  );
};
