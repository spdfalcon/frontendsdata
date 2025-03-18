import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Divider, IconButton, Dialog, Portal, TextInput } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Chat } from '../types';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SidebarContent = (props: any) => {
  const { user, guestId, logout, clearGuestState } = useAuth();
  const { chats, currentChat, createChat, selectChat, updateChatTitle, deleteChat, isLoading } = useChat();
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [chatToEdit, setChatToEdit] = useState<Chat | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [guestLimitDialogVisible, setGuestLimitDialogVisible] = useState(false);

  const GUEST_CHAT_LIMIT = 5;

  const handleCreateChat = async () => {
    if (!user && chats.length >= GUEST_CHAT_LIMIT) {
      setGuestLimitDialogVisible(true);
      return;
    }

    try {
      const newChat = await createChat('گفتگوی جدید');
      selectChat(newChat);
      props.navigation.closeDrawer();
    } catch (error) {
      console.error('Error creating chat:', error);
      props.navigation.closeDrawer();
    }
  };

  const handleSelectChat = (chat: Chat) => {
    selectChat(chat);
    props.navigation.closeDrawer();
  };

  const handleEditChat = (chat: Chat) => {
    setChatToEdit(chat);
    setNewTitle(chat.title);
    setEditDialogVisible(true);
  };

  const handleUpdateChatTitle = async () => {
    if (chatToEdit && newTitle.trim()) {
      await updateChatTitle(chatToEdit._id, newTitle.trim());
      setEditDialogVisible(false);
      setChatToEdit(null);
      setNewTitle('');
    }
  };

  const handleDeleteChat = (chat: Chat) => {
    console.log('Delete button clicked for chat:', chat._id);
    
    setDeleteDialogVisible(true);
    setChatToDelete(chat);
  };

  const handleLogoutDirectly = async () => {
    try {
      await logout();
      props.navigation.closeDrawer();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogoutButton = () => {
    setLogoutDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (chatToDelete) {
      try {
        console.log('Confirming delete for chat:', chatToDelete._id);
        await deleteChat(chatToDelete._id);
        console.log('Chat deleted successfully');
        setDeleteDialogVisible(false);
        setChatToDelete(null);
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };

  const handleNavigateToLogin = async () => {
    try {
      await clearGuestState();
      props.navigation.closeDrawer();
      props.navigation.dispatch(
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
      props.navigation.closeDrawer();
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Register' }],
        })
      );
    } catch (error) {
      console.error('Error navigating to register:', error);
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isActive = currentChat?._id === item._id;
    
    return (
      <TouchableOpacity
        style={[styles.chatItem, isActive && styles.activeChatItem]}
        onPress={() => handleSelectChat(item)}
      >
        <View style={styles.chatItemContent}>
          <Text
            style={[styles.chatTitle, isActive && styles.activeChatTitle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text style={styles.chatDate}>
            {new Date(item.updatedAt).toLocaleDateString('fa-IR')}
          </Text>
        </View>
        <View style={styles.chatActions}>
          <IconButton
            icon="pencil"
            size={18}
            onPress={() => handleEditChat(item)}
            style={styles.actionButton}
          />
          <IconButton
            icon="delete"
            size={18}
            onPress={() => handleDeleteChat(item)}
            style={styles.actionButton}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>چت هوش مصنوعی شریف دیتا</Text>
        {user ? (
          <Text style={styles.subtitle}>خوش آمدید، {user.name}</Text>
        ) : (
          <Text style={styles.subtitle}>حالت مهمان</Text>
        )}
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={handleCreateChat}
        style={styles.newChatButton}
        disabled={isLoading}
      >
        گفتگوی جدید
      </Button>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>گفتگوهای شما</Text>

      {chats.length === 0 ? (
        <Text style={styles.emptyText}>
          هنوز گفتگویی ندارید. برای شروع، روی دکمه گفتگوی جدید کلیک کنید.
        </Text>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item._id}
          style={styles.chatList}
        />
      )}

      <View style={styles.bottomContainer}>
        <Divider style={styles.divider} />
        {user ? (
          <Button
            mode="outlined"
            icon="logout"
            onPress={handleLogoutDirectly}
            style={styles.bottomButton}
          >
            خروج از حساب کاربری
          </Button>
        ) : (
          <View>
            <Button
              mode="contained"
              icon="login"
              onPress={handleNavigateToLogin}
              style={styles.bottomButton}
            >
              ورود به حساب کاربری
            </Button>
            <Button
              mode="outlined"
              icon="account-plus"
              onPress={handleNavigateToRegister}
              style={[styles.bottomButton, styles.registerButton]}
            >
              ثبت نام
            </Button>
          </View>
        )}
      </View>

      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>ویرایش عنوان گفتگو</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="عنوان جدید"
              value={newTitle}
              onChangeText={setNewTitle}
              mode="outlined"
              theme={{ colors: { text: '#000000', primary: '#6200ee', placeholder: '#555555' } }}
              outlineColor="#6200ee"
              activeOutlineColor="#6200ee"
              textColor="#000000"
              style={{ backgroundColor: '#fff' }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>انصراف</Button>
            <Button onPress={handleUpdateChatTitle}>ذخیره</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>حذف گفتگو</Dialog.Title>
          <Dialog.Content>
            <Text>آیا از حذف این گفتگو اطمینان دارید؟</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>انصراف</Button>
            <Button onPress={handleConfirmDelete} textColor="red">حذف</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Title>تأیید خروج از حساب کاربری</Dialog.Title>
          <Dialog.Content>
            <Text>آیا از خروج از حساب کاربری اطمینان دارید؟</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>انصراف</Button>
            <Button onPress={handleLogoutDirectly} textColor="red">خروج</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={guestLimitDialogVisible} onDismiss={() => setGuestLimitDialogVisible(false)}>
          <Dialog.Title>محدودیت حساب مهمان</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              شما به عنوان کاربر مهمان حداکثر می‌توانید {GUEST_CHAT_LIMIT} گفتگو ایجاد کنید.
              برای ایجاد گفتگوهای بیشتر، لطفاً وارد حساب کاربری خود شوید یا ثبت نام کنید.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="contained"
              onPress={() => {
                setGuestLimitDialogVisible(false);
                handleNavigateToLogin();
              }}
              style={styles.dialogButton}
            >
              ورود به حساب
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                setGuestLimitDialogVisible(false);
                handleNavigateToRegister();
              }}
              style={styles.dialogButton}
            >
              ثبت نام
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  newChatButton: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  activeChatItem: {
    backgroundColor: '#ede7f6',
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  chatItemContent: {
    flex: 1,
    marginRight: 8,
  },
  chatTitle: {
    fontSize: 16,
    color: '#333',
  },
  activeChatTitle: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  chatDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  chatActions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    padding: 16,
    marginTop: 'auto',
  },
  bottomButton: {
    marginVertical: 8,
  },
  registerButton: {
    marginTop: 8,
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

export default SidebarContent; 