import React from 'react';
import { Link } from '@tanstack/react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil-next';
import { IProduct } from '../types/types';
import { favoritesState } from '../state/favoritesState';
import { cartState } from '../state/cartState';

const styles = {
  card: { background: 'var(--card-bg)', borderRadius: 12, padding: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: 600, marginBottom: 12, wordBreak: 'break-word' as const, flex: 1 },
  titleLink: { color: 'var(--text-color)', textDecoration: 'none' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  price: { fontSize: 20, fontWeight: 700, color: '#27ae60', whiteSpace: 'nowrap' as const },
  actions: { display: 'flex', gap: 6, flexWrap: 'wrap' as const, justifyContent: 'flex-end' },
  btn: { padding: '6px 10px', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' as const },
  edit: { background: '#3498db', color: 'white' },
  del: { background: '#e74c3c', color: 'white' },
  favBtn: (active: boolean) => ({
    padding: '6px 10px',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
    background: active ? '#ffe0e0' : 'var(--card-bg)',
    color: active ? '#e74c3c' : 'var(--text-secondary)',
    flexShrink: 0,
  }),
  cartBtn: {
    padding: '6px 8px',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    background: '#e8f5e9',
    color: '#27ae60',
    flexShrink: 0,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
};

interface Props {
  product: IProduct;
  onEdit: () => void;
  onDelete: (id: number) => Promise<void> | void;
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const favorites = useRecoilValue(favoritesState);
  const setFavorites = useSetRecoilState(favoritesState);
  const setCart = useSetRecoilState(cartState);

  const isFavorite = favorites.includes(product.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: product.id, quantity: 1 }];
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <h3 style={styles.title}>
          <Link to="/product/$id" params={{ id: String(product.id) }} style={styles.titleLink}>
            {product.title}
          </Link>
        </h3>
        <button onClick={toggleFavorite} style={styles.favBtn(isFavorite)}>
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div style={styles.footer}>
        <span style={styles.price}>${product.price}</span>
        <div style={styles.actions}>
          <button onClick={addToCart} style={styles.cartBtn}>+</button>
          <button onClick={onEdit} style={{ ...styles.btn, ...styles.edit }}>Изменить</button>
          <button onClick={() => onDelete(product.id)} style={{ ...styles.btn, ...styles.del }}>Удалить</button>
        </div>
      </div>
    </div>
  );
}
