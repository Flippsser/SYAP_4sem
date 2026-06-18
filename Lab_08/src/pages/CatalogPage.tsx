import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  productsQueryKey,
  SIMPLE_CATEGORIES,
  toSimpleCategory,
  updateProduct,
} from '../api/products';
import { getQueryErrorMessage } from '../api/queryErrors';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { IProduct } from '../types/types';
import { ProductFormData } from '../schemas/productSchema';

const styles = {
  container: { minHeight: '100vh', background: '#f9f9f9' },
  main: { maxWidth: 1200, margin: '0 auto', padding: 30 },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 600 },
  addBtn: { padding: '12px 24px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, cursor: 'pointer' },
  select: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 10, fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 },
  msg: { textAlign: 'center' as const, padding: 60, fontSize: 18, color: '#666' },
  error: { textAlign: 'center' as const, padding: 24, color: '#e74c3c', fontSize: 16 },
};

interface Props {
  category?: string;
}

const CatalogPage: React.FC<Props> = ({ category }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [showForm, setShowForm] = useState(false);

  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
    staleTime: 60000,
    gcTime: 300000,
  });

  const products = useMemo(() => {
    const all = productsQuery.data ?? [];
    if (!category) return all;
    return all.filter((p) => toSimpleCategory(p.category || '') === category);
  }, [productsQuery.data, category]);

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => createProduct(data),
    onSuccess: (newProduct) => {
      queryClient.setQueryData<IProduct[]>(productsQueryKey, (old) =>
        old ? [newProduct, ...old] : [newProduct]
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });
      const affectedQueries = queryClient
        .getQueriesData<IProduct[]>({ queryKey: productsQueryKey })
        .filter((query): query is [readonly unknown[], IProduct[]] => Array.isArray(query[1]));

      affectedQueries.forEach(([key, products]) => {
        queryClient.setQueryData<IProduct[]>(
          key,
          products.filter((product) => product.id !== id)
        );
      });

      return { affectedQueries };
    },
    onError: (_error, _id, context) => {
      context?.affectedQueries.forEach(([key, products]) => {
        queryClient.setQueryData(key, products);
      });
      alert('Не удалось удалить товар. Изменения откатены.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });

  const handleSubmit = async (data: ProductFormData, id?: number) => {
    if (typeof id === 'number') {
      await updateMutation.mutateAsync({ id, data });
      return;
    }
    await createMutation.mutateAsync(data);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleCategoryChange = (selected: string) => {
    navigate({
      to: '/catalog',
      search: selected ? { category: selected } : {},
    });
  };

  if (productsQuery.isLoading) {
    return <div style={styles.container}><div style={styles.msg}>Загрузка...</div></div>;
  }

  if (productsQuery.isError) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{getQueryErrorMessage(productsQuery.error)}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.toolbar}>
          <h2 style={styles.title}>Товары</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              value={category ?? ''}
              onChange={(event) => handleCategoryChange(event.target.value)}
              style={styles.select}
            >
              <option value="">Все категории</option>
              {SIMPLE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button onClick={() => { setEditProduct(null); setShowForm(true); }} style={styles.addBtn}>+ Добавить</button>
          </div>
        </div>
        
        {products.length ? (
          <div style={styles.grid}>
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={() => { setEditProduct(p); setShowForm(true); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div style={styles.msg}>Нет товаров</div>
        )}
      </main>
      
      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CatalogPage;