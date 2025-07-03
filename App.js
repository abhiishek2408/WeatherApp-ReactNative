import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import WeatherAppWithPicker from './WeatherAppWithPicker';

export default function App() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}>
      <WeatherAppWithPicker/>
      <StatusBar style="auto" />
    </ScrollView>
  );
}
