import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('خطا', 'لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطا', 'رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    try {
      await register(name, email, password);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>ثبت نام در چت هوش مصنوعی شریف دیتا</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <TextInput
          label="نام کاربری"
          value={name}
          onChangeText={setName}
          style={styles.input}
          theme={{ colors: { text: '#000000', primary: '#6200ee', placeholder: '#555555' } }}
          outlineColor="#6200ee"
          activeOutlineColor="#6200ee"
          textColor="#000000"
        />
        
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
        
        <TextInput
          label="تکرار رمز عبور"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          theme={{ colors: { text: '#000000', primary: '#6200ee', placeholder: '#555555' } }}
          outlineColor="#6200ee"
          activeOutlineColor="#6200ee"
          textColor="#000000"
        />
        
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'ثبت نام'}
        </Button>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.linkContainer}
        >
          <Text style={styles.link}>قبلاً ثبت نام کرده‌اید؟ وارد شوید</Text>
        </TouchableOpacity>
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
});

export default RegisterScreen; 