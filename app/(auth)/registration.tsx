import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { register } from '@/api_services/appwrite';
import { images } from '@/constants/images';

const Registration = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Incomplete Fields", "Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await register(name, email, password);
      console.log("Registration successful:", response);
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => router.push("../login") }
      ]);
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert("Error", `\nRegistration failed. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary relative">
      {/* Background Image */}
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      {/* Registration Form Container */}
      <View className="flex-1 justify-center items-center px-5 z-10">
        <Text className="text-3xl text-white font-bold mb-8">Register</Text>

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          className="w-full bg-dark-200 p-3 rounded-lg mb-4 text-light-100"
          placeholderTextColor="#AAA"
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="w-full bg-dark-200 p-3 rounded-lg mb-4 text-light-100"
          placeholderTextColor="#AAA"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full bg-dark-200 p-3 rounded-lg mb-4 text-light-100"
          placeholderTextColor="#AAA"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <>
            <TouchableOpacity
            onPress={handleRegister}
            className="w-full bg-accent p-4 rounded-lg items-center"
          >
            <Text className="text-center text-white font-bold">
              Register
            </Text>
          </TouchableOpacity>
          <Link href="/(auth)/login" className='text-white mt-4'>or Login!</Link>
          </>
        )}
      </View>
    </View>
  );
};

export default Registration;