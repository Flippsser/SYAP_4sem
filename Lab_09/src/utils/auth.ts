import { AUTH_STORAGE_KEY } from '../contexts/AuthContext';

export function isUserAuthenticated(): boolean {
  return Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
}
