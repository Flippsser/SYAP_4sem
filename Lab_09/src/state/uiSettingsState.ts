import { atom, selector } from 'recoil-next';

export type ViewMode = 'grid' | 'list';
export type Theme = 'light' | 'dark';

export interface UISettings {
  viewMode: ViewMode;
  theme: Theme;
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
  onSet((newValue: UISettings) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const uiSettingsState = atom<UISettings>({
  key: 'uiSettingsState',
  default: { viewMode: 'grid', theme: 'light' },
  effects_UNSTABLE: [localStorageEffect('uiSettings')],
});

export const viewModeSelector = selector<ViewMode>({
  key: 'viewModeSelector',
  get: ({ get }) => get(uiSettingsState).viewMode,
});

export const themeSelector = selector<Theme>({
  key: 'themeSelector',
  get: ({ get }) => get(uiSettingsState).theme,
});
