import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";

import { fetchMovies } from "@/api_services/api";
import { getTrendingMovies } from "@/api_services/appwrite";
import useFetch from "@/api_services/useFetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState<string | null>(null);

  // Initial load of movies (page 1)
  useEffect(() => {
    const loadInitialMovies = async () => {
      setMoviesLoading(true);
      try {
        const data = await fetchMovies({ query: "", page: 1 });
        setAllMovies(data);
      } catch (error: any) {
        setMoviesError(error.toString());
      }
      setMoviesLoading(false);
    };
    loadInitialMovies();
  }, []);

  const loadMoreContent = async () => {
    if (moviesLoading) return;

    setMoviesLoading(true);
    const nextPage = page + 1;
    try {
      const newMovies = await fetchMovies({ query: "", page: nextPage });
      setAllMovies((prev) => [...prev, ...newMovies]);
      setPage(nextPage);
    } catch (error: any) {
      setMoviesError(error.toString());
    }
    setMoviesLoading(false);
  };

  // When scroll view is scrolled to the bottom, call loadMoreContent
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      console.log("Reached end of content!");
      loadMoreContent();
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading && page === 1 && trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>
            Error: {moviesError || trendingError}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {trendingMovies && trendingMovies.length > 0 && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies ?? []}
                  contentContainerStyle={{ gap: 26 }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item, idx) => idx.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={allMovies ?? []}
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
              />
              {moviesLoading && page > 1 && (
                <ActivityIndicator
                  size="small"
                  color="#FFF"
                  className="self-center"
                />
              )}
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;