import axios from 'axios';

// Centralized instance pointing to .NET backend port
export const api = axios.create({
  baseURL: 'http://localhost:5048/api', 
  headers: {
    'Content-Type': 'application/json', // Sets default communication format
  }
});

// Request Interceptor: Inject the token into EVERY outbound call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Defensive check: Ensure config.headers exists before writing to it
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle expired tokens/global errors
api.interceptors.response.use(
  (response) => {
    // If the request is successful (status 200-299), is allowed through
    return response;
  },
  (error) => {
    // Check if the backend rejected the request with a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Wiping local tokens...");
      
      // Clear out the expired tokens so the app doesn't try to use them again
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Kick the user back to the login page immediately
      window.location.href = '/login';
    }
    
    // Pass the error back down to the specific page/component if it wants to catch it
    return Promise.reject(error);
  }
);