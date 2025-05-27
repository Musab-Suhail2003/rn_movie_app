import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'

// Get screen width
const { width } = Dimensions.get('window');
// Calculate card width (screen width - padding on both sides - total gap between items) / 3 columns
const cardWidth = Math.floor((width - (2 * 20) - (2 * 20)) / 3);

console.log(`Card width: ${cardWidth}`);

const MovieCard = ({id, poster_path, title, vote_average, release_date}:Movie) => {
  return (
    <Link href={{pathname: "/movie/[id]",params: { id: id }} } asChild>
        <TouchableOpacity className='w-[95px]'>
            <Image
                source={{
                    uri: poster_path?`https://image.tmdb.org/t/p/w500${poster_path}`:"https://via.placeholder.com/600x400/1a1a1a/ffffff.png"
                }}
                className='w-full h-52 rounded-lg'
                resizeMode='cover'
            />
            <Text className="text-sm font-bold text-white mt-2" numberOfLines={2}>{title}</Text>
            <View className="flex-row items-center justify-start gap-x-1">
              <Image source={icons.star} className='size-4'/>
              <Text className='text-xs text-white font-bold uppercase'>{Math.round(vote_average/2)}</Text>
            </View>
        </TouchableOpacity>
    </Link>
  );
}

export default MovieCard