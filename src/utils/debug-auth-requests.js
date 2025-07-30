// utils/debug-auth-requests.js
import { getAuthToken } from "@/lib/auth";

export const debugAuthenticatedRequest = (endpoint) => {
  const token = getAuthToken();
  console.log('=== AUTHENTICATED REQUEST DEBUG ===');
  console.log('Endpoint:', endpoint);
  console.log('Token exists:', !!token);
  console.log('Token value:', token ? `${token.substring(0, 10)}...` : 'None');
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('====================================');
  
  return {
    hasToken: !!token,
    token: token,
    endpoint: endpoint
  };
};

export default debugAuthenticatedRequest;