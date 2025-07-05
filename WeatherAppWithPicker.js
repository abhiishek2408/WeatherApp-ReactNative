// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import * as Location from 'expo-location';

// export default function WeatherAppWithLocation() {
//   const [selectedCity, setSelectedCity] = useState('');
//   const [weatherData, setWeatherData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const apiKey = '608b586fa202c117435a4a65b316183f';

//   // Fetch weather by city
//   const fetchWeatherByCity = async () => {
//     if (!selectedCity) {
//       Alert.alert('Please select a city');
//       return;
//     }

//     setLoading(true);
//     setWeatherData(null);

//     try {
//       const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.cod === 200) {
//         setWeatherData(data);
//       } else {
//         Alert.alert('Error', data.message || 'City not found');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch weather data');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch weather by current location
//   const fetchWeatherByLocation = async () => {
//     setLoading(true);
//     setWeatherData(null);

//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();

//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Location access is required.');
//         setLoading(false);
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = location.coords;

//       const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.cod === 200) {
//         setWeatherData(data);
//         setSelectedCity(''); // clear picker selection
//       } else {
//         Alert.alert('Error', data.message || 'Failed to fetch location-based weather');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to get location');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🌦️ Weather App</Text>

//       {/* Picker Dropdown */}
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={selectedCity}
//           onValueChange={(itemValue) => setSelectedCity(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select a city..." value="" />
//           <Picker.Item label="Delhi" value="Delhi" />
//           <Picker.Item label="Mumbai" value="Mumbai" />
//           <Picker.Item label="London" value="London" />
//           <Picker.Item label="New York" value="New York" />
//           <Picker.Item label="Tokyo" value="Tokyo" />
//         </Picker>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={fetchWeatherByCity}>
//         <Text style={styles.buttonText}>Get Weather by City</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={fetchWeatherByLocation}>
//         <Text style={styles.buttonText}>Use My Location</Text>
//       </TouchableOpacity>

//       {loading && <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />}

//       {weatherData && (
//         <View style={styles.resultBox}>
//           <Text style={styles.resultCity}>📍 {weatherData.name}</Text>
//           <Text style={styles.result}>🌡 Temp: {weatherData.main.temp} °C</Text>
//           <Text style={styles.result}>☁️ Condition: {weatherData.weather[0].main}</Text>
//           <Text style={styles.result}>💧 Humidity: {weatherData.main.humidity}%</Text>
//           <Text style={styles.result}>🌬 Wind: {weatherData.wind.speed} m/s</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     marginTop: 60,
//     backgroundColor: '#f0f8ff',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 25,
//     color: '#333',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#aaa',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     marginBottom: 20,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   resultBox: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     elevation: 2,
//   },
//   resultCity: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   result: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

export default function WeatherAppWithLocation() {
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = '608b586fa202c117435a4a65b316183f';

  const fetchWeatherByCity = async () => {
    if (!selectedCity) {
      Alert.alert('Please select a city');
      return;
    }

    setLoading(true);
    setWeatherData(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        Alert.alert('Error', data.message || 'City not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setWeatherData(null);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
        setSelectedCity('');
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch location-based weather');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  // Get background based on weather
  const getBackgroundImage = (condition) => {
    switch (condition) {
      case 'Clear':
        return require('./assets/sunny.jpg'); // Replace with your image path
      case 'Clouds':
        return require('./assets/cloudy.jpg');
      case 'Rain':
        return require('./assets/rainy.jpg');
      case 'Snow':  
        return require('./assets/snow.jpg');
      case 'Haze':
      case 'Mist':
        return require('./assets/hazy.jpg');
      default:
        return require('./assets/rainy.jpg');
    }
  };

  const weatherCondition = weatherData?.weather[0]?.main;
  const bgImage = weatherData ? getBackgroundImage(weatherCondition) : null;

  return (
    <ImageBackground
      source={bgImage}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ opacity: 0.85 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🌦️ Weather App</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => setSelectedCity(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a city..." value="" />
            <Picker.Item label="Delhi" value="Delhi" />
            <Picker.Item label="Mumbai" value="Mumbai" />
            <Picker.Item label="London" value="London" />
            <Picker.Item label="New York" value="New York" />
            <Picker.Item label="Tokyo" value="Tokyo" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={fetchWeatherByCity}>
          <Text style={styles.buttonText}>Get Weather by City</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={fetchWeatherByLocation}>
          <Text style={styles.buttonText}>Use My Location</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

        {weatherData && (
          <View style={styles.resultBox}>
            <Text style={styles.resultCity}>📍 {weatherData.name}</Text>
            <Text style={styles.result}>🌡 Temp: {weatherData.main.temp} °C</Text>
            <Text style={styles.result}>☁️ Condition: {weatherCondition}</Text>
            <Text style={styles.result}>💧 Humidity: {weatherData.main.humidity}%</Text>
            <Text style={styles.result}>🌬 Wind: {weatherData.wind.speed} m/s</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    backgroundColor: '#ffffffcc',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  resultCity: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  result: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
});
