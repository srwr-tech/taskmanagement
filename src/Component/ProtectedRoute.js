import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Protected Route Component
const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = false; // Replace with actual authentication logic (e.g., check user token or session)
  
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Element /> : <Navigate to="/login" />} // Redirects to login if not authenticated
    />
  );
};

export default ProtectedRoute;
