import { createContext, ReactNode, useContext, useMemo, useState } from "react"
import auth from "../services/auth";

type AuthContextType = {
  login: (username: string, password: string) => Promise<void>;
  token?: string;
  user?: any;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const STORAGE_KEY = "porla.auth";

function loadStoredAuth(): { token?: string; user?: any } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function storeAuth(token: string, user: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

export function AuthProvider({ children } : { children: ReactNode }): JSX.Element {
  const stored = loadStoredAuth();
  const [error, setError] = useState<any>();
  const [user, setUser] = useState<any>(stored.user);
  const [token, setToken] = useState<string | undefined>(stored.token);

  function login(username: string, password: string) {
    return auth.login(username, password)
      .then(t => {
        setToken(t);
        setUser({ username });
        storeAuth(t, { username });
      });
  }

  const memoedValue = useMemo(() => ({
    error,
    login,
    token,
    user
  }), [error, token, user]);

  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
