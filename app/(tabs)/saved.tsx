import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserSaved } from '@/api_services/appwrite';
import { fetchMovieDetails } from '@/api_services/api';
import MovieCard from '@/components/MovieCard';
import { useFocusEffect } from '@react-navigation/native';

const Saved = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [moviesError, setMoviesError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch session and saved movies.
  const fetchSessionData = useCallback(async () => {
    try {
      const cachedSessionString = await AsyncStorage.getItem('session');
      if (cachedSessionString !== null) {
        const parsedSession = JSON.parse(cachedSessionString);
        setSession(parsedSession);
        // Get saved document from Appwrite using the user id.
        const userSavedData = await getUserSaved(parsedSession.user.$id);
        if (userSavedData && userSavedData.saved && userSavedData.saved.length > 0) {
          // Assume userSavedData.saved contains an array of movie IDs.
          const moviesData = await Promise.all(
            userSavedData.saved.map((movieId: string) => fetchMovieDetails(movieId))
          );
          setSavedMovies(moviesData);
        } else {
          setSavedMovies([]);
        }
      } else {
        setSession(null);
        setSavedMovies([]);
      }
    } catch (error) {
      console.error("Error fetching session from cache:", error);
      setMoviesError(`${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Pull-to-refresh handler.
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSessionData();
    setRefreshing(false);
  };

  // Update session data when the screen is focused.
  useFocusEffect(
    useCallback(() => {
      fetchSessionData();
    }, [fetchSessionData])
  );

  return (
    <View className='bg-primary flex-1'>
      <Image source={images.bg}
             className="absolute flex-0 w-full z-0"
             resizeMode="cover" />
      
      <View className="flex justify-start items-center flex-1 flex-col gap-5 mt-10 gap-x-10">
        
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : session != null ? (
          <>
                  <Image source={icons.save} className='size-10 ' tintColor="#FFF"/>
            <Text className="text-white text-lg">Your Saved Movies</Text>
            <FlatList
              data={savedMovies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item, idx) => idx.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={handleRefresh} 
                  tintColor="#FFF"
                />
              }
            />
          </>
        ) : (
          
          <View className='flex justify-center items-center flex-1 flex-col gap-5 gap-x-10'>
                    <Image source={icons.save} className='size-10 ' tintColor="#FFF"/>
            <Text className='text-gray-500 text-base'>Your Saved Movies Go Here!</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity className='bg-accent rounded-lg px-4 flex-row items-center justify-center py-3'>
                <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor="#FFF"/>
                <Text className='text-white font-sm text-base'>Sign Up / Login!</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </View>
  );
};

export default Saved;