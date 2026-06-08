import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { triviaQuestions } from '../utils/constants';
import { Alert, Vibration } from 'react-native';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [aqi, setAqi] = useState(null);
  
  // Settings
  const [unit, setUnit] = useState('metric');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dynamic');
  const [favorites, setFavorites] = useState([]);

  // Gamification & Engagement
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodToday, setMoodToday] = useState(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [currentTrivia, setCurrentTrivia] = useState(null);
  const [triviaAnsweredToday, setTriviaAnsweredToday] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('@language');
      const savedTheme = await AsyncStorage.getItem('@theme');
      const savedUnit = await AsyncStorage.getItem('@unit');
      const savedFavs = await AsyncStorage.getItem('@favorites');
      
      if (savedLang) setLanguage(savedLang);
      if (savedTheme) setTheme(savedTheme);
      if (savedUnit) setUnit(savedUnit);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedWeather = await AsyncStorage.getItem('@weatherData');
      const savedForecast = await AsyncStorage.getItem('@forecastData');
      if (savedWeather) setWeatherData(JSON.parse(savedWeather));
      if (savedForecast) {
        const pForecast = JSON.parse(savedForecast);
        setForecastData(pForecast.list.slice(0, 8));
        processDailyForecast(pForecast.list);
      }

      const today = new Date().toDateString();
      const lastOpen = await AsyncStorage.getItem('@last_open_date');
      let currentStreak = parseInt(await AsyncStorage.getItem('@streak') || '0', 10);
      
      if (lastOpen !== today) {
        if (lastOpen === new Date(Date.now() - 86400000).toDateString()) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        setStreak(currentStreak);
        await AsyncStorage.setItem('@streak', currentStreak.toString());
        await AsyncStorage.setItem('@last_open_date', today);
      } else {
        setStreak(currentStreak);
      }

      const savedBadges = await AsyncStorage.getItem('@badges');
      if (savedBadges) setBadges(JSON.parse(savedBadges));

      const savedScore = await AsyncStorage.getItem('@trivia_score');
      if (savedScore) setTriviaScore(parseInt(savedScore, 10));

      const lastTrivia = await AsyncStorage.getItem('@last_trivia_date');
      if (lastTrivia === today) {
        setTriviaAnsweredToday(true);
      } else {
        setTriviaAnsweredToday(false);
        pickDailyTrivia();
      }

      const savedMoodHistory = await AsyncStorage.getItem('@mood_history');
      if (savedMoodHistory) {
        const history = JSON.parse(savedMoodHistory);
        setMoodHistory(history);
        const tMood = history.find(m => m.date === today);
        if (tMood) setMoodToday(tMood.mood);
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

  const saveMood = async (mood) => {
    setMoodToday(mood);
    Vibration.vibrate(40);
    const newEntry = { date: new Date().toDateString(), mood, weather: weatherData?.weather[0].main || 'Unknown' };
    const updatedHistory = [newEntry, ...moodHistory];
    setMoodHistory(updatedHistory);
    await AsyncStorage.setItem('@mood_history', JSON.stringify(updatedHistory));
  };

  const checkBadges = async (data) => {
    if (!data) return;
    const temp = data.main.temp;
    const condition = data.weather[0].main;
    let newBadges = [...badges];
    let unlocked = false;

    if (temp > 35 && !newBadges.includes('desert_survivor')) {
      newBadges.push('desert_survivor');
      unlocked = true;
    }
    if (condition === 'Rain' && !newBadges.includes('rain_dancer')) {
      newBadges.push('rain_dancer');
      unlocked = true;
    }
    if (condition === 'Snow' && !newBadges.includes('ice_breaker')) {
      newBadges.push('ice_breaker');
      unlocked = true;
    }
    if (streak >= 7 && !newBadges.includes('weather_nerd')) {
      newBadges.push('weather_nerd');
      unlocked = true;
    }

    if (unlocked) {
      setBadges(newBadges);
      await AsyncStorage.setItem('@badges', JSON.stringify(newBadges));
    }
  };

  const processDailyForecast = (list) => {
    const dailyMap = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { temp: [], weather: item.weather[0] };
      }
      dailyMap[date].temp.push(item.main.temp);
    });

    const dailyArr = Object.keys(dailyMap).map(date => {
      const temps = dailyMap[date].temp;
      return {
        date,
        max: Math.max(...temps),
        min: Math.min(...temps),
        weather: dailyMap[date].weather
      };
    }).slice(0, 5);

    setDailyForecast(dailyArr);
  };

  const changeLanguage = async (lang) => {
    Vibration.vibrate(40);
    setLanguage(lang);
    await AsyncStorage.setItem('@language', lang);
  };

  const toggleTheme = async () => {
    Vibration.vibrate(40);
    const newTheme = theme === 'dynamic' ? 'solid' : 'dynamic';
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };

  const toggleUnit = async () => {
    Vibration.vibrate(40);
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    await AsyncStorage.setItem('@unit', newUnit);
  };

  const toggleFavorite = async () => {
    if (!weatherData) return;
    Vibration.vibrate(40);
    const city = weatherData.name;
    let newFavs = [...favorites];
    if (newFavs.includes(city)) {
      newFavs = newFavs.filter(c => c !== city);
    } else {
      newFavs.push(city);
    }
    setFavorites(newFavs);
    await AsyncStorage.setItem('@favorites', JSON.stringify(newFavs));
  };

  return (
    <WeatherContext.Provider value={{
      weatherData, setWeatherData,
      forecastData, setForecastData,
      dailyForecast, setDailyForecast,
      aqi, setAqi,
      unit, setUnit,
      language, setLanguage,
      theme, setTheme,
      favorites, setFavorites,
      streak, setStreak,
      badges, setBadges,
      moodHistory, setMoodHistory,
      moodToday, setMoodToday,
      triviaScore, setTriviaScore,
      currentTrivia, setCurrentTrivia,
      triviaAnsweredToday, setTriviaAnsweredToday,
      handleTriviaAnswer, saveMood, checkBadges, processDailyForecast,
      changeLanguage, toggleTheme, toggleUnit, toggleFavorite
    }}>
      {children}
    </WeatherContext.Provider>
  );
};
