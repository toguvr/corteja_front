import React, { ReactNode } from 'react';
import { AuthProvider } from './auth';
import { BarbershopProvider } from './barbershop';
import { BarbershopServicesProvider } from './service';
import { BalanceProvider } from './balance';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <BarbershopProvider>
        <BarbershopServicesProvider>
          <BalanceProvider>{children}</BalanceProvider>
        </BarbershopServicesProvider>
      </BarbershopProvider>
    </AuthProvider>
  );
};

export default AppProvider;
