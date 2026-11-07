import { useCallback } from 'react';
import { useAuth } from '../context/auth.js';
import { api } from '../lib/api.js';

// Like api(), but a 401 (session ended) signs the admin out so the login page shows.
export function useAdminRequest() {
  const { sessionExpired } = useAuth();
  return useCallback(
    async (path, options) => {
      try {
        return await api(path, options);
      } catch (error) {
        if (error.status === 401) sessionExpired();
        throw error;
      }
    },
    [sessionExpired],
  );
}
