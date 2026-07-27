import { jwtDecode } from './jwtDecode';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthData {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export function saveAuth(data: AuthData): void {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify({
    email: data.email,
    fullName: data.fullName,
    role: data.role,
  }));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const token = getToken();
  const userData = localStorage.getItem(USER_KEY);
  if (!token || !userData) return null;

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp as number;
    if (Date.now() >= exp * 1000) {
      clearAuth();
      return null;
    }
    return { id: decoded.sub as string, ...JSON.parse(userData) };
  } catch {
    clearAuth();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
