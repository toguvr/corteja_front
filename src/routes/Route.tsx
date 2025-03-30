import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { key } from '../config/key';

export const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  React.useEffect(() => {
    if (slug) {
      localStorage.setItem(key.slug, slug);
    }
  }, [slug]);
  return isAuthenticated ? element : <Navigate to="/" />;
};
