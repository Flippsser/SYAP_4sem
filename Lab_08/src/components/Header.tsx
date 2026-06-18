import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logo: { fontSize: 24, fontWeight: 600, color: '#1a1a2e', margin: 0 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 20 },
  nav: { display: 'flex', alignItems: 'center', gap: 16 },
  navLink: { color: '#2c3e50', textDecoration: 'none', fontWeight: 500 },
  userName: { fontSize: 16, color: '#2c3e50', fontWeight: 500 },
  logoutButton: { padding: '8px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>Каталог товаров</h1>
      <div style={styles.userInfo}>
        <nav style={styles.nav}>
          <Link to="/catalog" style={styles.navLink}>
            Каталог
          </Link>
        </nav>
        <span style={styles.userName}>{user?.username}</span>
        <button onClick={handleLogout} style={styles.logoutButton}>Выйти</button>
      </div>
    </header>
  );
}
