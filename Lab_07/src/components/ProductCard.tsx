import React from 'react';
import { IProduct } from '../types/types';

const styles = {
  card: { background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  title: { fontSize: 18, fontWeight: 600, marginBottom: 12 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 20, fontWeight: 700, color: '#27ae60' },
  actions: { display: 'flex', gap: 8 },
  btn: { padding: '6px 14px', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  edit: { background: '#3498db', color: 'white' },
  del: { background: '#e74c3c', color: 'white' },
};

interface Props {
  product: IProduct;
  onEdit: () => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{product.title}</h3>
      <div style={styles.footer}>
        <span style={styles.price}>${product.price}</span>
        <div style={styles.actions}>
          <button onClick={onEdit} style={{ ...styles.btn, ...styles.edit }}>Изменить</button>
          <button onClick={() => onDelete(product.id)} style={{ ...styles.btn, ...styles.del }}>Удалить</button>
        </div>
      </div>
    </div>
  );
}