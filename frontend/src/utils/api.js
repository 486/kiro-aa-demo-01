// API utility for connecting to Express.js backend
const API_BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Sessions API
export const sessionsAPI = {
  // Get all sessions with pagination
  getAll: (page = 1, limit = 10) => {
    return apiRequest(`/sessions?page=${page}&limit=${limit}`);
  },

  // Get single session by ID
  getById: (sessionId) => {
    return apiRequest(`/sessions/${sessionId}`);
  },

  // Search sessions with filters
  search: (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    return apiRequest(`/sessions/search?${params.toString()}`);
  },
};

// Speakers API
export const speakersAPI = {
  // Get all speakers
  getAll: (page = 1, limit = 10) => {
    return apiRequest(`/speakers?page=${page}&limit=${limit}`);
  },

  // Get speaker by ID
  getById: (speakerId) => {
    return apiRequest(`/speakers/${speakerId}`);
  },
};

// Schedule API
export const scheduleAPI = {
  // Add session to schedule
  add: (userId, sessionId, notes = '') => {
    return apiRequest('/schedule', {
      method: 'POST',
      body: JSON.stringify({ userId, sessionId, notes }),
    });
  },

  // Get user schedule
  get: (userId) => {
    return apiRequest(`/schedule/${encodeURIComponent(userId)}`);
  },

  // Remove session from schedule
  remove: (scheduleId, userId) => {
    return apiRequest(`/schedule/${scheduleId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },
};

// Metadata API
export const metadataAPI = {
  // Get session types, tracks, and levels
  get: () => {
    return apiRequest('/metadata');
  },
};

// Health check
export const healthCheck = () => {
  return apiRequest('/health', { baseURL: '' });
};
