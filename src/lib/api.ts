// API utilities for Empire Command Center

interface FetchCollectionOptions {
  order?: string;
  limit?: number;
  signal?: AbortSignal;
}

interface CollectionResponse {
  items: any[];
  total?: number;
}

export async function fetchCollection(
  collection: string, 
  options: FetchCollectionOptions = {}
): Promise<CollectionResponse> {
  const { order, limit, signal } = options;
  
  // Build query params
  const params = new URLSearchParams();
  if (order) params.set('order', order);
  if (limit) params.set('limit', limit.toString());
  
  const url = `/api/${collection}${params.toString() ? '?' + params.toString() : ''}`;
  
  try {
    const response = await fetch(url, { signal });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${collection}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error(`Error fetching ${collection}:`, error);
    throw new Error(`Failed to fetch ${collection}`);
  }
}