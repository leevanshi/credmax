import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('credmax_token'));
  const [biometricEnabled, setBiometricEnabled] = useState(
    localStorage.getItem('credmax_biometric') === 'true'
  );

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('credmax_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const response = await axios.post(`${API}/auth/signup`, { name, email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('credmax_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('credmax_token');
    setToken(null);
    setUser(null);
  };

  const enableBiometric = async () => {
    if (!window.PublicKeyCredential) {
      throw new Error('Biometric authentication not supported');
    }

    try {
      // Check if biometric is available
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (available) {
        localStorage.setItem('credmax_biometric', 'true');
        localStorage.setItem('credmax_biometric_email', user.email);
        setBiometricEnabled(true);
        return true;
      } else {
        throw new Error('Biometric authentication not available on this device');
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      throw error;
    }
  };

  const disableBiometric = () => {
    localStorage.removeItem('credmax_biometric');
    localStorage.removeItem('credmax_biometric_email');
    setBiometricEnabled(false);
  };

  const loginWithBiometric = async () => {
    if (!biometricEnabled) {
      throw new Error('Biometric not enabled');
    }

    const savedEmail = localStorage.getItem('credmax_biometric_email');
    if (!savedEmail) {
      throw new Error('No saved credentials');
    }

    // In production, this would use WebAuthn API
    // For now, we'll simulate biometric verification
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const savedToken = localStorage.getItem('credmax_token');
        if (savedToken) {
          setToken(savedToken);
          resolve(true);
        } else {
          reject(new Error('Biometric verification failed'));
        }
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      token,
      biometricEnabled,
      enableBiometric,
      disableBiometric,
      loginWithBiometric
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
