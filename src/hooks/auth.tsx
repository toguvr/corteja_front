import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { key } from '../config/key';
import { User } from '../dtos';
import api from '../services/api';

interface AuthState {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
  page?: string;
  role?: 'customer' | 'admin';
}

interface SignInCredentialsSocial {
  email: string;
  password: string;
  name: string;
  celphone?: string;
  photoUrl?: string;
  gender?: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [data, setData] = useState<AuthState>(() => {
    const refresh_token = localStorage.getItem(key.refreshToken);
    const access_token = localStorage.getItem(key.token);
    const user = localStorage.getItem(key.user);

    if (access_token && user && refresh_token) {
      api.defaults.headers.authorization = `Bearer ${access_token}`;

      return { access_token, user: JSON.parse(user), refresh_token };
    }

    return {} as AuthState;
  });

  const signIn = async ({ email, password, page, role }: SignInCredentials) => {
    const response = await api.post('authentications', {
      email,
      password,
      role,
    });

    const { access_token, user, refresh_token } = response.data;

    localStorage.setItem(key.refreshToken, refresh_token);
    localStorage.setItem(key.token, access_token);
    localStorage.setItem(key.user, JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${access_token}`;

    setData({ access_token, user, refresh_token });
    navigate(page || '/dashboard');
  };

  const signOut = useCallback(() => {
    const slug = localStorage.getItem(key.slug);
    localStorage.clear();
    localStorage.setItem(key.slug, slug!!);

    setData({} as AuthState);
  }, []);

  useEffect(() => {
    api.registerInterceptTokenManager(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, isAuthenticated: !!data.user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
