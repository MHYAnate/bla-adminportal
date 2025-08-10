// lib/auth.ts - FIXED VERSION

export const AUTH_TOKEN_KEY = "auth_token";

export function setAuthToken(token: string, remember: boolean = false): void {
  if (typeof window === "undefined") return;
  
  console.log('Setting auth token, remember:', remember);
  
  try {
    // Always set in sessionStorage for current session
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    
    // Set in localStorage if "remember me" is true
    if (remember) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      // Clear localStorage if not remembering
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    
    // Set cookie as backup (7 days expiry)
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      `${AUTH_TOKEN_KEY}=${token}`,
      `expires=${expires}`,
      'path=/',
      isProduction ? 'Secure' : '',
      'SameSite=Lax'
    ].filter(Boolean).join('; ');
    
    document.cookie = cookieOptions;
    console.log('✅ Token stored successfully in all locations');
  } catch (error) {
    console.error('❌ Error storing token:', error);
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    // Priority: sessionStorage -> localStorage -> cookie
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY) ||
                  localStorage.getItem(AUTH_TOKEN_KEY) ||
                  getCookie(AUTH_TOKEN_KEY);
    
    console.log('Getting auth token, found:', !!token);
    return token;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  
  console.log('Clearing auth tokens');
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    document.cookie = `${AUTH_TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    console.log('✅ Tokens cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing tokens:', error);
  }
}

// FIXED: Helper function to get cookie
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  } catch (error) {
    console.error('❌ Error reading cookie:', error);
    return null;
  }
}

// FIXED: Better token validation
export function isTokenValid(token: string): boolean {
  if (!token) return false;
  
  try {
    // Check if token has proper JWT format
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Invalid token format');
      return false;
    }
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp) {
      const isExpired = payload.exp < Date.now() / 1000;
      if (isExpired) {
        console.log('Token expired');
        return false;
      }
    }
    
    console.log('Token is valid');
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

// Enhanced auth check
export function checkAuth(): boolean {
  const token = getAuthToken();
  
  if (!token) {
    console.log('No token found during auth check');
    return false;
  }
  
  const isValid = isTokenValid(token);
  if (!isValid) {
    console.log('Invalid token, clearing tokens');
    clearAuthTokens();
    return false;
  }
  
  return true;
}