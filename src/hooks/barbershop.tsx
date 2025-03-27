import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { BarbershopDto } from '../dtos';
import { key } from '../config/key';

interface BarbershopContextData {
  barbershop: BarbershopDto | null;
  isLoading: boolean;
}

const BarbershopContext = createContext<BarbershopContextData>(
  {} as BarbershopContextData
);

export const BarbershopProvider = ({ children }: { children: ReactNode }) => {
  const [barbershop, setBarbershop] = useState<BarbershopDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const slug = localStorage.getItem(key.slug);

  useEffect(() => {
    async function fetchBarbershop() {
      if (!slug) return;
      const savedData = localStorage.getItem(key.barbershop);

      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed?.slug === slug) {
          setBarbershop(parsed);
          setIsLoading(false);
          return;
        }
      }

      try {
        const response = await api.get(`/barbershops/slug/${slug}`);
        setBarbershop(response.data);
        localStorage.setItem(key.barbershop, JSON.stringify(response.data));
      } catch (error) {
        console.error('Erro ao buscar barbearia:', error);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    fetchBarbershop();
  }, [slug]);

  return (
    <BarbershopContext.Provider value={{ barbershop, isLoading }}>
      {children}
    </BarbershopContext.Provider>
  );
};

export function useBarbershop(): BarbershopContextData {
  return useContext(BarbershopContext);
}
