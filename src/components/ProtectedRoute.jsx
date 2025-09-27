import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  // If there's no token, redirect to the /login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child components
  return <Outlet />;
};

export default ProtectedRoute;