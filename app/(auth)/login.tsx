import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Image, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout } from '@/api_services/appwrite';
import { images } from '@/constants/images';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Incomplete Fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    logout();
    try {
      const response = await login(email, password);
      console.log('Login successful:');
      await AsyncStorage.setItem('session', JSON.stringify(response));
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => router.push('../(tabs)/profile') }
      ]);
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', `\nLogin failed. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary relative">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <View className="flex-1 justify-center items-center px-5 z-10">
        <Text className="text-3xl text-white font-bold mb-8">Login</Text>
        
        <TextInput
          className="w-full bg-dark-200 p-3 rounded-lg mb-4 text-light-100"
          placeholder="Email"
          placeholderTextColor="#AAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full bg-dark-200 p-3 rounded-lg mb-4 text-light-100"
          placeholder="Password"
          placeholderTextColor="#AAA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <>
          <TouchableOpacity
            className="w-full bg-accent p-4 rounded-lg items-center"
            onPress={handleLogin}
          >
            <Text className="text-white font-bold text-base">Login</Text>
          </TouchableOpacity>
          <Link href="/(auth)/registration" className='text-white mt-4'>or Register!</Link>
          </>
        )}
      </View>
    </View>
  );
}


