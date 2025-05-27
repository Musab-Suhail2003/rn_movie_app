import { View, Text, Image, TextInput } from 'react-native'
import { icons } from '@/constants/icons'
import React from 'react'

interface Props {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({placeholder, onPress, value, onChangeText}: Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image source={icons.search} className='size-5' resizeMode="contain" tintColor="#AB8FF"/>
      <TextInput onPress={onPress} placeholder={placeholder} value={value} onChangeText={onChangeText}
      onSubmitEditing={onPress} placeholderTextColor="#A8B5DB"
        className='flex-1 ml-2 text-white'/>
    </View>
  )
}

export default SearchBar