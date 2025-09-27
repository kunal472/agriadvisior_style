import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService, { setAuthToken } from '../api/apiService';
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // Set the token on the apiService instance when the app loads
    if (token) {
      setAuthToken(token);
      const decodedUser = jwtDecode(token);
      // Assuming your backend JWT payload has `sub` (email) and `id`
      // Note: Backend might need to be updated to include user ID in JWT payload
      setUser({ email: decodedUser.sub, id: decodedUser.id }); 
    
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await apiService.post('/api/auth/login', {
        username: email, // FastAPI's OAuth2 form uses 'username'
        password: password,
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const newToken = response.data.access_token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      setAuthToken(newToken);
      navigate('/'); // Redirect to homepage on successful login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

const register = async (email, password) => {
    try {
      await apiService.post('/api/auth/register', {
        email: email,
        password: password,
      });
      alert('Registration successful! Please log in.');
      return true; // Indicate success
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.detail || 'Registration failed. Please try again.');
      return false; // Indicate failure
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login');
  };

  // The context value that will be supplied to any descendants
  const value = {
    token,
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};