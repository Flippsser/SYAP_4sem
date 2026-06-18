import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { IUser, IAuthState, TAuthAction } from '../types/types';

const AUTH_STORAGE_KEY = 'dummyjson_auth_user';

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false
};

function authReducer(state: IAuthState, action: TAuthAction): IAuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}

interface IAuthContextValue extends IAuthState {
  login: (user: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as IUser;
        dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (user: IUser) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}