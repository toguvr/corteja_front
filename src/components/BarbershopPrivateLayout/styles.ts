import styled from 'styled-components';
import { Toolbar } from '@mui/material';
import { theme } from '../../theme';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  min-width: 100vw;
`;

export const Content = styled.div`
  flex: 1;
  padding: 24px;
  margin: auto;
  max-width: 896px;
`;

export const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const LogoIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid #66bb6a;
  cursor: pointer;
`;

export const HeaderLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const PerfilDiv = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderLink = styled.a`
  cursor: pointer;
  margin: 0 16px;
  font-weight: bold;
  color: ${theme.palette.text.primary};
  position: relative;
  padding-bottom: 4px;

  &:hover {
    text-decoration: none;
    color: ${theme.palette.success.main};
  }

  &.active {
    color: ${theme.palette.success.main};

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background-color: ${theme.palette.success.main};
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
`;
