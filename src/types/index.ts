export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  messageCount?: number;
}

export interface Chat {
  _id: string;
  title: string;
  user?: string;
  guestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  chat: string;
  user?: string;
  guestId?: string;
  isAI: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  guestId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
}

export interface MessageState {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
} 