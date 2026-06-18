import React from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil-next';
import { fetchProducts, productsQueryKey } from '../api/products';
import { cartState, cartCountState, cartProductsSelector } from '../state/cartState';

const styles = {
  container: { minHeight: '100vh', background: 'var(--bg-color)' },
  main: { maxWidth: 900, margin: '0 auto', padding: 30 },
  title: { fontSize: 28, fontWeight: 600, marginBottom: 24 },
  card: { background: 'var(--card-bg)', borderRadius: 12, padding: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginBottom: 16 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 600, color: 'var(--text-color)' },
  price: { fontSize: 16, color: '#27ae60', fontWeight: 700 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 12 },
  qtyBtn: { padding: '4px 12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 16, cursor: 'pointer', background: 'var(--card-bg)', color: 'var(--text-color)' },
  qty: { fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: 'center' as const },
  removeBtn: { padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  clearBtn: { padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', marginTop: 16 },
  back: { display: 'inline-block', marginBottom: 16, color: 'var(--text-color)', textDecoration: 'none' },
  msg: { textAlign: 'center' as const, padding: 60, fontSize: 18, color: 'var(--text-secondary)' },
  total: { fontSize: 20, fontWeight: 700, marginTop: 16, textAlign: 'right' as const, color: 'var(--text-color)' },
};

const CartPage: React.FC = () => {
  const setCart = useSetRecoilState(cartState);
  const cartCount = useRecoilValue(cartCountState);

  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
    staleTime: 60000,
    gcTime: 300000,
  });

  const products = productsQuery.data ?? [];
  const cartProducts = useRecoilValue(cartProductsSelector(products));

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <Link to="/catalog" style={styles.back}>← Назад к каталогу</Link>
        <h2 style={styles.title}>Корзина ({cartCount} товаров)</h2>

        {cartProducts.length === 0 ? (
          <div style={styles.msg}>Корзина пуста</div>
        ) : (
          <>
            {cartProducts.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.row}>
                  <span style={styles.name}>{item.title}</span>
                  <span style={styles.price}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div style={{ ...styles.row, marginTop: 12 }}>
                  <div style={styles.qtyRow}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>−</button>
                    <span style={styles.qty}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={styles.removeBtn}>Удалить</button>
                </div>
              </div>
            ))}
            <div style={styles.total}>Итого: ${total.toFixed(2)}</div>
            <button onClick={clearCart} style={styles.clearBtn}>Очистить все</button>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;
