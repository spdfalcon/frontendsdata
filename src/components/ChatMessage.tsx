import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, globalStyles } from '../theme';

interface ChatMessageProps {
  content: string;
  isAI: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isAI }) => {
  return (
    <View style={[styles.container, isAI ? styles.aiMessage : styles.userMessage]}>
      <Text style={[globalStyles.text, styles.messageText]}>
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    marginVertical: 4,
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: theme.colors.secondary,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ChatMessage; 