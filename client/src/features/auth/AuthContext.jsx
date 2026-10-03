import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAccessToken } from '../../services/api.js';
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [ready, setReady] = useState(false);
  useEffect(() => { api.post('/auth/refresh').then(({ data }) => { setAccessToken(data.accessToken); setUser(data.user); }).catch(() => {}).finally(() => setReady(true)); }, []);
  const login = async (credentials) => { const { data } = await api.post('/auth/login', credentials); setAccessToken(data.accessToken); setUser(data.user); };
  const logout = async () => { await api.post('/auth/logout'); setAccessToken(undefined); setUser(null); };
  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
