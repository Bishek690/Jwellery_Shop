// API Configuration for Frontend Integration
// Place this file in your frontend project (e.g., lib/api.ts)

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// API Client Configuration
export const apiClient = {
  baseURL: API_BASE_URL,
  
  // Default headers
  getHeaders: (includeAuth = false) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Token will be sent via cookies automatically if configured correctly
    return headers;
  },

  // Generic request function
  request: async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      credentials: 'include', // Important: Include cookies for authentication
      ...options,
      headers: {
        ...apiClient.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },
};

// User API functions
export const userAPI = {
  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    try {
      // Try authenticated logout first
      const response = await apiClient.request('/users/logout', {
        method: 'POST',
      });
      
      console.log("Authenticated logout successful");
      return response;
    } catch (error) {
      console.warn('Authenticated logout failed, trying force logout:', error);
      
      try {
        // If authenticated logout fails, try force logout
        const response = await apiClient.request('/users/logout-force', {
          method: 'POST',
        });
        
        console.log("Force logout successful");
        return response;
      } catch (forceError) {
        console.error('Both logout attempts failed:', forceError);
        // Still throw so the frontend handles it appropriately
        throw forceError;
      }
    }
  },

  // User registration (public)
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    return apiClient.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get current user profile
  getProfile: async () => {
    return apiClient.request('/users/me');
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiClient.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  // Admin functions
  getAllUsers: async () => {
    return apiClient.request('/users');
  },

  createUserByAdmin: async (userData: {
    name: string;
    email: string;
    phone: string;
    role: 'staff' | 'accountant';
  }) => {
    return apiClient.request('/users/create-by-admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (userId: string, userData: any) => {
    return apiClient.request(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId: string) => {
    return apiClient.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiClient.request('/health');
  },
};

// Example usage in React components:
/*
// Login component
const handleLogin = async (email: string, password: string) => {
  try {
    const result = await userAPI.login({ email, password });
    console.log('Login successful:', result);
    // Handle successful login (redirect, update state, etc.)
  } catch (error) {
    console.error('Login failed:', error);
    // Handle login error
  }
};

// Registration component
const handleRegister = async (userData) => {
  try {
    const result = await userAPI.register(userData);
    console.log('Registration successful:', result);
    // Handle successful registration
  } catch (error) {
    console.error('Registration failed:', error);
    // Handle registration error
  }
};
*/
