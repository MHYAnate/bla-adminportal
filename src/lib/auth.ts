// Helper functions for auth token management
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || getCookie('auth_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  setCookie('auth_token', token, 7); // 7 days
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Private helper functions
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}