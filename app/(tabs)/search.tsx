import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import { images } from '@/constants/images'
import React, { useEffect, useState } from 'react'
import MovieCard from '@/components/MovieCard'
import useFetch from '@/api_services/useFetch'
import { fetchMovies } from '@/api_services/api'
import { icons } from '@/constants/icons'
import  SearchBar  from '@/components/SearchBar'
import { updateSearchCount } from '@/api_services/appwrite'

const search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);


  const {data: movies = [], loading, error, refetch: loadMovies, reset,} = useFetch(
                                                      () => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
        if (movies?.length! > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();

        // Call updateSearchCount only if there are results
        if (movies?.length! > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover'/>

      <FlatList data={movies} renderItem={({item}) => <MovieCard {...item}/>}
                               keyExtractor={(item, idx)=>idx.toString()}
                                className='px-5 ' numColumns={3}
                                columnWrapperStyle={{justifyContent: 'flex-start', gap:16, marginVertical: 16}}
                                contentContainerStyle={{paddingBottom: 100}}
                                ListHeaderComponent={
                                  <>
                                      <View className="w-full flex-row justify-center mt-20 items-center">
                                        <Image source={icons.logo} className="w-12 h-10" />
                                      </View>

                                      <View className="my-5">
                                        <SearchBar
                                          placeholder="Search for a movie"
                                          value={searchQuery}
                                          onChangeText={handleSearch}
                                        />
                                      </View>

                                      {loading && (
                                        <ActivityIndicator size="large" color="#0000FF"/>
                                      )}
                                      {error && (
                                        <Text className="px-5 my-3 text-red-500"> Error: {error?.toString()}</Text>
                                      )}
                                       {!loading &&
                                        !error &&
                                        searchQuery.trim() &&
                                        movies?.length! > 0 && (
                                          <Text className="text-xl text-white font-bold">
                                            Search Results for{" "}
                                            <Text className="text-accent">{searchQuery}</Text>
                                          </Text>
                                        )}
                                  </>
                                }
                                ListEmptyComponent={
                                  <>
                                    {!loading && !error ? (
                                      <View className='mt-10 px-5'>
                                        <Text className='text-center text-gray-500 '>
                                          {searchQuery.trim() ? `No results found` : 'Search for a movie!'}
                                        </Text>
                                      </View>
                                    ) : null}
                                  </>
                                }
      />
    </View>
  )
}

export default search