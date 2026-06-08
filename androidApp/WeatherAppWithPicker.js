import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Animated,
  RefreshControl,
  Keyboard,
  Image,
  Modal,
  Switch,
  Vibration,
  Share,
  Linking,
  BackHandler,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const translations = {
  en: {
    weather: 'Weather', forecast: 'Forecast', searchPlaceholder: 'Search for a city...',
    savedCities: 'Saved Cities', or: 'OR', myLocation: 'My Location', humidity: 'Humidity',
    wind: 'Wind', feelsLike: 'Feels Like', visibility: 'Visibility', pressure: 'Pressure',
    clouds: 'Clouds', airQuality: 'Air Quality', feelsLikeDiff: 'Feels Like Diff',
    sunrise: 'Sunrise', sunset: 'Sunset', moonPhase: 'Moon Phase', today: 'Today',
    fiveDayForecast: '5-Day Forecast', didYouKnow: 'Did you know?', fetchingWeather: 'Fetching Weather...',
    settings: 'Settings', minimalistTheme: 'Minimalist Theme', language: 'Language',
    ootdTitle: 'Outfit of the Day', shareWeather: 'Share Weather', viewRadar: 'Live Radar', streak: 'Day Streak',
    aqi: ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor', 'Unknown'],
    moon: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'],
    insights: {
      umbrella: "Don't forget your umbrella today!", snow: "It's snowing! Dress warmly.",
      thunder: "Thunderstorms expected. Stay indoors.", hot: "It's quite hot! Stay hydrated.",
      cold: "Brrr! It's freezing outside. Bundle up!", windy: "It's very windy today.",
      perfect: "Perfect weather for a walk or run!", enjoy: "Enjoy your day!"
    }
  },
  es: {
    weather: 'Clima', forecast: 'Pronóstico', searchPlaceholder: 'Buscar una ciudad...',
    savedCities: 'Ciudades Guardadas', or: 'O', myLocation: 'Mi Ubicación', humidity: 'Humedad',
    wind: 'Viento', feelsLike: 'Sensación', visibility: 'Visibilidad', pressure: 'Presión',
    clouds: 'Nubes', airQuality: 'Calidad del Aire', feelsLikeDiff: 'Dif de Sensación',
    sunrise: 'Amanecer', sunset: 'Atardecer', moonPhase: 'Fase Lunar', today: 'Hoy',
    fiveDayForecast: 'Pronóstico 5 Días', didYouKnow: '¿Sabías que?', fetchingWeather: 'Obteniendo Clima...',
    settings: 'Ajustes', minimalistTheme: 'Tema Minimalista', language: 'Idioma',
    ootdTitle: 'Atuendo del Día', shareWeather: 'Compartir Clima', viewRadar: 'Radar en Vivo', streak: 'Racha de Días',
    aqi: ['Bueno', 'Justo', 'Moderado', 'Malo', 'Muy Malo', 'Desconocido'],
    moon: ['Luna Nueva', 'Luna Creciente', 'Cuarto Creciente', 'Luna Gibosa', 'Luna Llena', 'Luna Menguante', 'Cuarto Menguante', 'Luna Balsámica'],
    insights: {
      umbrella: "¡No olvides tu paraguas hoy!", snow: "¡Está nevando! Abrígate bien.",
      thunder: "Se esperan tormentas. Mejor adentro.", hot: "¡Hace mucho calor! Hidrátate.",
      cold: "¡Brrr! Hace mucho frío. ¡Abrígate!", windy: "Hace mucho viento hoy.",
      perfect: "¡Clima perfecto para caminar!", enjoy: "¡Disfruta tu día!"
    }
  },
  fr: {
    weather: 'Météo', forecast: 'Prévisions', searchPlaceholder: 'Rechercher une ville...',
    savedCities: 'Villes Enregistrées', or: 'OU', myLocation: 'Ma Position', humidity: 'Humidité',
    wind: 'Vent', feelsLike: 'Ressenti', visibility: 'Visibilité', pressure: 'Pression',
    clouds: 'Nuages', airQuality: 'Qualité de l\'Air', feelsLikeDiff: 'Diff de Ressenti',
    sunrise: 'Lever', sunset: 'Coucher', moonPhase: 'Phase de Lune', today: 'Aujourd\'hui',
    fiveDayForecast: 'Prévisions 5 Jours', didYouKnow: 'Le saviez-vous ?', fetchingWeather: 'Météo en cours...',
    settings: 'Paramètres', minimalistTheme: 'Thème Minimaliste', language: 'Langue',
    ootdTitle: 'Tenue du Jour', shareWeather: 'Partager Météo', viewRadar: 'Radar en Direct', streak: 'Série de Jours',
    aqi: ['Bon', 'Moyen', 'Modéré', 'Mauvais', 'Très Mauvais', 'Inconnu'],
    moon: ['Nouvelle Lune', 'Premier Croissant', 'Premier Quartier', 'Lune Gibbeuse', 'Pleine Lune', 'Lune Décroissante', 'Dernier Quartier', 'Dernier Croissant'],
    insights: {
      umbrella: "N'oubliez pas votre parapluie !", snow: "Il neige ! Habillez-vous chaudement.",
      thunder: "Orages prévus. Restez à l'intérieur.", hot: "Il fait très chaud ! Hydratez-vous.",
      cold: "Brrr ! Il gèle dehors. Couvrez-vous !", windy: "Il y a beaucoup de vent.",
      perfect: "Temps parfait pour se promener !", enjoy: "Passez une bonne journée !"
    }
  },
  hi: {
    weather: 'मौसम', forecast: 'पूर्वानुमान', searchPlaceholder: 'शहर खोजें...',
    savedCities: 'सहेजे गए शहर', or: 'या', myLocation: 'मेरा स्थान', humidity: 'नमी',
    wind: 'हवा', feelsLike: 'महसूस होता है', visibility: 'दृश्यता', pressure: 'दबाव',
    clouds: 'बादल', airQuality: 'वायु गुणवत्ता', feelsLikeDiff: 'महसूस अंतर',
    sunrise: 'सूर्योदय', sunset: 'सूर्यास्त', moonPhase: 'चंद्र कला', today: 'आज',
    fiveDayForecast: '5-दिन पूर्वानुमान', didYouKnow: 'क्या आप जानते हैं?', fetchingWeather: 'मौसम प्राप्त कर रहा है...',
    settings: 'सेटिंग्स', minimalistTheme: 'न्यूनतम विषय', language: 'भाषा',
    ootdTitle: 'आज का पहनावा', shareWeather: 'मौसम साझा करें', viewRadar: 'लाइव रडार', streak: 'दिन की स्ट्रीक',
    aqi: ['अच्छा', 'उचित', 'मध्यम', 'खराब', 'बहुत खराब', 'अज्ञात'],
    moon: ['अमावस्या', 'वर्धमान चंद्र', 'प्रथम चतुर्थांश', 'शुक्ल पक्ष', 'पूर्णिमा', 'कृष्ण पक्ष', 'अंतिम चतुर्थांश', 'क्षयमान चंद्र'],
    insights: {
      umbrella: "आज अपना छाता न भूलें!", snow: "बर्फबारी हो रही है! गर्म कपड़े पहनें।",
      thunder: "आंधी की उम्मीद है। घर के अंदर रहें।", hot: "काफी गर्मी है! हाइड्रेटेड रहें।",
      cold: "बाहर ठंड है! कपड़े पहनें!", windy: "आज काफी हवा है।",
      perfect: "टहलने के लिए उत्तम मौसम!", enjoy: "अपने दिन का आनंद लें!"
    }
  },
  pa: {
    weather: 'ਮੌਸਮ', forecast: 'ਭਵਿੱਖਬਾਣੀ', searchPlaceholder: 'ਸ਼ਹਿਰ ਖੋਜੋ...',
    savedCities: 'ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਸ਼ਹਿਰ', or: 'ਜਾਂ', myLocation: 'ਮੇਰਾ ਸਥਾਨ', humidity: 'ਨਮੀ',
    wind: 'ਹਵਾ', feelsLike: 'ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ', visibility: 'ਦਿੱਖ', pressure: 'ਦਬਾਅ',
    clouds: 'ਬੱਦਲ', airQuality: 'ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ', feelsLikeDiff: 'ਮਹਿਸੂਸ ਅੰਤਰ',
    sunrise: 'ਸੂਰਜ ਚੜ੍ਹਨਾ', sunset: 'ਸੂਰਜ ਡੁੱਬਣਾ', moonPhase: 'ਚੰਦਰਮਾ ਦਾ ਪੜਾਅ', today: 'ਅੱਜ',
    fiveDayForecast: '5-ਦਿਨ ਭਵਿੱਖਬਾਣੀ', didYouKnow: 'ਕੀ ਤੁਹਾਨੂੰ ਪਤਾ ਹੈ?', fetchingWeather: 'ਮੌਸਮ ਪ੍ਰਾਪਤ ਕਰ ਰਿਹਾ ਹੈ...',
    settings: 'ਸੈਟਿੰਗਾਂ', minimalistTheme: 'ਨਿਊਨਤਮ ਥੀਮ', language: 'ਭਾਸ਼ਾ',
    ootdTitle: 'ਅੱਜ ਦਾ ਪਹਿਰਾਵਾ', shareWeather: 'ਮੌਸਮ ਸਾਂਝਾ ਕਰੋ', viewRadar: 'ਲਾਈਵ ਰਡਾਰ', streak: 'ਦਿਨ ਦੀ ਸਟ੍ਰੀਕ',
    aqi: ['ਚੰਗਾ', 'ਉਚਿਤ', 'ਦਰਮਿਆਨਾ', 'ਮਾੜਾ', 'ਬਹੁਤ ਮਾੜਾ', 'ਅਗਿਆਤ'],
    moon: ['ਨਵਾਂ ਚੰਦ', 'ਵਧਦਾ ਚੰਦ', 'ਪਹਿਲੀ ਤਿਮਾਹੀ', 'ਚਾਨਣ ਪੱਖ', 'ਪੂਰਨਮਾਸ਼ੀ', 'ਹਨੇਰਾ ਪੱਖ', 'ਆਖਰੀ ਤਿਮਾਹੀ', 'ਘਟਦਾ ਚੰਦ'],
    insights: {
      umbrella: "ਅੱਜ ਆਪਣੀ ਛੱਤਰੀ ਨਾ ਭੁੱਲੋ!", snow: "ਬਰਫ਼ ਪੈ ਰਹੀ ਹੈ! ਗਰਮ ਕੱਪੜੇ ਪਾਓ।",
      thunder: "ਤੂਫਾਨ ਦੀ ਉਮੀਦ ਹੈ। ਅੰਦਰ ਰਹੋ।", hot: "ਬਹੁਤ ਗਰਮੀ ਹੈ! ਹਾਈਡਰੇਟਿਡ ਰਹੋ।",
      cold: "ਬਾਹਰ ਬਹੁਤ ਠੰਢ ਹੈ! ਕੱਪੜੇ ਪਾਓ!", windy: "ਅੱਜ ਬਹੁਤ ਹਵਾ ਹੈ।",
      perfect: "ਸੈਰ ਲਈ ਵਧੀਆ ਮੌਸਮ!", enjoy: "ਆਪਣੇ ਦਿਨ ਦਾ ਆਨੰਦ ਮਾਣੋ!"
    }
  }
};

const WeatherParticles = ({ condition }) => {
  if (condition !== 'Rain' && condition !== 'Snow' && condition !== 'Drizzle') return null;
  const isSnow = condition === 'Snow';
  const numParticles = isSnow ? 50 : 80;
  
  const particles = Array.from({ length: numParticles }).map((_, i) => {
    const startX = Math.random() * 600 - 100; // Allow drift from outside screen
    const startY = Math.random() * -1000 - 100;
    const endY = startY + 1500;
    const animY = useRef(new Animated.Value(0)).current;
    const animX = useRef(new Animated.Value(0)).current;
    const speed = Math.random() * 1500 + (isSnow ? 3000 : 800);
    const delay = Math.random() * 2000;
    const opacity = Math.random() * 0.5 + 0.3;
    const drift = isSnow ? (Math.random() * 200 - 100) : (Math.random() * 50 - 25);

    useEffect(() => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(animY, {
            toValue: 1,
            duration: speed,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: 1,
            duration: speed,
            delay: delay,
            useNativeDriver: true,
          })
        ])
      ).start();
    }, []);

    const translateY = animY.interpolate({ inputRange: [0, 1], outputRange: [startY, endY] });
    const translateX = animX.interpolate({ inputRange: [0, 1], outputRange: [startX, startX + drift] });
    
    return (
      <Animated.View
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: isSnow ? (Math.random() * 4 + 4) : (Math.random() * 1 + 1),
          height: isSnow ? (Math.random() * 4 + 4) : (Math.random() * 15 + 10),
          backgroundColor: `rgba(255, 255, 255, ${opacity})`,
          borderRadius: isSnow ? 5 : 1,
          transform: [{ translateX }, { translateY }, { rotate: isSnow ? '0deg' : '15deg' }],
        }}
      />
    );
  });

  return <View style={StyleSheet.absoluteFill} pointerEvents="none">{particles}</View>;
};

const ThunderAnimation = ({ condition }) => {
  if (condition !== 'Thunderstorm') return null;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeoutId;
    const triggerFlash = () => {
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0.2, duration: 50, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0.8, duration: 50, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      
      const nextFlash = Math.random() * 8000 + 3000;
      timeoutId = setTimeout(triggerFlash, nextFlash);
    };

    triggerFlash();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFill, 
        { backgroundColor: 'white', opacity: flashAnim }
      ]} 
      pointerEvents="none" 
    />
  );
};

const triviaQuestions = [
  { q: "What is the hottest planet in our solar system?", options: ["Venus", "Mars", "Mercury", "Jupiter"], a: "Venus" },
  { q: "What is the speed of a Category 5 hurricane?", options: ["Over 157 mph", "Over 100 mph", "Over 200 mph", "Over 130 mph"], a: "Over 157 mph" },
  { q: "What do you call a cloud on the ground?", options: ["Fog", "Mist", "Smog", "Dew"], a: "Fog" },
  { q: "Which of these is not a type of cloud?", options: ["Altocirrus", "Cumulonimbus", "Stratus", "Cirrus"], a: "Altocirrus" },
  { q: "Where was the highest temp on Earth recorded?", options: ["Death Valley", "Sahara", "Lut Desert", "Gobi Desert"], a: "Death Valley" }
];

const globalAqiLocations = {
  "India": {
    "Maharashtra": {
      "Mumbai": { lat: 19.0760, lon: 72.8777 },
      "Pune": { lat: 18.5204, lon: 73.8567 },
      "Nagpur": { lat: 21.1458, lon: 79.0882 }
    },
    "Delhi": {
      "New Delhi": { lat: 28.6139, lon: 77.2090 }
    },
    "Karnataka": {
      "Bangalore": { lat: 12.9716, lon: 77.5946 },
      "Mysore": { lat: 12.2958, lon: 76.6394 }
    },
    "Punjab": {
      "Amritsar": { lat: 31.6340, lon: 74.8723 },
      "Ludhiana": { lat: 30.9010, lon: 75.8523 }
    }
  },
  "USA": {
    "California": {
      "Los Angeles": { lat: 34.0522, lon: -118.2437 },
      "San Francisco": { lat: 37.7749, lon: -122.4194 }
    },
    "New York": {
      "New York City": { lat: 40.7128, lon: -74.0060 }
    }
  },
  "UK": {
    "England": {
      "London": { lat: 51.5074, lon: -0.1278 },
      "Manchester": { lat: 53.4808, lon: -2.2426 }
    }
  },
  "China": {
    "Beijing": {
      "Beijing City": { lat: 39.9042, lon: 116.4074 }
    },
    "Shanghai": {
      "Shanghai City": { lat: 31.2304, lon: 121.4737 }
    }
  }
};

export default function WeatherAppWithLocation() {
  const navigation = useNavigation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [trivia, setTrivia] = useState('');
  const [unit, setUnit] = useState('metric');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dynamic');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [streak, setStreak] = useState(0);

  // Engagement Features State
  const [triviaScore, setTriviaScore] = useState(0);
  const [lastTriviaDate, setLastTriviaDate] = useState(null);
  const [currentTrivia, setCurrentTrivia] = useState(null);
  const [triviaAnsweredToday, setTriviaAnsweredToday] = useState(false);
  
  // AQI Explorer States
  const [aqiExplorerVisible, setAqiExplorerVisible] = useState(false);
  const [explorerPath, setExplorerPath] = useState([]); 
  const [deepDiveData, setDeepDiveData] = useState(null); 
  const [fetchingDeepDive, setFetchingDeepDive] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [bottomCardVisible, setBottomCardVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const apiKey = '9b01d0c4095bf19142e51ddf0896e386';

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (aqiExplorerVisible) {
        setAqiExplorerVisible(false);
        return true;
      }
      if (settingsVisible) {
        setSettingsVisible(false);
        return true;
      }
      if (bottomCardVisible) {
        setBottomCardVisible(false);
        return true;
      }
      if (weatherData) {
        setWeatherData(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [weatherData, aqiExplorerVisible, settingsVisible, bottomCardVisible]);

  useFocusEffect(
    useCallback(() => {
      const syncSettings = async () => {
        try {
          const savedTheme = await AsyncStorage.getItem('@theme');
          if (savedTheme !== null) setTheme(savedTheme);
          
          const savedLang = await AsyncStorage.getItem('@language');
          if (savedLang !== null) setLanguage(savedLang);
          
          const savedUnit = await AsyncStorage.getItem('@unit');
          if (savedUnit !== null) setUnit(savedUnit);
        } catch (e) {}
      };
      syncSettings();
    }, [])
  );

  const loadInitialData = async () => {
    try {
      const savedFavs = await AsyncStorage.getItem('@favorites');
      if (savedFavs !== null) {
        setFavorites(JSON.parse(savedFavs));
      }
      
      const savedUnit = await AsyncStorage.getItem('@unit');
      if (savedUnit !== null) {
        setUnit(savedUnit);
      }
      
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme !== null) {
        setTheme(savedTheme);
      }

      const savedLang = await AsyncStorage.getItem('@language');
      if (savedLang !== null) {
        setLanguage(savedLang);
      }
      
      const lastOpen = await AsyncStorage.getItem('@last_open_date');
      const currentStreak = await AsyncStorage.getItem('@streak_count');
      const today = new Date().toDateString();
      let newStreak = currentStreak ? parseInt(currentStreak) : 0;
      
      if (lastOpen === today) {
        setStreak(newStreak);
      } else if (lastOpen) {
        const lastDate = new Date(lastOpen);
        const diffTime = Math.abs(new Date() - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
        await AsyncStorage.setItem('@streak_count', newStreak.toString());
        await AsyncStorage.setItem('@last_open_date', today);
        setStreak(newStreak);
      } else {
        newStreak = 1;
        await AsyncStorage.setItem('@streak_count', '1');
        await AsyncStorage.setItem('@last_open_date', today);
        setStreak(newStreak);
      }
      
      const savedWeather = await AsyncStorage.getItem('@weatherData');
      const savedForecast = await AsyncStorage.getItem('@forecastData');
      
      // We still want to parse them if we need them in the future, 
      // but to ensure the search screen opens first, we will NOT set weatherData here automatically.
      // The user must search or pick a favorite to view the weather.

      const savedTriviaScore = await AsyncStorage.getItem('@trivia_score');
      if (savedTriviaScore) setTriviaScore(parseInt(savedTriviaScore));

      const savedLastTrivia = await AsyncStorage.getItem('@last_trivia_date');
      if (savedLastTrivia === today) {
        setTriviaAnsweredToday(true);
      } else {
        pickDailyTrivia();
      }
    } catch (e) {
      console.error('Failed to load initial data', e);
    }
  };

  const pickDailyTrivia = () => {
    const randomQ = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    setCurrentTrivia(randomQ);
  };

  const handleTriviaAnswer = async (selectedOption) => {
    if (!currentTrivia) return;
    if (selectedOption === currentTrivia.a) {
      const newScore = triviaScore + 1;
      setTriviaScore(newScore);
      await AsyncStorage.setItem('@trivia_score', newScore.toString());
      Vibration.vibrate(100);
    } else {
      Vibration.vibrate([100, 100, 100]);
    }
    setTriviaAnsweredToday(true);
    await AsyncStorage.setItem('@last_trivia_date', new Date().toDateString());
  };

  const processDailyForecast = (list) => {
    const dailyMap = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; 
      if (!dailyMap[date]) {
        dailyMap[date] = { min: item.main.temp_min, max: item.main.temp_max, weather: item.weather[0] };
      } else {
        dailyMap[date].min = Math.min(dailyMap[date].min, item.main.temp_min);
        dailyMap[date].max = Math.max(dailyMap[date].max, item.main.temp_max);
      }
    });
    
    const dailyArray = Object.keys(dailyMap).map(date => ({
      date,
      ...dailyMap[date]
    })).slice(0, 5);
    
    setDailyForecast(dailyArray);
  };

  const getDayName = (dateString, index) => {
    if (index === 0) return 'Today';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const toggleUnit = async () => {
    Vibration.vibrate(40);
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    await AsyncStorage.setItem('@unit', newUnit);
    if (weatherData) {
      fetchWeather(`lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`, true, newUnit);
    }
  };

  const toggleFavorite = async () => {
    Vibration.vibrate(40);
    if (!weatherData) return;
    const cityName = weatherData.name;
    try {
      let newFavs;
      if (favorites.includes(cityName)) {
        newFavs = favorites.filter(f => f !== cityName);
      } else {
        if (favorites.length >= 5) {
          Alert.alert("Limit Reached", "You can only save up to 5 cities. Please unsave a city first.");
          return;
        }
        newFavs = [...favorites, cityName];
      }
      setFavorites(newFavs);
      await AsyncStorage.setItem('@favorites', JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to save favorite', e);
    }
  };

  const removeFavorite = async (cityName) => {
    try {
      const newFavs = favorites.filter(f => f !== cityName);
      setFavorites(newFavs);
      await AsyncStorage.setItem('@favorites', JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to remove favorite', e);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${apiKey}`);
          const data = await res.json();
          if (Array.isArray(data)) {
            // Filter out exact duplicates based on city name and country
            const unique = data.filter((v,i,a)=>a.findIndex(v2=>(v2.name===v.name && v2.country===v.country))===i);
            setSuggestions(unique);
          }
        } catch (e) {}
      } else {
        setSuggestions([]);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Atmosync needs access to your location to provide local weather updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  const fetchWeatherByLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }
      setLoading(true);
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`lat=${latitude}&lon=${longitude}`);
        },
        (error) => {
          Alert.alert('Location Error', error.message || 'Failed to get location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request location permission');
      setLoading(false);
    }
  };

  const fetchWeather = async (queryParam, isRefresh = false, overrideUnit = unit, overrideLang = language) => {
    if (!isRefresh) {
      setLoading(true);
      setWeatherData(null);
      setForecastData(null);
      setDailyForecast([]);
      setAqi(null);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
    Keyboard.dismiss();
    setSuggestions([]);

    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${queryParam}&appid=${apiKey}&units=${overrideUnit}&lang=${overrideLang}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${queryParam}&appid=${apiKey}&units=${overrideUnit}&lang=${overrideLang}`;
      
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);
      
      const wData = await weatherRes.json();
      const fData = await forecastRes.json();

      if (wData.cod === 200) {
        setRefreshing(false);
        if (fData.cod === "200") {
          setForecastData(fData.list.slice(0, 8)); // Next 24 hours (8 periods of 3 hours)
          processDailyForecast(fData.list);
        }
        
        try {
          const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${wData.coord.lat}&lon=${wData.coord.lon}&appid=${apiKey}`;
          const aqiRes = await fetch(aqiUrl);
          const aqiData = await aqiRes.json();
          if (aqiData.list && aqiData.list.length > 0) {
            setAqi(aqiData.list[0].main.aqi);
          }
        } catch (e) { console.log('Failed to fetch AQI'); }

        const triviaList = [
          "A bolt of lightning is five times hotter than the surface of the sun.",
          "The fastest falling raindrop travels at about 18 mph.",
          "A hurricane releases the energy of 10 atomic bombs every second.",
          "Snow is not actually white; it's clear and reflects light.",
          "The wettest place on Earth is Mawsynram, India.",
          "A cubic mile of ordinary fog contains less than a gallon of water.",
          "Crickets can tell you the temperature! Count their chirps."
        ];
        setTrivia(triviaList[Math.floor(Math.random() * triviaList.length)]);
        
        await AsyncStorage.setItem('@weatherData', JSON.stringify(wData));
        await AsyncStorage.setItem('@forecastData', JSON.stringify(fData));
        setWeatherData(wData);
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          })
        ]).start();

      } else {
        Alert.alert('Error', wData.message || 'Failed to fetch weather data');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Failed to fetch weather data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (weatherData) {
      setRefreshing(true);
      fetchWeather(`lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`, true);
    }
  };

  const fetchDeepDiveAqi = async (cityName, lat, lon) => {
    setFetchingDeepDive(true);
    setDeepDiveData(null);
    try {
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const res = await fetch(aqiUrl);
      const data = await res.json();
      if (data.list && data.list.length > 0) {
        setDeepDiveData({
          cityName,
          ...data.list[0]
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch detailed AQI');
    } finally {
      setFetchingDeepDive(false);
    }
  };

  const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  const formatForecastTime = (dt_txt) => {
    const date = new Date(dt_txt);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours} ${ampm}`;
  };

  const getBackgroundImage = (condition) => {
    switch (condition) {
      case 'Clear': return require('./assets/sunny.jpg');
      case 'Clouds': return require('./assets/cloudy.jpg');
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm': return require('./assets/rainy.jpg');
      case 'Snow': return require('./assets/snow.jpg');
      case 'Haze':
      case 'Mist':
      case 'Fog': return require('./assets/hazy.jpg');
      default: return require('./assets/default.jpg');
    }
  };



  const changeLanguage = async (lang) => {
    Vibration.vibrate(40);
    setLanguage(lang);
    await AsyncStorage.setItem('@language', lang);
    if (weatherData) {
      fetchWeather(`lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`, true, unit, lang);
    }
  };

  const toggleTheme = async () => {
    Vibration.vibrate(40);
    const newTheme = theme === 'dynamic' ? 'solid' : 'dynamic';
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };

  const getInsights = () => {
    if (!weatherData) return "";
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main;
    const wind = weatherData.wind.speed;
    const tLang = translations[language].insights;
    
    const tempC = unit === 'imperial' ? (temp - 32) * 5/9 : temp;
    const windMps = unit === 'imperial' ? wind * 0.44704 : wind;
    
    if (condition === 'Rain' || condition === 'Drizzle') return tLang.umbrella;
    if (condition === 'Snow') return tLang.snow;
    if (condition === 'Thunderstorm') return tLang.thunder;
    if (tempC > 30) return tLang.hot;
    if (tempC < 5) return tLang.cold;
    if (windMps > 10) return tLang.windy;
    if (condition === 'Clear' && tempC > 15 && tempC < 25) return tLang.perfect;
    
    return tLang.enjoy;
  };

  const getMoonPhase = (date = new Date()) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 3) { year--; month += 12; }
    ++month;
    let jd = 365.25 * year + 30.6 * month + day - 694039.09;
    jd /= 29.5305882;
    let phase = Math.round((jd - parseInt(jd)) * 8);
    if (phase >= 8) phase = 0;
    return translations[language].moon[phase];
  };

  const getAqiColor = (val) => {
    switch(val) {
      case 1: return '#00e400';
      case 2: return '#ffff00';
      case 3: return '#ff7e00';
      case 4: return '#ff0000';
      case 5: return '#8f3f97';
      default: return '#fff';
    }
  };

  const getAqiText = (val) => {
    if (val >= 1 && val <= 5) return translations[language].aqi[val - 1];
    return translations[language].aqi[5];
  };

  const getCommunityPulse = () => {
    if (!weatherData) return null;
    const feels = weatherData.main.feels_like;
    const condition = weatherData.weather[0].main;
    const isImperial = unit === 'imperial';
    const feelsC = isImperial ? (feels - 32) * 5/9 : feels;

    const dateStr = new Date().toDateString();
    const hash = (dateStr + weatherData.name).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const percentage = 65 + (hash % 25); 

    if (feelsC > 35) {
      return `${percentage}% of people here feel Exhausted today. Stay hydrated!`;
    } else if (feelsC < 5) {
      return `${percentage}% of people here feel Freezing today. Bundle up!`;
    } else if (condition === 'Rain' || condition === 'Drizzle') {
      return `${percentage}% of people here feel Cozy today. Good day for tea!`;
    } else if (condition === 'Clear' && feelsC >= 15 && feelsC <= 25) {
      return `${percentage}% of people here feel Energetic today. Perfect weather!`;
    } else if (condition === 'Clouds') {
      return `${percentage}% of people here feel Gloomy today. Hang in there!`;
    } else {
      return `${percentage}% of people here are enjoying the day!`;
    }
  };

  const getOOTD = () => {
    if (!weatherData) return null;
    const feels = weatherData.main.feels_like;
    const condition = weatherData.weather[0].main;
    const isImperial = unit === 'imperial';
    const feelsC = isImperial ? (feels - 32) * 5/9 : feels;
    
    if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') {
      return { text: "Raincoat or a waterproof jacket, and don't forget an umbrella!", icon: 'umbrella-outline' };
    } else if (condition === 'Snow') {
      return { text: "Heavy winter coat, gloves, scarf, and warm boots!", icon: 'snow-outline' };
    } else if (feelsC < 5) {
      return { text: "Heavy coat, layers, and a warm hat!", icon: 'thermometer-outline' };
    } else if (feelsC < 15) {
      return { text: "A warm sweater or a light jacket.", icon: 'shirt-outline' };
    } else if (feelsC < 25) {
      return { text: "A t-shirt or a light long-sleeve. Very comfortable!", icon: 'partly-sunny-outline' };
    } else {
      return { text: "Shorts, a breathable t-shirt, and sunglasses!", icon: 'sunny-outline' };
    }
  };

  const shareWeather = async () => {
    if (!weatherData) return;
    try {
      const message = `Currently in ${weatherData.name}: ${Math.round(weatherData.main.temp)}°${unit === 'metric' ? 'C' : 'F'}, ${weatherData.weather[0].description}. ${translations[language].streak}: ${streak} via Atmosync!`;
      await Share.share({ message });
    } catch (error) {
      console.log(error.message);
    }
  };

  const openRadar = () => {
    if (weatherData) {
      Linking.openURL(`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=radar&lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&zoom=10`);
    }
  };

  const weatherCondition = weatherData?.weather[0]?.main;
  const bgImage = weatherData ? getBackgroundImage(weatherCondition) : require('./assets/aesthetic_bg.png');
  const isFavorite = weatherData ? favorites.includes(weatherData.name) : false;

  return (
    <View style={styles.container}>
      {theme === 'dynamic' ? (
        <ImageBackground source={bgImage} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#121212' }]} />
      )}
      <WeatherParticles condition={weatherCondition} />
      <ThunderAnimation condition={weatherCondition} />
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView style={styles.overlay}>
        {!weatherData && (
          <View style={{ position: 'absolute', top: Platform.OS === 'android' ? 50 : 45, right: 25, zIndex: 100 }}>
            <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.hamburgerIcon}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
        >
          {!weatherData && (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{translations[language].weather}</Text>
              <Text style={styles.subtitle}>{translations[language].forecast}</Text>
            </View>
          )}

          {!weatherData ? (
            <View style={styles.controlsContainer}>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={translations[language].searchPlaceholder}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => {
                  if(searchQuery.trim()) fetchWeather(`q=${searchQuery}`);
                }}>
                  <Icon name="search" size={20} color="#fff" style={styles.searchIcon} />
                </TouchableOpacity>
              </View>

              {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {suggestions.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.suggestionItem}
                      onPress={() => {
                        setSearchQuery(item.name);
                        fetchWeather(`lat=${item.lat}&lon=${item.lon}`);
                      }}
                    >
                      <Text style={styles.suggestionText}>
                        {item.name}{item.state ? `, ${item.state}` : ''}, {item.country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {favorites.length > 0 && (
                <View style={styles.favoritesContainer}>
                  <Text style={styles.favoritesTitle}>{translations[language].savedCities}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {favorites.map((city, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.favoriteChip}
                        onPress={() => fetchWeather(`q=${city}`)}
                        onLongPress={() => {
                          Alert.alert(
                            "Unsave City",
                            `Are you sure you want to remove ${city} from your saved cities?`,
                            [
                              { text: "Cancel", style: "cancel" },
                              { text: "Unsave", onPress: () => removeFavorite(city), style: 'destructive' }
                            ]
                          );
                        }}
                      >
                        <Text style={styles.favoriteChipText}>⭐ {city}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>{translations[language].or}</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={[styles.secondaryButton, { flexDirection: 'row', justifyContent: 'center' }]} onPress={fetchWeatherByLocation} activeOpacity={0.8}>
                <Icon name="navigate-outline" size={16} color="#ffffff" style={{marginRight: 5}} />
                <Text style={styles.secondaryButtonText}>{translations[language].myLocation}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity activeOpacity={1} onPress={() => setBottomCardVisible(!bottomCardVisible)} style={{flex: 1}}>
              <Animated.View style={[
                styles.aestheticWeatherContainer,
                { 
                  opacity: fadeAnim, 
                  transform: [{ translateY: slideAnim }] 
                }
              ]}>
                <View style={styles.aestheticHeader}>
                <View style={styles.aestheticLocationRow}>
                  <TouchableOpacity onPress={() => setWeatherData(null)} style={{ padding: 5, marginRight: 5, marginLeft: -15 }}>
                    <Icon name="chevron-back" size={28} color="#ffffff" />
                  </TouchableOpacity>
                  <Icon name="location-sharp" size={16} color="#ffffff" style={{marginTop: 2}} />
                  <Text style={styles.aestheticCity}>{weatherData.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.hamburgerIcon}>
                  <View style={styles.hamburgerLine} />
                  <View style={styles.hamburgerLine} />
                </TouchableOpacity>
              </View>
                <Text style={styles.aestheticTime}>
                  {(() => {
                    const utcOffset = weatherData.timezone;
                    const now = new Date();
                    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
                    const cityTime = new Date(utcMs + (utcOffset * 1000));
                    const hours = cityTime.getHours();
                    const mins = cityTime.getMinutes().toString().padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const h12 = hours % 12 || 12;
                    const day = cityTime.toLocaleDateString('en-US', { weekday: 'long' });
                    const month = cityTime.toLocaleDateString('en-US', { month: 'short' });
                    const date = cityTime.getDate();
                    return `${day}, ${month} ${date}  •  ${h12}:${mins} ${ampm}`;
                  })()}
                </Text>

              <View style={styles.aestheticTempArea}>
                <View style={{flexDirection: 'row', position: 'relative'}}>
                  <MaskedView
                    style={{ height: 180, flexDirection: 'row' }}
                    maskElement={
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.aestheticTemp}>{Math.round(weatherData.main.temp)}</Text>
                        <View style={styles.aestheticDegreeCircle} />
                      </View>
                    }
                  >
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.1)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    {/* Invisible elements just to size the MaskedView correctly */}
                    <View style={{flexDirection: 'row', opacity: 0}}>
                      <Text style={styles.aestheticTemp}>{Math.round(weatherData.main.temp)}</Text>
                      <View style={styles.aestheticDegreeCircle} />
                    </View>
                  </MaskedView>
                  <TouchableOpacity onPress={toggleFavorite} activeOpacity={0.7} style={{marginLeft: -25, marginTop: 120, width: 22, height: 22}}>
                    <Image 
                      source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/bookmark-ribbon.png' }} 
                      style={[{ width: 22, height: 22, opacity: isFavorite ? 1 : 0, position: 'absolute' }]} 
                      resizeMode="contain"
                    />
                    <Image 
                      source={{ uri: 'https://img.icons8.com/ios/100/ffffff/bookmark-ribbon--v1.png' }} 
                      style={[{ width: 22, height: 22, opacity: isFavorite ? 0 : 1, position: 'absolute' }]} 
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.aestheticConditionWrapper}>
                  <Text style={styles.aestheticCondition}>It's {weatherData.weather[0].main}</Text>
                </View>
              </View>


              {/* Removed white bottom card and moved contents directly to background */}
              <View style={styles.aestheticExtraContentWrapper}>
                {/* Details Grid */}
                <View style={styles.detailsGridWrapper}>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><Icon name="water-outline" size={20} color="#64b5f6" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
                        <Text style={styles.detailLabel}>{translations[language].humidity}</Text>
                      </View>
                    </View>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><Icon name="leaf-outline" size={20} color="#81c784" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{weatherData.wind.speed} m/s</Text>
                        <Text style={styles.detailLabel}>{translations[language].wind}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><Icon name="sunny-outline" size={20} color="#ffd54f" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{formatTime(weatherData.sys.sunrise)}</Text>
                        <Text style={styles.detailLabel}>{translations[language].sunrise}</Text>
                      </View>
                    </View>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><Icon name="moon-outline" size={20} color="#ffd54f" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{formatTime(weatherData.sys.sunset)}</Text>
                        <Text style={styles.detailLabel}>{translations[language].sunset}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><Icon name="thermometer-outline" size={20} color="#e57373" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{Math.round(weatherData.main.feels_like)}°</Text>
                        <Text style={styles.detailLabel}>{translations[language].feelsLike}</Text>
                      </View>
                    </View>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><Icon name="eye-outline" size={20} color="#64b5f6" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{(weatherData.visibility / 1000).toFixed(1)} km</Text>
                        <Text style={styles.detailLabel}>{translations[language].visibility}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><MaterialCommunityIcons name="air-filter" size={20} color="#81c784" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{aqi ? translations[language].aqi[aqi - 1] : '...'}</Text>
                        <Text style={styles.detailLabel}>{translations[language].airQuality}</Text>
                      </View>
                    </View>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><MaterialCommunityIcons name="moon-waning-crescent" size={20} color="#7986cb" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue} numberOfLines={1} adjustsFontSizeToFit>...</Text>
                        <Text style={styles.detailLabel}>{translations[language].moonPhase}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><MaterialCommunityIcons name="fire" size={20} color="#ffb74d" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue}>{streak} Days</Text>
                        <Text style={styles.detailLabel}>{translations[language].streak}</Text>
                      </View>
                    </View>
                    <View style={styles.detailBox}>
                      <View style={styles.detailIconWrapper}><MaterialCommunityIcons name="tshirt-crew-outline" size={20} color="#ba68c8" /></View>
                      <View style={styles.detailInfo}>
                        <Text style={styles.detailValue} numberOfLines={1} adjustsFontSizeToFit>Casual</Text>
                        <Text style={styles.detailLabel}>{translations[language].ootdTitle}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Weather Today Moved to 2nd to Last */}
                <Text style={styles.aestheticSectionTitle}>Weather Today</Text>
                
                {forecastData && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyScroll}>
                    {forecastData.slice(0, 5).map((item, index) => {
                      let iconName = 'sunny';
                      const condition = item.weather[0].main;
                      if (condition === 'Clouds') iconName = 'partly-sunny';
                      else if (condition === 'Rain' || condition === 'Drizzle') iconName = 'rainy';
                      else if (condition === 'Thunderstorm') iconName = 'thunderstorm';
                      else if (condition === 'Snow') iconName = 'snow';

                      return (
                        <View key={index} style={styles.hourlyItem}>
                          <Icon name={iconName} size={32} color={iconName === 'sunny' ? '#FDB813' : 'rgba(255,255,255,0.8)'} />
                          <Text style={styles.hourlyTime}>{formatForecastTime(item.dt_txt)}</Text>
                          <View style={{marginTop: 4, position: 'relative', alignItems: 'center'}}>
                            <Text style={styles.hourlyTemp}>{Math.round(item.main.temp)}</Text>
                            <Text style={{fontSize: 10, color: '#ffffff', position: 'absolute', right: -10, top: 0}}>°</Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}

                {/* Aesthetic Weekly Trend Moved to Bottom */}
                {dailyForecast && dailyForecast.length > 0 && (
                  <View style={styles.aestheticWeeklyTrendWrapper}>
                    <Text style={styles.aestheticSectionTitle}>7-Day Forecast</Text>
                    {dailyForecast.map((item, index) => {
                      let iconName = 'sunny-outline';
                      const condition = item.weather.main;
                      if (condition === 'Clouds') iconName = 'partly-sunny-outline';
                      else if (condition === 'Rain' || condition === 'Drizzle') iconName = 'rainy-outline';
                      else if (condition === 'Thunderstorm') iconName = 'thunderstorm-outline';
                      else if (condition === 'Snow') iconName = 'snow-outline';

                      return (
                        <View key={index} style={styles.aestheticDailyRow}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Text style={styles.aestheticDailyDay}>{getDayName(item.date, index)}</Text>
                            <Icon name={iconName} size={24} color="#ffffff" style={{ width: 30, textAlign: 'center', marginLeft: 10 }} />
                            <Text style={styles.aestheticDailyConditionText}>{condition}</Text>
                          </View>

                          <View style={styles.aestheticDailyTempRange}>
                            <Text style={styles.aestheticDailyTempMax}>{Math.round(item.max)}°</Text>
                            <Text style={styles.aestheticDailyTempMin}>{Math.round(item.min)}°</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
              </Animated.View>
            </TouchableOpacity>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>{translations[language].fetchingWeather}</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setSettingsVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1} 
            onPress={() => {}} 
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{translations[language].settings}</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            {/* Temperature Unit */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{unit === 'metric' ? '°C' : '°F'} Temperature</Text>
              <View style={{flexDirection: 'row', backgroundColor: '#1a1a2e', borderRadius: 10, overflow: 'hidden'}}>
                <TouchableOpacity
                  style={{paddingVertical: 8, paddingHorizontal: 18, backgroundColor: unit === 'metric' ? '#6b21a8' : 'transparent', borderRadius: 10}}
                  onPress={() => { if (unit !== 'metric') { setUnit('metric'); AsyncStorage.setItem('@unit', 'metric'); Vibration.vibrate(40); } }}
                >
                  <Text style={{color: '#fff', fontWeight: unit === 'metric' ? 'bold' : 'normal', fontSize: 14}}>°C</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{paddingVertical: 8, paddingHorizontal: 18, backgroundColor: unit === 'imperial' ? '#6b21a8' : 'transparent', borderRadius: 10}}
                  onPress={() => { if (unit !== 'imperial') { setUnit('imperial'); AsyncStorage.setItem('@unit', 'imperial'); Vibration.vibrate(40); } }}
                >
                  <Text style={{color: '#fff', fontWeight: unit === 'imperial' ? 'bold' : 'normal', fontSize: 14}}>°F</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Share Weather */}
            <View style={styles.settingRow}>
              <TouchableOpacity style={styles.engagementBtn} onPress={() => {
                if (weatherData) {
                  const temp = Math.round(weatherData.main.temp);
                  const condition = weatherData.weather[0].main;
                  Share.share({ message: `🌤 ${weatherData.name}: ${temp}°${unit === 'metric' ? 'C' : 'F'}, ${condition}. Checked via Atmosync!` });
                }
              }}>
                <Icon name="share-social-outline" size={20} color="#6b21a8" style={{marginRight: 10}} />
                <Text style={styles.engagementBtnText}>{translations[language].shareWeather}</Text>
              </TouchableOpacity>
            </View>

            {/* Live Radar */}
            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <TouchableOpacity style={styles.engagementBtn} onPress={() => {
                Linking.openURL('https://www.windy.com');
              }}>
                <Icon name="radio-outline" size={20} color="#6b21a8" style={{marginRight: 10}} />
                <Text style={styles.engagementBtnText}>{translations[language].viewRadar}</Text>
              </TouchableOpacity>
            </View>

            {/* App Info */}
            <View style={{alignItems: 'center', paddingVertical: 15, opacity: 0.4}}>
              <Text style={{color: '#fff', fontSize: 11}}>Atmosync v2.0</Text>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 2}}>Made with ❤️</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>


      {/* AQI Explorer Modal */}
      <Modal animationType="slide" transparent={true} visible={aqiExplorerVisible} onRequestClose={() => setAqiExplorerVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setAqiExplorerVisible(false)}>
          <TouchableOpacity style={[styles.modalContent, {maxHeight: '80%'}]} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {explorerPath.length > 0 && !deepDiveData && (
                  <TouchableOpacity onPress={() => setExplorerPath(explorerPath.slice(0, -1))} style={{marginRight: 15}}>
                    <Text style={{color: '#fff', fontSize: 18}}>←</Text>
                  </TouchableOpacity>
                )}
                {deepDiveData && (
                  <TouchableOpacity onPress={() => setDeepDiveData(null)} style={{marginRight: 15}}>
                    <Text style={{color: '#fff', fontSize: 18}}>←</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.modalTitle}>
                  {deepDiveData ? `${deepDiveData.cityName} AQI` : (explorerPath.length === 0 ? "Global AQI Explorer 🌍" : explorerPath[explorerPath.length - 1])}
                </Text>
              </View>
              <TouchableOpacity onPress={() => {setAqiExplorerVisible(false); setDeepDiveData(null);}}><Text style={styles.modalCloseText}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 500}}>
              {fetchingDeepDive ? (
                <View style={{padding: 40, alignItems: 'center'}}>
                  <ActivityIndicator size="large" color="#6b21a8" />
                  <Text style={{color: '#fff', marginTop: 10}}>Analyzing Air Quality...</Text>
                </View>
              ) : deepDiveData ? (
                <View style={styles.deepDiveContainer}>
                  <View style={[styles.deepDiveBadge, {backgroundColor: getAqiColor(deepDiveData.main.aqi)}]}>
                    <Text style={[styles.deepDiveAqiText, {color: deepDiveData.main.aqi > 3 ? '#fff' : '#000'}]}>AQI Index: {deepDiveData.main.aqi} - {getAqiText(deepDiveData.main.aqi)}</Text>
                  </View>
                  <Text style={styles.deepDiveSectionTitle}>Pollutant Breakdown (μg/m³)</Text>
                  {Object.keys(deepDiveData.components).map((key, i) => (
                    <View key={i} style={styles.pollutantRow}>
                      <Text style={styles.pollutantName}>{key.toUpperCase()}</Text>
                      <View style={styles.pollutantBarBg}>
                        <View style={[styles.pollutantBarFill, {width: `${Math.min((deepDiveData.components[key] / 200) * 100, 100)}%`, backgroundColor: deepDiveData.components[key] > 100 ? '#6b21a8' : '#6b21a8'}]} />
                      </View>
                      <Text style={styles.pollutantValue}>{deepDiveData.components[key].toFixed(1)}</Text>
                    </View>
                  ))}
                  <Text style={styles.deepDiveAdvice}>
                    {deepDiveData.main.aqi > 3 ? "Warning: Air quality is poor. Wear a mask outdoors." : "Air quality is good. Safe for outdoor activities."}
                  </Text>
                </View>
              ) : (
                <View style={styles.explorerList}>
                  {(() => {
                    let currentData = globalAqiLocations;
                    for (let step of explorerPath) {
                      currentData = currentData[step];
                    }
                    return Object.keys(currentData).map((key, i) => {
                      const isCity = currentData[key].lat !== undefined;
                      return (
                        <TouchableOpacity 
                          key={i} 
                          style={styles.explorerItem}
                          onPress={() => {
                            if (isCity) {
                              fetchDeepDiveAqi(key, currentData[key].lat, currentData[key].lon);
                            } else {
                              setExplorerPath([...explorerPath, key]);
                            }
                          }}
                        >
                          <Text style={styles.explorerItemText}>{key}</Text>
                          <Text style={styles.explorerItemIcon}>{isCity ? '🔍' : '›'}</Text>
                        </TouchableOpacity>
                      );
                    });
                  })()}
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 100 : 60,
    paddingBottom: 40,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 46,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: '300',
    color: '#e0e0e0',
    letterSpacing: 4,
  },
  controlsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
    overflow: 'hidden',
    height: 55,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    fontSize: 18,
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderRadius: 12,
    marginTop: -10,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 16,
  },
  favoritesContainer: {
    marginBottom: 20,
  },
  favoritesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  favoriteChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 15,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  weatherDetailsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
  },
  absoluteBackButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 25 : 45,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  absoluteUnitButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 45,
    right: 55,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    minWidth: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  absoluteSettingsButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 45,
    right: 95,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 16,
  },
  absoluteFavButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 45,
    right: 15,
    zIndex: 10,
    padding: 4,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteFavIcon: {
    width: 22,
    height: 22,
    tintColor: '#ffffff',
  },
  resultBox: {
    backgroundColor: 'rgba(10, 15, 25, 0.65)',
    borderRadius: 36,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    marginTop: 0,
    width: '95%',
  },
  resultCity: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resultCondition: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 0,
    marginBottom: 0,
  },
  tempContainer: {
    marginVertical: 0,
  },
  resultTemp: {
    fontSize: 90,
    fontWeight: '100',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    includeFontPadding: false,
    lineHeight: 95,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 0,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  sunGrid: {
    width: '95%',
    marginTop: 15,
    paddingVertical: 20,
    backgroundColor: 'rgba(10, 15, 25, 0.65)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  forecastContainer: {
    marginTop: 15,
    marginBottom: 20,
    width: '95%',
    backgroundColor: 'rgba(10, 15, 25, 0.65)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  forecastTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 15,
    letterSpacing: 1,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  forecastTime: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  forecastTemp: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  dailyForecastContainer: {
    marginBottom: 20,
    width: '95%',
    backgroundColor: 'rgba(10, 15, 25, 0.65)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dailyForecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dailyForecastDay: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '600',
    width: 60,
  },
  dailyForecastIconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dailyForecastTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  dailyForecastMax: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  dailyForecastMin: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  insightsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  insightsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  insightsText: {
    flex: 1,
    color: '#e0e0e0',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  sunRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  arcContainer: {
    width: '80%',
    height: 30,
    marginTop: 20,
    position: 'relative',
    alignSelf: 'center',
  },
  arcLine: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  sunDot: {
    position: 'absolute',
    top: 3,
    marginLeft: -10,
  },
  moonContainer: {
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 15,
    width: '80%',
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 160,
    minHeight: 250,
    marginBottom: -100,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 24,
    padding: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
  },
  langButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '60%',
  },
  langBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginLeft: 8,
    marginBottom: 8,
  },
  langBtnActive: {
    backgroundColor: '#81b0ff',
    borderColor: '#81b0ff',
  },
  langBtnText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  langBtnTextActive: {
    color: '#121212',
  },
  extraMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  aqiContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  aqiBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  aqiFill: {
    height: '100%',
    borderRadius: 4,
  },
  thermometerContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  thermoBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  thermoFill: {
    height: '100%',
    borderRadius: 4,
  },
  triviaContainer: {
    marginBottom: 20,
    width: '95%',
    backgroundColor: 'rgba(10, 15, 25, 0.85)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  triviaTitle: {
    color: '#6b21a8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  triviaText: {
    color: '#e0e0e0',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  ootdContainer: {
    backgroundColor: 'rgba(10, 15, 25, 0.85)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ootdTitle: {
    color: '#6b21a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  ootdText: {
    color: '#e0e0e0',
    fontSize: 15,
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '95%',
    alignSelf: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 25, 0.85)',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  triviaQuestion: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  triviaOptionsContainer: {
    width: '100%',
  },
  triviaOptionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  triviaOptionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  moodContainer: {
    marginBottom: 20,
    width: '95%',
    backgroundColor: 'rgba(10, 15, 25, 0.85)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    alignSelf: 'center',
  },
  moodTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  moodButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodBtn: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    width: '22%',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodBtnText: {
    color: '#e0e0e0',
    fontSize: 12,
  },
  engagementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  engagementBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  badgeItem: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeName: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  moodHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    paddingHorizontal: 10,
  },
  moodHistoryDate: {
    color: '#fff',
    fontWeight: '500',
  },
  moodHistoryMood: {
    color: '#e0e0e0',
  },
  pulseContainer: {
    marginBottom: 20,
    width: '95%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    alignSelf: 'center',
  },
  pulseTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pulseText: {
    color: '#e0e0e0',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  explorerList: {
    paddingVertical: 10,
  },
  explorerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  explorerItemText: {
    color: '#fff',
    fontSize: 16,
  },
  explorerItemIcon: {
    color: '#888',
    fontSize: 16,
  },
  deepDiveContainer: {
    paddingVertical: 10,
  },
  deepDiveBadge: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  deepDiveAqiText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deepDiveSectionTitle: {
    color: '#93c5fd',
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  pollutantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollutantName: {
    color: '#fff',
    width: 60,
    fontSize: 12,
  },
  pollutantBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  pollutantBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  pollutantValue: {
    color: '#fff',
    width: 40,
    textAlign: 'right',
    fontSize: 12,
  },
  deepDiveAdvice: {
    color: '#6b21a8',
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  aestheticWeatherContainer: {
    width: '100%',
    flex: 1,
  },
  aestheticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginHorizontal: -5,
    marginTop: -30,
  },
  aestheticLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aestheticCity: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '300',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
    letterSpacing: 0.5,
  },
  aestheticTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: '400',
    marginLeft: 2,
    marginTop: 4,
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  aestheticExtraContentWrapper: {
    paddingHorizontal: 0,
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    borderRadius: 20,
    borderWidth: 0.002,
    borderColor: '#93c5fd',
  },
  aestheticSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 1,
  },
  hamburgerIcon: {
    padding: 10,
    alignItems: 'flex-end',
  },
  hamburgerLine: {
    width: 30,
    height: 3,
    backgroundColor: '#ffffff',
    marginBottom: 6,
    borderRadius: 3,
  },
  aestheticTempArea: {
    marginTop: 20,
    paddingHorizontal: 0,
    marginLeft: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  aestheticTemp: {
    fontSize: 160,
    fontWeight: '400',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    includeFontPadding: false,
    lineHeight: 180,
    opacity: 0.7,
    letterSpacing: -4,
  },
  aestheticDegreeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#ffffff',
    marginTop: 10,
    marginLeft: 2,
    opacity: 0.9,
  },
  aestheticConditionWrapper: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 60,
  },
  aestheticCondition: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '300',
    transform: [{ rotate: '-90deg' }],
    width: 200,
    textAlign: 'center',
    opacity: 0.9,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
    letterSpacing: 2,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: 350,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  hourlyScroll: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  hourlyItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 15,
    width: 95,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hourlyTime: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    marginBottom: 4,
  },
  hourlyTemp: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  detailsGridWrapper: {
    marginTop: 30,
    paddingBottom: 30,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailBox: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },

  aestheticWeeklyTrendWrapper: {
    marginTop: 30,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aestheticDailyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  aestheticDailyDay: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    width: 70,
  },
  aestheticDailyConditionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  aestheticDailyConditionText: {
    color: '#ffffff',
    fontSize: 15,
    marginLeft: 30,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  aestheticDailyTempRange: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 120,
  },
  aestheticDailyTempMax: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 40,
  },
  aestheticDailyTempMin: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
