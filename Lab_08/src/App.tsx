import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';

function AppContent() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Header />}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;