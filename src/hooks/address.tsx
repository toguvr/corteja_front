import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '../services/api';
import { AddressDto } from '../dtos';
import { key } from '../config/key';
import { useAuth } from './auth';

interface UserAddressContextData {
  address: AddressDto;
  isLoading: boolean;
  refreshAddresses: () => Promise<void>;
}

const UserAddressContext = createContext<UserAddressContextData>(
  {} as UserAddressContextData
);

export const UserAddressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [address, setAddresses] = useState<AddressDto>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchUserAddresses() {
    setIsLoading(true);
    try {
      const savedAddresses = localStorage.getItem(key.userAddresses);

      if (savedAddresses) {
        const parsedAddresses: AddressDto = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        setIsLoading(false);
        return;
      }

      const response = await api.get('/customers/address');
      setAddresses(response.data);
      localStorage.setItem(key.userAddresses, JSON.stringify(response.data));
    } catch (error) {
      console.error('Erro ao buscar os endereços do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) fetchUserAddresses();
  }, [user?.id]);

  return (
    <UserAddressContext.Provider
      value={{ address, isLoading, refreshAddresses: fetchUserAddresses }}
    >
      {children}
    </UserAddressContext.Provider>
  );
};

export function useUserAddresses(): UserAddressContextData {
  return useContext(UserAddressContext);
}
