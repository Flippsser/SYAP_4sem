import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchProductById, productsQueryKey } from '../api/products';
import { getQueryErrorMessage } from '../api/queryErrors';
import { IProduct } from '../types/types';

const styles = {
  container: { minHeight: '100vh', background: 'var(--bg-color)' },
  main: { maxWidth: 900, margin: '0 auto', padding: 30 },
  card: { background: 'var(--card-bg)', borderRadius: 16, padding: 24, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  title: { fontSize: 28, fontWeight: 600, marginBottom: 16, color: 'var(--text-color)' },
  text: { fontSize: 16, color: 'var(--text-secondary)', marginBottom: 12 },
  back: { display: 'inline-block', marginBottom: 16, color: 'var(--text-color)', textDecoration: 'none' },
  msg: { textAlign: 'center' as const, padding: 60, fontSize: 18, color: 'var(--text-secondary)' },
  error: { textAlign: 'center' as const, padding: 24, color: '#e74c3c', fontSize: 16 },
};

interface Props {
  productId: number;
}

const ProductDetailsPage: React.FC<Props> = ({ productId }) => {
  const queryClient = useQueryClient();
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    staleTime: 60000,
    gcTime: 300000,
  });

  const cachedProducts = queryClient
    .getQueriesData<IProduct[]>({ queryKey: productsQueryKey })
    .filter((query): query is [readonly unknown[], IProduct[]] => Array.isArray(query[1]));

  const fallbackProduct = cachedProducts
    .flatMap(([, products]) => products)
    .find((product) => product.id === productId);

  const product = productQuery.data ?? fallbackProduct;

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <Link to="/catalog" style={styles.back}>
          ← Назад к каталогу
        </Link>
        {productQuery.isLoading && <div style={styles.msg}>Загрузка товара...</div>}
        {productQuery.isError && !product && (
          <div style={styles.error}>{getQueryErrorMessage(productQuery.error)}</div>
        )}
        {product && (
          <div style={styles.card}>
            <h2 style={styles.title}>{product.title}</h2>
            <p style={styles.text}>Цена: ${product.price}</p>
            <p style={styles.text}>Категория: {product.category || '—'}</p>
            <p style={styles.text}>{product.description || 'Нет описания'}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetailsPage;
