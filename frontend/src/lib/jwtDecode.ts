// Minimal JWT decode utility (no external dependency needed)
// Only decodes the payload — does NOT verify signatures

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function jwtDecode(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }

  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}
