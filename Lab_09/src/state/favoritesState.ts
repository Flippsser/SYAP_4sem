import { atom } from 'recoil-next';

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    try {
      setSelf(JSON.parse(savedValue));
    } catch {
      localStorage.removeItem(key);
    }
  }
  onSet((newValue: number[]) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const favoritesState = atom<number[]>({
  key: 'favoritesState',
  default: [],
  effects_UNSTABLE: [localStorageEffect('favorites')],
});
