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
import BackLogo from '/logo-fundo.png';
interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <Container>
      <LeftSectionMobile></LeftSectionMobile>

      <LeftSection>
        <Box component="img" src={BackLogo} alt="logo nossonutri" />
      </LeftSection>

      <RightSection>
        <Content>{children}</Content>
      </RightSection>
    </Container>
  );
};

export default PublicLayout;
