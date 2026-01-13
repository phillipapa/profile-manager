import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { fetchUsers } from '../services/userService';

type State = {
  users: User[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_USER'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

type UserContextProps = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export const UserContext = createContext<UserContextProps | undefined>(undefined);

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

type ProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    users: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const users = await fetchUsers();
        dispatch({ type: 'SET_USER', payload: users });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    load();
  }, []);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextProps => {
  const ctx = React.useContext(UserContext);
  if (!ctx) {
    throw new Error('useUserContext wrong Provider');
  }
  return ctx;
};
