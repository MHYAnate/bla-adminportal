// utils/api-response-processor.ts

// Function to safely extract data from API responses
export const processApiResponse = (response: any, dataKey?: string) => {
  console.log('Processing API response:', response);
  console.log('Response type:', typeof response);
  console.log('Response keys:', response ? Object.keys(response) : 'null/undefined');

  if (!response) {
    console.warn('API response is null/undefined');
    return null;
  }

  // If dataKey is specified, try to extract that specific property
  if (dataKey && response[dataKey] !== undefined) {
    console.log(`Extracted data using key "${dataKey}":`, response[dataKey]);
    return response[dataKey];
  }

  // Common API response patterns to check
  const possibleDataKeys = [
    'data',
    'result', 
    'results',
    'items',
    'list',
    'content',
    'payload',
    'body'
  ];

  for (const key of possibleDataKeys) {
    if (response[key] !== undefined) {
      console.log(`Found data using key "${key}":`, response[key]);
      return response[key];
    }
  }

  // If no nested data found, return the response itself
  console.log('No nested data found, returning response as-is:', response);
  return response;
};

// Function to process paginated responses
export const processPaginatedResponse = (response: any, dataKey?: string) => {
  const processedData = processApiResponse(response, dataKey);
  
  console.log('Processing paginated response:', processedData);

  // If it's already an array, wrap it in pagination structure
  if (Array.isArray(processedData)) {
    return {
      items: processedData,
      totalCount: processedData.length,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }

  // If it's an object with pagination info
  if (processedData && typeof processedData === 'object') {
    const paginationKeys = {
      items: ['items', 'data', 'results', 'list', 'content'],
      totalCount: ['totalCount', 'total', 'count', 'totalItems', 'totalRecords'],
      currentPage: ['currentPage', 'page', 'pageNumber', 'current'],
      totalPages: ['totalPages', 'pageCount', 'pages'],
      hasNextPage: ['hasNextPage', 'hasNext', 'next'],
      hasPreviousPage: ['hasPreviousPage', 'hasPrevious', 'previous', 'prev']
    };

    const result: any = {};

    // Extract items
    for (const key of paginationKeys.items) {
      if (processedData[key] !== undefined) {
        result.items = processedData[key];
        break;
      }
    }

    // Extract pagination metadata
    for (const [resultKey, possibleKeys] of Object.entries(paginationKeys)) {
      if (resultKey === 'items') continue;
      
      for (const key of possibleKeys) {
        if (processedData[key] !== undefined) {
          result[resultKey] = processedData[key];
          break;
        }
      }
    }

    // Set defaults if not found
    result.items = result.items || [];
    result.totalCount = result.totalCount || result.items.length;
    result.currentPage = result.currentPage || 1;
    result.totalPages = result.totalPages || 1;
    result.hasNextPage = result.hasNextPage || false;
    result.hasPreviousPage = result.hasPreviousPage || false;

    console.log('Processed paginated result:', result);
    return result;
  }

  // Fallback
  return {
    items: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };
};

export default { processApiResponse, processPaginatedResponse };