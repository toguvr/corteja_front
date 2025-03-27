import styled from 'styled-components';
import { theme } from '../../theme/index.ts';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    background-color: ${theme.palette.primary.main};
  }
`;

export const LogoIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  border-radius: 50%;
  border: 2px solid #66bb6a;
  @media (min-width: 768px) {
    display: none;
  }
`;
export const LeftSection = styled.div`
  flex: 1;
  background-color: ${theme.palette.primary.main};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LeftSectionMobile = styled.div`
  display: none;
`;

export const Logo = styled.h1`
  font-size: 48px;
  font-weight: bold;
  text-align: center;

  @media (max-width: 768px) {
    display: block;
    font-size: 36px;
    margin-bottom: 20px;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    background-color: transparent; /* 🔹 Remove o fundo branco no mobile */
    width: 100%;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;
