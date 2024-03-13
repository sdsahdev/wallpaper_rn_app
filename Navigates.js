import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './App';
import FullImage from './src/FullImage';
const Stack = createNativeStackNavigator();

const Navigates = () => {
  return (
    <NavigationContainer >
    <Stack.Navigator  screenOptions={{
    headerShown: false
  }} 
  initialRouteName={App}>
      <Stack.Screen name='App' component={App} />
      <Stack.Screen name='FullImage' component={FullImage} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default Navigates

const styles = StyleSheet.create({})