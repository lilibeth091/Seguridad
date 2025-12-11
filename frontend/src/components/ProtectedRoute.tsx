import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SecurityService from '../services/securityService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      const authenticated = SecurityService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();

    // Escuchar cambios en el estado de autenticación
    const handleUserChange = () => {
      checkAuth();
    };

    SecurityService.addEventListener('userChange', handleUserChange);

    return () => {
      SecurityService.removeEventListener('userChange', handleUserChange);
    };
  }, []);

  // Mostrar un loader mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;