import { Stack } from "expo-router";
import './globals.css';
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true}/>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          }
        }}
      >
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        <Stack.Screen name="movie/[id]" options={{headerShown: false}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
      </Stack>
    </>
  );
}
