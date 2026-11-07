import { createContext, useContext } from 'react';

// The logged-in admin (or null), plus login, accepting an invitation or reset link, and logout. status is 'loading' until the first check finishes.
export const AuthContext = createContext({
  admin: null,
  status: 'ready',
  login: async () => {},
  acceptLink: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
