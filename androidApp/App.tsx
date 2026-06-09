import React, { useCallback, Suspense, lazy } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeatherProvider } from './src/context/WeatherContext';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './WeatherAppWithPicker';
const SettingsScreen = lazy(() => import('./src/screens/SettingsScreen'));
const AQIExplorerScreen = lazy(() => import('./src/screens/AQIExplorerScreen'));

const queryClient = new QueryClient();

const ScreenFallback = () => (
  <View style={styles.fallbackContainer}>
    <ActivityIndicator size="large" color="#a855f7" />
  </View>
);

const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const getScreenOptions = useCallback(({ route }: { route: any }) => ({
    headerStyle: { backgroundColor: '#121212' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' as const },
    tabBarStyle: { backgroundColor: '#151515', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
    tabBarActiveTintColor: '#a855f7',
    tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
    tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
      let iconName: string = 'help-circle-outline';
      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'AQI') {
        iconName = focused ? 'globe' : 'globe-outline';
      } else if (route.name === 'Settings') {
        iconName = focused ? 'settings' : 'settings-outline';
      }
      return <Icon name={iconName} size={size} color={color} />;
    },
  }), []);

  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <StatusBar barStyle="light-content" backgroundColor="#6b21a8" />
        <View style={styles.container}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<ScreenFallback />}>
              <NavigationContainer>
                <Tab.Navigator
                  initialRouteName="Home"
                  screenOptions={getScreenOptions}
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
            </Suspense>
          </QueryClientProvider>
        </View>
      </WeatherProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212'
  }
});

export default App;
