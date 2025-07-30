// Secure token management with fallbacks
export const AUTH_TOKEN_KEY = "auth_token";

export function setAuthToken(token: string, remember: boolean = false): void {
  if (typeof window === "undefined") return;
  
  // Always set in sessionStorage
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  
  // Set in localStorage if "remember me" is true
  if (remember) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  
  // Set cookie as backup (7 days expiry)
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; expires=${expires}; path=/; Secure; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  // Check sessionStorage first
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY) || 
                localStorage.getItem(AUTH_TOKEN_KEY) || 
                getCookie(AUTH_TOKEN_KEY);
  
  return token;
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

// Helper function to get cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}