import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  ensureGuestId: () => Promise<string>;
  clearGuestState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    guestId: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Load user from storage
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const guestId = await AsyncStorage.getItem('guestId');

        if (userJson) {
          const user = JSON.parse(userJson);
          setState((prevState) => ({
            ...prevState,
            user,
            isLoading: false,
          }));
        } else if (guestId) {
          setState((prevState) => ({
            ...prevState,
            guestId,
            isLoading: false,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            isLoading: false,
          }));
        }
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: 'خطا در بارگذاری اطلاعات کاربر',
        }));
      }
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      const user = await authAPI.register(name, email, password);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', user.token);
      
      // If there was a guestId, remove it
      if (state.guestId) {
        await AsyncStorage.removeItem('guestId');
      }
      
      setState((prevState) => ({
        ...prevState,
        user,
        guestId: null,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'خطا در ثبت نام',
      }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      const user = await authAPI.login(email, password);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', user.token);
      
      // If there was a guestId, remove it
      if (state.guestId) {
        await AsyncStorage.removeItem('guestId');
      }
      
      setState((prevState) => ({
        ...prevState,
        user,
        guestId: null,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'خطا در ورود',
      }));
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userToken');
      // Also remove guestId from AsyncStorage
      await AsyncStorage.removeItem('guestId');
      
      setState((prevState) => ({
        ...prevState,
        user: null,
        guestId: null, // Also clear guestId from state
        isLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: 'خطا در خروج از حساب کاربری',
      }));
    }
  };

  const ensureGuestId = async (): Promise<string> => {
    // If user is logged in, no need for guestId
    if (state.user) {
      return '';
    }

    // If we already have a guestId, return it
    if (state.guestId) {
      return state.guestId;
    }

    try {
      // Generate a new guestId
      const guestId = await authAPI.generateGuestId();
      await AsyncStorage.setItem('guestId', guestId);
      setState((prevState) => ({
        ...prevState,
        guestId,
      }));
      return guestId;
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: 'خطا در ایجاد شناسه مهمان',
      }));
      return '';
    }
  };

  const clearGuestState = async () => {
    try {
      await AsyncStorage.removeItem('guestId');
      setState(prevState => ({
        ...prevState,
        guestId: null,
      }));
    } catch (error) {
      console.error('Error clearing guest state:', error);
    }
  };

  const value = {
    user: state.user,
    guestId: state.guestId,
    isLoading: state.isLoading,
    error: state.error,
    register,
    login,
    logout,
    ensureGuestId,
    clearGuestState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 