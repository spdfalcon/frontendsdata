import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, IconButton, ActivityIndicator, Text, Dialog, Portal, Button } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useChat } from '../context/ChatContext';
import { useMessage } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import MessageBubble from '../components/MessageBubble';
import { Message } from '../types';
import { CommonActions } from '@react-navigation/native';

interface ChatScreenProps {
  navigation: DrawerNavigationProp<any>;
}

const GUEST_MESSAGE_LIMIT = 50;

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const { user, guestId, clearGuestState } = useAuth();
  const { currentChat, createChat, chats } = useChat();
  const { messages, sendMessage, isLoading, isSending, error } = useMessage();
  const flatListRef = useRef<FlatList>(null);
  const [messageLimitDialogVisible, setMessageLimitDialogVisible] = useState(false);

  // Create a new chat if there are no chats
  useEffect(() => {
    const initializeChat = async () => {
      if (chats.length === 0) {
        await createChat('گفتگوی جدید');
      }
    };

    initializeChat();
  }, [chats.length]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Check message limit for guest users
    if (!user && messages.length >= GUEST_MESSAGE_LIMIT) {
      setMessageLimitDialogVisible(true);
      return;
    }
    
    // If no current chat, create one
    if (!currentChat) {
      await createChat('گفتگوی جدید');
    }
    
    const messageToSend = message;
    setMessage('');
    
    await sendMessage(messageToSend);
  };

  const handleNavigateToLogin = async () => {
    try {
      await clearGuestState();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error navigating to login:', error);
    }
  };

  const handleNavigateToRegister = async () => {
    try {
      await clearGuestState();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Register' }],
        })
      );
    } catch (error) {
      console.error('Error navigating to register:', error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble message={item} isUser={!item.isAI} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentChat?.title || 'گفتگوی جدید'}
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>در حال بارگذاری پیام‌ها...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {user
                  ? 'به چت هوش مصنوعی شریف دیتا خوش آمدید. چگونه می‌توانم کمکتان کنم؟'
                  : `به چت هوش مصنوعی شریف دیتا خوش آمدید. شما به عنوان مهمان می‌توانید تا ۵۰ پیام ارسال کنید. برای امکانات بیشتر ثبت نام کنید.`}
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          value={message}
          onChangeText={setMessage}
          placeholder="پیام خود را بنویسید..."
          style={styles.input}
          multiline
          dense
          theme={{ colors: { text: '#000000', primary: '#6200ee', placeholder: '#555555' } }}
          outlineColor="#6200ee"
          activeOutlineColor="#6200ee"
          textColor="#000000"
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSendMessage}
              disabled={isSending || !message.trim()}
              color={isSending || !message.trim() ? '#aaa' : '#6200ee'}
            />
          }
        />
      </View>

      {isSending && (
        <View style={styles.sendingContainer}>
          <ActivityIndicator size="small" color="#6200ee" />
          <Text style={styles.sendingText}>در حال ارسال...</Text>
        </View>
      )}

      <Portal>
        <Dialog visible={messageLimitDialogVisible} onDismiss={() => setMessageLimitDialogVisible(false)}>
          <Dialog.Title>محدودیت پیام‌های کاربر مهمان</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              شما به عنوان کاربر مهمان حداکثر می‌توانید {GUEST_MESSAGE_LIMIT} پیام در هر گفتگو ارسال کنید.
              برای ارسال پیام‌های بیشتر، لطفاً وارد حساب کاربری خود شوید یا ثبت نام کنید.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="contained"
              onPress={() => {
                setMessageLimitDialogVisible(false);
                handleNavigateToLogin();
              }}
              style={styles.dialogButton}
            >
              ورود به حساب
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                setMessageLimitDialogVisible(false);
                handleNavigateToRegister();
              }}
              style={styles.dialogButton}
            >
              ثبت نام
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  messageList: {
    padding: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    maxHeight: 100,
    backgroundColor: '#fff',
    color: '#000000',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    margin: 10,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendingText: {
    marginLeft: 10,
    color: '#666',
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  dialogButton: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});

export default ChatScreen; 