import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { IProduct, IProductState, TProductAction } from '../types/types';
import { ProductFormData } from '../schemas/productSchema';

const API_BASE_URL = 'https://dummyjson.com/products';

const initialState: IProductState = {
  products: [],
  loading: false,
  error: null
};

function productReducer(state: IProductState, action: TProductAction): IProductState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false, error: null };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

interface IProductContextValue extends IProductState {
  fetchProducts: () => void;
  createProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (id: number, product: ProductFormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<IProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    fetch(API_BASE_URL)
      .then(r => r.json())
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: data.products || [] }))
      .catch(() => dispatch({ type: 'SET_ERROR', payload: 'Ошибка загрузки' }));
  }, []);

  const createProduct = async (productData: ProductFormData) => {
    try {
      const r = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (r.ok) {
        const newProduct = await r.json();
        dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      }
    } catch {
      dispatch({ type: 'ADD_PRODUCT', payload: { ...productData, id: Date.now() } });
    }
  };

  const updateProduct = async (id: number, productData: ProductFormData) => {
    try {
      const r = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (r.ok) {
        const updated = await r.json();
        dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      } else {

        dispatch({ type: 'UPDATE_PRODUCT', payload: { ...productData, id } });
      }
    } catch {

      dispatch({ type: 'UPDATE_PRODUCT', payload: { ...productData, id } });
    }
  };

const deleteProduct = async (id: number) => {
  try {
    const r = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    
    if (r.ok) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } else {

      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  } catch {

    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  }
};

  return (
    <ProductContext.Provider value={{ ...state, fetchProducts, createProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}