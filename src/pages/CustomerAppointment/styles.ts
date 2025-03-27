import styled from 'styled-components';
import { theme } from '../../theme/index.ts';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

export const LeftSection = styled.div`
  flex: 1;
  background-color: ${theme.palette.primary.main}; /* Verde primary */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff; /* Texto branco */
`;

export const Logo = styled.h1`
  font-size: 48px;
  font-weight: bold;
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5; /* Fundo claro */
`;

export const Content = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export const LoginTitle = styled.h1`
  color: ${theme.palette.primary.main};
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

export const LoginEmail = styled.h2`
  color: ${theme.palette.primary.main};
  font-size: 16px;
  margin-top: 24px;
  margin-bottom: 4px;
`;

export const LoginPassword = styled.h2`
  color: ${theme.palette.primary.main};
  font-size: 16px;
  margin-top: 18px;
  margin-bottom: 4px;
`;

export const ForgotPassword = styled.a`
  color: ${theme.palette.secondary.main};
  font-size: 14px;
  text-decoration: none;
  text-align: right;
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: ${theme.palette.secondary.main};
  }
`;

export const RegisterLink = styled.a`
  color: ${theme.palette.secondary.main};
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  margin-top: 16px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: ${theme.palette.secondary.main};
  }
`;
