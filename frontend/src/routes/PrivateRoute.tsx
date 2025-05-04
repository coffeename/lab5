import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  // Якщо не залогінені — кидаємо на /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Якщо залогінені — рендеримо вкладені роутері
  return <Outlet />;
}