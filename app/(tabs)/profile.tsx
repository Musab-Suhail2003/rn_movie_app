import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '@/api_services/appwrite';

const profiles = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const cachedSession = await AsyncStorage.getItem('session');
        if (cachedSession !== null) {
          setSession(JSON.parse(cachedSession));
          console.log('Session:', cachedSession);
        }
      } catch (error) {
        console.error("Error fetching session from cache:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  return (
    <View className="bg-primary flex-1 ">
      <Image
              source={images.bg}
              className="absolute flex-0 w-full z-0"
              resizeMode="cover"
            />
      <View className="flex justify-center items-center flex-1 flex-col gap-5 gap-x-10">
        <Image source={icons.person} className="size-10" tintColor="#FFF" />
        <Text className="text-gray-500 text-base">Profile</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : session!=null ? (
          // Display session info if available
          <>
            <Text className="text-white text-lg">Welcome, {session.user ? session.user.name : 'User'}</Text>
            
            <TouchableOpacity className="bg-accent rounded-lg px-4 flex-row items-center justify-center py-3"
              onPress={() => {
                logout()
                setSession(null);
              }}>
              <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#FFF" />
              <Text className="text-white font-sm text-base">Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Otherwise show the Sign Up / Login button
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="bg-accent rounded-lg px-4 flex-row items-center justify-center py-3">
              <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#FFF" />
              <Text className="text-white font-sm text-base">Sign Up / Login!</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );
};

export default profiles