import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '../services/api';
import { useBarbershop } from './barbershop';
import { BalanceDto } from '../dtos';
import { useAuth } from './auth';

interface BalanceContextData {
  balance: BalanceDto | null;
  isLoading: boolean;
  fetchBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextData>(
  {} as BalanceContextData
);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const { barbershop } = useBarbershop();
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<BalanceDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchBalance() {
    if (!barbershop?.id || !isAuthenticated) return;

    setIsLoading(true);

    try {
      const response = await api.get(
        `/balances/mine?barbershopId=${barbershop?.id}`
      );
      setBalance(response.data);
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchBalance();
  }, [barbershop?.id, isAuthenticated]);

  return (
    <BalanceContext.Provider value={{ balance, isLoading, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export function useBalance(): BalanceContextData {
  return useContext(BalanceContext);
}
