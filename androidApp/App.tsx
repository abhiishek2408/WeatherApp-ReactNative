import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WeatherProvider } from './src/context/WeatherContext';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens
import HomeScreen from './WeatherAppWithPicker';
import SettingsScreen from './src/screens/SettingsScreen';
import AQIExplorerScreen from './src/screens/AQIExplorerScreen';

const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <StatusBar barStyle="light-content" backgroundColor="#6b21a8" />
        <View style={styles.container}>
          <NavigationContainer>
            <Tab.Navigator 
              initialRouteName="Home"
              screenOptions={({ route }) => ({
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                tabBarStyle: { backgroundColor: '#151515', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
                tabBarActiveTintColor: '#a855f7',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'AQI') {
                    iconName = focused ? 'globe' : 'globe-outline';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }
                  return <Icon name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ headerShown: false }} 
              />
              <Tab.Screen 
                name="AQI" 
                component={AQIExplorerScreen} 
                options={{ headerShown: false, title: 'Global AQI' }} 
              />
              <Tab.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{ title: 'Settings' }} 
              />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </WeatherProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
