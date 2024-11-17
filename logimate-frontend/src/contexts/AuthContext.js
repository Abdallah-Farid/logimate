import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Validate token and get user info
      axios.get('http://localhost:3001/api/users/profile')
        .then(response => {
          setUser(response.data);
          if (location.pathname === '/login') {
            navigate('/inventory');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', {
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      navigate('/inventory');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
