import React, { useEffect, useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { IProduct } from '../types/types';

const styles = {
  container: { minHeight: '100vh', background: '#f9f9f9' },
  main: { maxWidth: 1200, margin: '0 auto', padding: 30 },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 600 },
  addBtn: { padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 },
  msg: { textAlign: 'center' as const, padding: 60, fontSize: 18, color: '#666' },
};

const CatalogPage: React.FC = () => {
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {fetchProducts();}, [fetchProducts]);

  if (loading) {
    return <div style={styles.container}><Header /><div style={styles.msg}>Загрузка...</div></div>;
  }

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.main}>
        <div style={styles.toolbar}>
          <h2 style={styles.title}>Товары</h2>
          <button onClick={() => { setEditProduct(null); setShowForm(true); }} style={styles.addBtn}>+ Добавить</button>
        </div>
        
        {products.length ? (
          <div style={styles.grid}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} onEdit={() => { setEditProduct(p); setShowForm(true); }} onDelete={deleteProduct} />
            ))}
          </div>
        ) : (
          <div style={styles.msg}>Нет товаров</div>
        )}
      </main>
      
      {showForm && <ProductForm product={editProduct} onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default CatalogPage;