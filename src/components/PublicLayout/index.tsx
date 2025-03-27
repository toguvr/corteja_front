import React from 'react';
import {
  Container,
  LeftSection,
  RightSection,
  Logo,
  Content,
  LeftSectionMobile,
  LogoIcon,
} from './styles';
import { Box } from '@mui/material';
import BackLogo from '../../assets/logotext-transparent.png';
interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <Container>
      <LeftSectionMobile></LeftSectionMobile>

      <LeftSection></LeftSection>

      <RightSection>
        <Content>{children}</Content>
      </RightSection>
    </Container>
  );
};

export default PublicLayout;
