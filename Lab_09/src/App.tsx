import React, { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { RecoilRoot, useRecoilValue } from 'recoil-next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { themeSelector } from './state/uiSettingsState';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const theme = useRecoilValue(themeSelector);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      {isAuthenticated && <Header />}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <RecoilRoot>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RecoilRoot>
  );
}

export default App;
