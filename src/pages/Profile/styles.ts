import styled from 'styled-components';
import { theme } from '../../theme/index.ts';

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
