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
import api from '../services/api';
import { BarbershopDto, CustomerDto } from '../dtos';

interface AuthState {
  access_token: string;
  refresh_token: string;
  role?: 'customer' | 'admin';
  user: CustomerDto | BarbershopDto;
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
  user: CustomerDto | BarbershopDto;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  role?: 'customer' | 'admin';
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [data, setData] = useState<AuthState>(() => {
    const refresh_token = localStorage.getItem(key.refreshToken);
    const access_token = localStorage.getItem(key.token);
    const user = localStorage.getItem(key.user);
    const role = localStorage.getItem(key.role);

    if (access_token && user && refresh_token) {
      api.defaults.headers.authorization = `Bearer ${access_token}`;

      return { access_token, user: JSON.parse(user), refresh_token, role };
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
    if (role === 'admin') {
      localStorage.setItem(key.role, 'admin');
      localStorage.setItem(key.slug, user.slug);
    } else {
      localStorage.setItem(key.role, 'customer');
    }
    localStorage.setItem(key.refreshToken, refresh_token);
    localStorage.setItem(key.token, access_token);
    localStorage.setItem(key.user, JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${access_token}`;

    setData({ access_token, user, refresh_token });
    navigate(page || '/dashboard');
  };

  const signOut = useCallback(() => {
    const role = localStorage.getItem(key.role);
    const slug = localStorage.getItem(key.slug);
    localStorage.clear();
    localStorage.setItem(key.slug, slug!!);
    if (role === 'admin') {
      localStorage.setItem(key.role, 'admin');
    }
    setData({} as AuthState);
  }, []);

  useEffect(() => {
    api.registerInterceptTokenManager(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        isAuthenticated: !!data.user,
        role: data.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
