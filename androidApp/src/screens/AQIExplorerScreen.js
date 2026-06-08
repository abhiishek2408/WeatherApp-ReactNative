import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { styles as globalStyles } from '../utils/styles';
import { globalAqiLocations, translations } from '../utils/constants';
import { WeatherContext } from '../context/WeatherContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AQIExplorerScreen() {
  const { language } = useContext(WeatherContext);
  const [explorerPath, setExplorerPath] = useState([]); 
  const [deepDiveData, setDeepDiveData] = useState(null); 
  const [fetchingDeepDive, setFetchingDeepDive] = useState(false);
  const [cityAqis, setCityAqis] = useState({});

  const getRepresentativeCoordinates = (node) => {
    if (node.lat !== undefined && node.lon !== undefined) {
      return { lat: node.lat, lon: node.lon };
    }
    const keys = Object.keys(node);
    if (keys.length > 0) {
      return getRepresentativeCoordinates(node[keys[0]]);
    }
    return null;
  };

  React.useEffect(() => {
    let currentData = globalAqiLocations;
    for (let step of explorerPath) {
      currentData = currentData[step];
    }
    
    // Fetch representative AQI for all items currently visible in the list
    Object.keys(currentData).forEach(key => {
      const coords = getRepresentativeCoordinates(currentData[key]);
      if (coords) {
        const apiKey = '9b01d0c4095bf19142e51ddf0896e386';
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`)
          .then(res => res.json())
          .then(data => {
            if (data.list && data.list.length > 0) {
              setCityAqis(prev => ({...prev, [key]: data.list[0].main.aqi}));
            }
          })
          .catch(e => console.log('Failed to fetch AQI for', key));
      }
    });
  }, [explorerPath]);

  const fetchDeepDiveAqi = async (cityName, lat, lon) => {
    setFetchingDeepDive(true);
    setDeepDiveData(null);
    try {
      const apiKey = '9b01d0c4095bf19142e51ddf0896e386';
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const res = await fetch(aqiUrl);
      const data = await res.json();
      if (data.list && data.list.length > 0) {
        setDeepDiveData({ cityName, ...data.list[0] });
      } else {
        Alert.alert('Error', data.message || 'No AQI data found for this location.');
      }
    } catch (e) {
      Alert.alert('Network Error', 'Failed to fetch detailed AQI. Please check your connection.');
    } finally {
      setFetchingDeepDive(false);
    }
  };

  const getPollutantDanger = (key, value) => {
    const limits = {
      co: 15000,
      no: 100,
      no2: 200,
      o3: 180,
      so2: 300,
      pm2_5: 50,
      pm10: 100,
      nh3: 100
    };
    
    const maxVal = limits[key.toLowerCase()] || 100;
    const percentage = Math.min((value / maxVal) * 100, 100);
    
    let color = '#10b981'; // Green
    if (percentage >= 80) color = '#8b5cf6'; // Purple
    else if (percentage >= 60) color = '#ef4444'; // Red
    else if (percentage >= 40) color = '#f97316'; // Orange
    else if (percentage >= 20) color = '#eab308'; // Yellow
    
    return { percentage, color };
  };

  const getAqiDetails = (aqiValue) => {
    const aqiTexts = translations[language].aqi;
    switch (aqiValue) {
      case 1: return { color: '#10b981', text: aqiTexts[0], icon: 'leaf' };
      case 2: return { color: '#eab308', text: aqiTexts[1], icon: 'happy' };
      case 3: return { color: '#f97316', text: aqiTexts[2], icon: 'warning' };
      case 4: return { color: '#ef4444', text: aqiTexts[3], icon: 'sad' };
      case 5: return { color: '#8b5cf6', text: aqiTexts[4], icon: 'skull' };
      default: return { color: '#6b7280', text: aqiTexts[5] || 'Unknown', icon: 'help-circle' };
    }
  };

  return (
    <View style={localStyles.container}>
      <ScrollView style={{paddingHorizontal: 20, paddingTop: 20}}>
        <Text style={localStyles.mainTitle}>{translations[language].globalAqi}</Text>
        <View style={localStyles.header}>
          {(explorerPath.length > 0 || deepDiveData) && (
            <TouchableOpacity 
              onPress={() => deepDiveData ? setDeepDiveData(null) : setExplorerPath(explorerPath.slice(0, -1))} 
              style={localStyles.backButton}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={localStyles.headerTitle}>
            {deepDiveData 
              ? `${deepDiveData.cityName} AQI` 
              : (explorerPath.length === 0 ? translations[language].exploreRegions : explorerPath[explorerPath.length - 1])}
          </Text>
        </View>
        {fetchingDeepDive ? (
          <View style={localStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#026ec1" />
            <Text style={localStyles.loadingText}>{translations[language].analyzingAqi}</Text>
          </View>
        ) : deepDiveData ? (
          <View style={localStyles.deepDiveContainer}>
            <View style={[localStyles.deepDiveBadge, {backgroundColor: getAqiDetails(deepDiveData.main.aqi).color}]}>
              <Icon name={getAqiDetails(deepDiveData.main.aqi).icon} size={32} color="#fff" style={{marginBottom: 5}} />
              <Text style={localStyles.deepDiveAqiText}>{translations[language].aqiIndex}: {deepDiveData.main.aqi}</Text>
              <Text style={localStyles.deepDiveAqiStatus}>{getAqiDetails(deepDiveData.main.aqi).text}</Text>
            </View>
            <Text style={localStyles.sectionTitle}>{translations[language].pollutantBreakdown}</Text>
            <View style={localStyles.pollutantsCard}>
              {Object.keys(deepDiveData.components).map((key, i) => {
                const danger = getPollutantDanger(key, deepDiveData.components[key]);
                return (
                  <View key={i} style={localStyles.pollutantRow}>
                    <Text style={localStyles.pollutantName}>{key.toUpperCase()}</Text>
                    <View style={localStyles.pollutantBarBg}>
                      <View style={[localStyles.pollutantBarFill, {
                        width: `${danger.percentage}%`, 
                        backgroundColor: danger.color
                      }]} />
                    </View>
                    <Text style={localStyles.pollutantValue}>{deepDiveData.components[key].toFixed(1)}</Text>
                  </View>
                );
              })}
            </View>
            <View style={localStyles.adviceCard}>
              <Icon name="information-circle" size={24} color="#6b21a8" style={{marginRight: 10}} />
              <Text style={localStyles.deepDiveAdvice}>
                {deepDiveData.main.aqi > 3 ? translations[language].advicePoor : translations[language].adviceGood}
              </Text>
            </View>
          </View>
        ) : (
          <View style={localStyles.explorerList}>
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
                    style={localStyles.card}
                    onPress={() => {
                      if (isCity) {
                        fetchDeepDiveAqi(key, currentData[key].lat, currentData[key].lon);
                      } else {
                        setExplorerPath([...explorerPath, key]);
                      }
                    }}
                  >
                    <View style={localStyles.cardIconContainer}>
                      <Icon name={isCity ? 'location' : 'partly-sunny'} size={24} color={isCity ? '#026ec1' : '#6b21a8'} />
                    </View>
                    <Text style={localStyles.cardText}>{key}</Text>
                    {cityAqis[key] && (
                      <View style={{backgroundColor: getAqiDetails(cityAqis[key]).color, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 10}}>
                        <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>AQI {cityAqis[key]}</Text>
                      </View>
                    )}
                    <Icon name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>
                );
              });
            })()}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginTop: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  explorerList: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardText: {
    flex: 1,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deepDiveContainer: {
    paddingBottom: 30,
  },
  deepDiveBadge: {
    alignItems: 'center',
    padding: 25,
    borderRadius: 24,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  deepDiveAqiText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  deepDiveAqiStatus: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 15,
  },
  pollutantsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  pollutantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollutantName: {
    width: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  pollutantBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  pollutantBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  pollutantValue: {
    width: 40,
    color: '#fff',
    textAlign: 'right',
  },
  adviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 33, 168, 0.1)',
    padding: 15,
    borderRadius: 12,
  },
  deepDiveAdvice: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
});
