// Exemplo: ProfilePage.tsx
import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import CardDialog from '../Subscriptions/CardDialog'; // ajuste o caminho conforme seu projeto

export default function Profile() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>
    </Container>
  );
}
