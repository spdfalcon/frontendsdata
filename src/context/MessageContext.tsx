import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, MessageState } from '../types';
import { messageAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';

interface MessageContextType extends MessageState {
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, guestId, ensureGuestId } = useAuth();
  const { currentChat, updateChatTitle } = useChat();
  const [state, setState] = useState<MessageState>({
    messages: [],
    isLoading: false,
    isSending: false,
    error: null,
  });

  // Fetch messages when current chat changes
  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat._id);
    } else {
      clearMessages();
    }
  }, [currentChat]);

  const fetchMessages = async (chatId: string) => {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      
      // If not logged in, ensure we have a guestId
      const currentGuestId = user ? undefined : await ensureGuestId();
      
      const messages = await messageAPI.getMessages(chatId, currentGuestId);
      setState((prevState) => ({
        ...prevState,
        messages,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'خطا در دریافت پیام‌ها',
      }));
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat) {
      setState((prevState) => ({
        ...prevState,
        error: 'هیچ چتی انتخاب نشده است',
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, isSending: true, error: null }));
      
      // If not logged in, ensure we have a guestId
      const currentGuestId = user ? undefined : await ensureGuestId();
      
      const { userMessage, aiMessage, chatTitle } = await messageAPI.sendMessage(
        content,
        currentChat._id,
        currentGuestId
      );
      
      // If we received a new chat title, update it
      if (chatTitle && updateChatTitle) {
        await updateChatTitle(currentChat._id, chatTitle);
      }

      setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, userMessage, aiMessage],
        isSending: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isSending: false,
        error: error.response?.data?.message || 'خطا در ارسال پیام',
      }));
    }
  };

  const clearMessages = () => {
    setState((prevState) => ({
      ...prevState,
      messages: [],
      error: null,
    }));
  };

  return (
    <MessageContext.Provider
      value={{
        ...state,
        fetchMessages,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}; 