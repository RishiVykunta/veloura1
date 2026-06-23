import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile();
          if (profile && profile.success) {
            setUser(profile.user);
          } else {
            // Token might be invalid
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response && response.success) {
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      return response;
    }
    return null;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response && response.success) {
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      return response;
    }
    return null;
  };

  const logout = () => {
    authService.logout().catch(console.error); // Best effort backend logout
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
