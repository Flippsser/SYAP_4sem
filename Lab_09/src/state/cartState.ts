import { atom, selector, selectorFamily } from 'recoil-next';
import { IProduct } from '../types/types';

export interface CartItem {
  id: number;
  quantity: number;
}

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    try {
      setSelf(JSON.parse(savedValue));
    } catch {
      localStorage.removeItem(key);
    }
  }
  onSet((newValue: CartItem[]) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const cartState = atom<CartItem[]>({
  key: 'cartState',
  default: [],
  effects_UNSTABLE: [localStorageEffect('cart')],
});

export const cartCountState = selector<number>({
  key: 'cartCountState',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
});

export interface CartItemWithProduct extends IProduct {
  quantity: number;
}

export const cartProductsSelector = selectorFamily<CartItemWithProduct[], IProduct[]>({
  key: 'cartProductsSelector',
  get: (products) => ({ get }) => {
    const cartItems = get(cartState);
    return cartItems
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (!product) return null;
        return { ...product, quantity: cartItem.quantity };
      })
      .filter((item): item is CartItemWithProduct => item !== null);
  },
});
