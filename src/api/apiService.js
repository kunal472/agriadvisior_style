import axios from 'axios';

// Create an axios instance with a base URL
const apiService = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your FastAPI backend URL
});

// Function to set the JWT token on the axios instance
export const setAuthToken = (token) => {
  if (token) {
    // Apply the token to every request if logged in
    apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Delete the auth header
    delete apiService.defaults.headers.common['Authorization'];
  }
};

export default apiService;