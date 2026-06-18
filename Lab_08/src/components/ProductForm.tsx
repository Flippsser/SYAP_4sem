import React, { useState } from 'react';
import { IProduct } from '../types/types';
import { ProductFormSchema, ProductFormData } from '../schemas/productSchema';

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  modal: { background: 'white', borderRadius: 16, padding: 30, width: 400 },
  title: { fontSize: 24, fontWeight: 600, marginBottom: 24, textAlign: 'center' as const },
  input: { width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 10, fontSize: 16, marginBottom: 16, boxSizing: 'border-box' as const },
  error: { color: '#e74c3c', fontSize: 12, marginTop: -12, marginBottom: 16 },
  buttons: { display: 'flex', gap: 12, marginTop: 24 },
  btn: { flex: 1, padding: 12, border: 'none', borderRadius: 10, fontSize: 16, cursor: 'pointer' },
  cancel: { background: '#f0f0f0', color: '#666' },
  submit: { background: '#27ae60', color: 'white' },
};

interface Props {
  product: IProduct | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData, id?: number) => Promise<void>;
}

export function ProductForm({ product, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: ProductFormData = {
      title,
      price: parseFloat(price) || 0,
      description: product?.description || '',
      category: product?.category || '',
      thumbnail: product?.thumbnail || '',
    };

    const result = ProductFormSchema.safeParse(data);
    
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const errs: Record<string, string> = {};
      Object.entries(flat).forEach(([k, v]) => { if (v) errs[k] = v[0]; });
      setErrors(errs);
      alert(Object.entries(errs).map(([f, m]) => `${f}: ${m}`).join('\n'));
      return;
    }

    await onSubmit(data, product?.id);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>{product ? 'Изменить' : 'Добавить'}</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Название (мин. 3 символа)" />
          {errors.title && <div style={styles.error}>{errors.title}</div>}
          
          <input style={styles.input} value={price} onChange={e => setPrice(e.target.value)} placeholder="Цена (больше 0)" />
          {errors.price && <div style={styles.error}>{errors.price}</div>}
          
          <div style={styles.buttons}>
            <button type="button" onClick={onClose} style={{ ...styles.btn, ...styles.cancel }}>Отмена</button>
            <button type="submit" style={{ ...styles.btn, ...styles.submit }}>{product ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}