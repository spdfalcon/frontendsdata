import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, ensureGuestId, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطا', 'لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleContinueAsGuest = async () => {
    try {
      await ensureGuestId();
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>ورود به چت هوش مصنوعی شریف دیتا</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <TextInput
          label="ایمیل"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{ colors: { text: '#000000', primary: '#6200ee', placeholder: '#555555' } }}
          outlineColor="#6200ee"
          activeOutlineColor="#6200ee"
          textColor="#000000"
        />
        
        <TextInput
          label="رمز عبور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          theme={{ colors: { text: '#000000', primary: '#6200ee', placeholder: '#555555' } }}
          outlineColor="#6200ee"
          activeOutlineColor="#6200ee"
          textColor="#000000"
        />
        
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'ورود'}
        </Button>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>حساب کاربری ندارید؟ ثبت نام کنید</Text>
        </TouchableOpacity>
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>یا</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <Button
          mode="outlined"
          onPress={handleContinueAsGuest}
          style={styles.guestButton}
          disabled={isLoading}
        >
          ادامه به عنوان مهمان
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200ee',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000000',
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  linkContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  link: {
    color: '#6200ee',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#757575',
  },
  guestButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderColor: '#6200ee',
  },
});

export default LoginScreen; 