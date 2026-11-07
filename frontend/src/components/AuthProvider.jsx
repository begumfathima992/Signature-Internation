import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/auth.js';
import { api } from '../lib/api.js';

const initialStatus = typeof window === 'undefined' ? 'ready' : 'loading';

export default function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const controller = new AbortController();
    api('/api/auth/me', { signal: controller.signal })
      .then((data) => setAdmin(data.admin))
      .catch(() => setAdmin(null))
      .finally(() => {
        if (!controller.signal.aborted) setStatus('ready');
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    setAdmin(data.admin);
    return data.admin;
  }, []);

  // Opens an invitation (creates the account) or a reset link (sets a new password), then logs in.
  const acceptLink = useCallback(async ({ token, name, password }) => {
    const data = await api('/api/auth/accept-link', { method: 'POST', body: { token, name, password } });
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } finally {
      setAdmin(null);
    }
  }, []);

  // Called when an admin request comes back 401, for example after the 8-hour session ends.
  const sessionExpired = useCallback(() => setAdmin(null), []);

  const value = useMemo(
    () => ({ admin, status, login, acceptLink, logout, sessionExpired }),
    [admin, status, login, acceptLink, logout, sessionExpired],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
