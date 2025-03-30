import React, { ReactNode } from 'react';
import { AuthProvider } from './auth';
import { BarbershopProvider } from './barbershop';
import { BarbershopServicesProvider } from './service';
import { BalanceProvider } from './balance';
import { UserCardsProvider } from './cards';
import { UserAddressProvider } from './address';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <UserCardsProvider>
        <UserAddressProvider>
          <BarbershopProvider>
            <BarbershopServicesProvider>
              <BalanceProvider>{children}</BalanceProvider>
            </BarbershopServicesProvider>
          </BarbershopProvider>
        </UserAddressProvider>
      </UserCardsProvider>
    </AuthProvider>
  );
};

export default AppProvider;
