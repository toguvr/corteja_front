import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import api from '../services/api';
import { useBarbershop } from './barbershop';
import { useAuth } from './auth';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  // Adicione mais campos se necessário
}

interface BarbershopServicesContextData {
  services: Service[];
  isLoading: boolean;
}

const BarbershopServicesContext = createContext<BarbershopServicesContextData>(
  {} as BarbershopServicesContextData
);

export const BarbershopServicesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { barbershop } = useBarbershop();
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchServices() {
      if (!barbershop?.id || !isAuthenticated) return;

      setIsLoading(true);

      try {
        const response = await api.get(
          `/services/barbershop/${barbershop?.id}`
        );
        setServices(response.data);
      } catch (error) {
        console.error('Erro ao buscar serviços da barbearia:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [barbershop?.id, isAuthenticated]);

  return (
    <BarbershopServicesContext.Provider value={{ services, isLoading }}>
      {children}
    </BarbershopServicesContext.Provider>
  );
};

export function useBarbershopServices(): BarbershopServicesContextData {
  return useContext(BarbershopServicesContext);
}
