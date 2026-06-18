import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import RegistrationForm from './components/RegistrationForm';
import CatalogPage from './pages/CatalogPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <ProductProvider>
      <CatalogPage />
    </ProductProvider>
  ) : (
    <RegistrationForm />
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