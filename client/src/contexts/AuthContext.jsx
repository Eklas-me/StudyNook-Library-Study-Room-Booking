import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // We need to pass withCredentials: true so that cookies are sent to the server automatically
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
  });

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, photoURL, password) => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', { name, email, photoURL, password });
      // Usually, we redirect to login page after register, so we don't fetchUser here
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/google-login', { credential });
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    loading,
    login,
    registerUser,
    googleLogin,
    logout,
    fetchUser, // Exposing just in case
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
