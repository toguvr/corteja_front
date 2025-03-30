import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '../services/api';
import { UserCardDto } from '../dtos';
import { key } from '../config/key';
import { useAuth } from './auth';

interface UserCardsContextData {
  cards: UserCardDto[];
  isLoading: boolean;
  refreshCards: () => Promise<void>;
}

const UserCardsContext = createContext<UserCardsContextData>(
  {} as UserCardsContextData
);

export const UserCardsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<UserCardDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchUserCards() {
    setIsLoading(true);
    try {
      const savedCards = localStorage.getItem(key.userCards);

      if (savedCards) {
        const parsedCards: UserCardDto[] = JSON.parse(savedCards);
        setCards(parsedCards);
        setIsLoading(false);
        return;
      }

      const response = await api.get('/customers/card');
      setCards(response.data);
      localStorage.setItem(key.userCards, JSON.stringify(response.data));
    } catch (error) {
      console.error('Erro ao buscar os cards do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) fetchUserCards();
  }, [user?.id]);

  return (
    <UserCardsContext.Provider
      value={{ cards, isLoading, refreshCards: fetchUserCards }}
    >
      {children}
    </UserCardsContext.Provider>
  );
};

export function useUserCards(): UserCardsContextData {
  return useContext(UserCardsContext);
}
