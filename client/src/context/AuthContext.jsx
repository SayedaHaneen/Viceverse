import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setCreatorProfile(res.creatorProfile || null);
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        setAuthToken(null);
        setUser(null);
        setCreatorProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      setAuthToken(res.token);
      setUser(res.user);
      setCreatorProfile(res.creatorProfile || null);
      addToast(`Welcome back, ${res.user.full_name}!`, 'success');
      return res;
    }
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.success) {
      setAuthToken(res.token);
      setUser(res.user);
      addToast('Welcome to VICEVERSE! Your account is ready.', 'success');
      return res;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setCreatorProfile(null);
    addToast('Logged out of VICEVERSE.', 'info');
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getMe();
      if (res.success) {
        setUser(res.user);
        setCreatorProfile(res.creatorProfile || null);
      }
    } catch (e) {
      console.error('Error refreshing profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        creatorProfile,
        loading,
        isAuthenticated: !!user,
        isCreator: user?.role === 'creator' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshProfile,
        setUser,
        setCreatorProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
