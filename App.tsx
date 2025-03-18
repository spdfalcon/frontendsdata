import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';
import { MessageProvider } from './src/context/MessageContext';
import AppNavigator from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar style="auto" />
        <AuthProvider>
          <ChatProvider>
            <MessageProvider>
              <AppNavigator />
            </MessageProvider>
          </ChatProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
