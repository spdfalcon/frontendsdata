import React from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';
import { MessageProvider } from './src/context/MessageContext';
import { theme } from './src/theme/theme';
import { textStyles } from './src/theme/typography';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...textStyles.default,
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'KalamehFaNum-Regular': require('./assets/fonts/TTF/KalamehFaNum-Regular.ttf'),
    'KalamehFaNum-Bold': require('./assets/fonts/TTF/KalamehFaNum-Bold.ttf'),
    'KalamehFaNum-Thin': require('./assets/fonts/TTF/KalamehFaNum-Thin.ttf'),
    'KalamehFaNum-Black': require('./assets/fonts/TTF/KalamehFaNum-Black.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <AuthProvider>
          <ChatProvider>
            <MessageProvider>
              <AppNavigator />
            </MessageProvider>
          </ChatProvider>
        </AuthProvider>
      </View>
    </PaperProvider>
  );
}
