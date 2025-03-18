import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Chat, Message } from '../types';

const API_URL = 'https://backend-sdata.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  generateGuestId: async (): Promise<string> => {
    const response = await api.get('/auth/guest');
    return response.data.guestId;
  },
};

// Chat API
export const chatAPI = {
  createChat: async (title: string, guestId?: string): Promise<Chat> => {
    const response = await api.post('/chats', { title, guestId });
    return response.data;
  },

  getChats: async (guestId?: string): Promise<Chat[]> => {
    const response = await api.get('/chats', {
      params: guestId ? { guestId } : {},
    });
    return response.data;
  },

  getChatById: async (chatId: string, guestId?: string): Promise<Chat> => {
    const response = await api.get(`/chats/${chatId}`, {
      params: guestId ? { guestId } : {},
    });
    return response.data;
  },

  updateChat: async (chatId: string, title: string, guestId?: string): Promise<Chat> => {
    const response = await api.put(`/chats/${chatId}`, { title, guestId });
    return response.data;
  },

  deleteChat: async (chatId: string, guestId?: string): Promise<{ message: string }> => {
    const response = await api.delete(`/chats/${chatId}`, {
      params: guestId ? { guestId } : {},
    });
    return response.data;
  },
};

// Message API
export const messageAPI = {
  sendMessage: async (content: string, chatId: string, guestId?: string): Promise<{ 
    userMessage: Message; 
    aiMessage: Message;
    chatTitle?: string;
  }> => {
    const response = await api.post('/messages', { content, chatId, guestId });
    return response.data;
  },

  getMessages: async (chatId: string, guestId?: string): Promise<Message[]> => {
    const response = await api.get(`/messages/${chatId}`, {
      params: guestId ? { guestId } : {},
    });
    return response.data;
  },
}; 