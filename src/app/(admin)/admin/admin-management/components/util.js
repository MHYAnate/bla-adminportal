export const extractResponseData = (response) => {
  if (!response) return null;
  
  // If response is already an array, return it directly
  if (Array.isArray(response)) {
    return response;
  }
  
  // If response is an object, check for common data properties
  if (typeof response === 'object') {
    // Check for success + data structure
    if (response.success !== undefined && response.data !== undefined) {
      return response; // Return the whole response object including pagination
    }
    
    // Check for direct data property
    if (response.data !== undefined) {
      return response.data;
    }
    
    // Check for other common response patterns
    if (response.results !== undefined) {
      return response.results;
    }
    
    if (response.items !== undefined) {
      return response.items;
    }
    
    // If it has array-like properties, return the response itself
    if (response.length !== undefined) {
      return response;
    }
  }
  
  // Return the response as-is if we can't determine the structure
  return response;
};

// Error handler utility
export const ErrorHandler = (error) => {
  if (!error) return null;
  
  // Handle different error structures
  if (error.response) {
    return error.response.data?.message || error.response.data?.error || error.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};