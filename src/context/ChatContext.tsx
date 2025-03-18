import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Chat, ChatState } from '../types';
import { chatAPI } from '../services/api';
import { messageAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface ChatContextType extends ChatState {
  fetchChats: () => Promise<void>;
  createChat: (title?: string) => Promise<Chat>;
  selectChat: (chat: Chat) => void;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, guestId, ensureGuestId } = useAuth();
  const [state, setState] = useState<ChatState>({
    chats: [],
    currentChat: null,
    isLoading: false,
    error: null,
  });

  // Fetch chats when user or guestId changes
  useEffect(() => {
    if (user || guestId) {
      fetchChats();
    }
  }, [user, guestId]);

  const fetchChats = async () => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      
      // If not logged in, ensure we have a guestId
      const currentGuestId = user ? undefined : await ensureGuestId();
      
      const chats = await chatAPI.getChats(currentGuestId);
      setState((prevState) => ({
        ...prevState,
        chats,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'خطا در دریافت چت‌ها',
      }));
    }
  };

  const createChat = async (title?: string): Promise<Chat> => {
    try {
      // Check if there are any existing chats
      if (state.chats.length > 0) {
        const lastChat = state.chats[0]; // Chats are ordered with newest first
        
        // Get messages for the last chat
        const currentGuestId = user ? undefined : await ensureGuestId();
        const messages = await messageAPI.getMessages(lastChat._id, currentGuestId);
        
        // If the last chat is empty (no messages), prevent creating a new one
        if (messages.length === 0) {
          setState((prevState) => ({
            ...prevState,
            error: 'لطفا ابتدا در گفتگوی فعلی پیامی ارسال کنید',
            currentChat: lastChat, // Select the empty chat
          }));
          throw new Error('لطفا ابتدا در گفتگوی فعلی پیامی ارسال کنید');
        }
      }

      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      
      // If not logged in, ensure we have a guestId
      const currentGuestId = user ? undefined : await ensureGuestId();
      
      const newChat = await chatAPI.createChat(title || 'گفتگوی جدید', currentGuestId);
      
      setState((prevState) => ({
        ...prevState,
        chats: [newChat, ...prevState.chats],
        currentChat: newChat,
        isLoading: false,
      }));
      
      return newChat;
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || error.message || 'خطا در ایجاد چت جدید',
      }));
      throw error;
    }
  };

  const selectChat = (chat: Chat) => {
    setState((prevState) => ({
      ...prevState,
      currentChat: chat,
    }));
  };

  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      
      // If not logged in, ensure we have a guestId
      const currentGuestId = user ? undefined : await ensureGuestId();
      
      const updatedChat = await chatAPI.updateChat(chatId, title, currentGuestId);
      
      setState((prevState) => ({
        ...prevState,
        chats: prevState.chats.map((chat) => 
          chat._id === chatId ? updatedChat : chat
        ),
        currentChat: prevState.currentChat?._id === chatId 
          ? updatedChat 
          : prevState.currentChat,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'خطا در به‌روزرسانی عنوان چت',
      }));
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      
      // If not logged in, ensure we have a guestId
      const currentGuestId = user ? undefined : await ensureGuestId();
      
      await chatAPI.deleteChat(chatId, currentGuestId);
      
      const updatedChats = state.chats.filter((chat) => chat._id !== chatId);
      
      setState((prevState) => ({
        ...prevState,
        chats: updatedChats,
        currentChat: prevState.currentChat?._id === chatId 
          ? (updatedChats.length > 0 ? updatedChats[0] : null) 
          : prevState.currentChat,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'خطا در حذف چت',
      }));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        fetchChats,
        createChat,
        selectChat,
        updateChatTitle,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 