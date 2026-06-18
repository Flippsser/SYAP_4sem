import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useRecoilValue, useRecoilCallback,  useSetRecoilState} from 'recoil-next';
import { useAuth } from '../contexts/AuthContext';
import { cartCountState,  cartState } from '../state/cartState';
import { uiSettingsState } from '../state/uiSettingsState';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 30px',
    backgroundColor: 'var(--header-bg)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logo: { fontSize: 24, fontWeight: 600, color: 'var(--text-color)', margin: 0 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 20 },
  nav: { display: 'flex', alignItems: 'center', gap: 16 },
  navLink: { color: 'var(--text-color)', textDecoration: 'none', fontWeight: 500 },
  userName: { fontSize: 16, color: 'var(--text-color)', fontWeight: 500 },
  logoutButton: { padding: '8px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  badge: {
    position: 'absolute' as const,
    top: '-8px',
    right: '-12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
  },
  cartLink: {
    position: 'relative' as const,
    display: 'inline-flex',
    color: 'var(--text-color)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  resetBtn: {
    padding: '6px 14px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = useRecoilValue(cartCountState);



  const setCart = useSetRecoilState(cartState)
  const setUiSettings = useSetRecoilState(uiSettingsState)
  const aga = () => {
  setCart([])

  setUiSettings(current => ({
    ...current,
    theme: 'dark',
  }))
}



  const resetSettings = useRecoilCallback(({ reset }) => () => {
    reset(uiSettingsState);
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>Каталог товаров</h1>
      <button onClick={aga} >Ага</button>
      <div style={styles.userInfo}>
        <nav style={styles.nav}>
          <Link to="/catalog" style={styles.navLink}>
            Каталог
          </Link>
          <Link to="/cart" style={styles.cartLink}>
            Корзина
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
          <button onClick={resetSettings} style={styles.resetBtn}>Сбросить настройки</button>
        </nav>
        <span style={styles.userName}>{user?.username}</span>
        <button onClick={handleLogout} style={styles.logoutButton}>Выйти</button>
      </div>
    </header>
  );
}
