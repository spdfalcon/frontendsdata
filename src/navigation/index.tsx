import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { View, Image, StyleSheet } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import SidebarContent from '../components/SidebarContent';

// Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Chat: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'KalamehFaNum-Bold',
        },
      }}
    >
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'ورود' }} 
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'ثبت نام' }} 
      />
    </AuthStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidebarContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
          height: 80,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'KalamehFaNum-Bold',
        },
        drawerPosition: 'right',
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/large_logo_sdata_light.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        ),
      }}
    >
      <Drawer.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ title: 'چت با هوش مصنوعی' }} 
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { user, guestId, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  return (
    <NavigationContainer>
      {user || guestId ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerLogo: {
    width: 150,
    height: 40,
  },
});

export default AppNavigator; 