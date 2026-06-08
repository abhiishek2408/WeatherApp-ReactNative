import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Modal } from 'react-native';
import { WeatherContext } from '../context/WeatherContext';
import { styles } from '../utils/styles';
import { translations } from '../utils/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function SettingsScreen() {
  const { theme, toggleTheme, language, changeLanguage, badges, unit, toggleUnit } = useContext(WeatherContext);
  const navigation = useNavigation();
  const [langModalVisible, setLangModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, {paddingTop: 20}]}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{translations[language].minimalistTheme}</Text>
          <Switch
            value={theme === 'solid'}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#c084fc" }}
            thumbColor={theme === 'solid' ? "#6b21a8" : "#f4f3f4"}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{translations[language].tempUnit}</Text>
          <View style={{ flexDirection: 'row', backgroundColor: '#1e1e1e', borderRadius: 8, overflow: 'hidden' }}>
            <TouchableOpacity 
              style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: unit === 'metric' ? '#6b21a8' : 'transparent' }}
              onPress={() => { if(unit !== 'metric') toggleUnit(); }}
            >
              <Text style={{ color: '#fff', fontWeight: unit === 'metric' ? 'bold' : 'normal' }}>°C</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: unit === 'imperial' ? '#6b21a8' : 'transparent' }}
              onPress={() => { if(unit !== 'imperial') toggleUnit(); }}
            >
              <Text style={{ color: '#fff', fontWeight: unit === 'imperial' ? 'bold' : 'normal' }}>°F</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity 
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 50, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, flexDirection: 'row' }}
              onPress={() => setLangModalVisible(true)}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {language === 'en' ? 'English (EN)' : language === 'es' ? 'Español (ES)' : language === 'fr' ? 'Français (FR)' : language === 'hi' ? 'हिन्दी (HI)' : language === 'pa' ? 'ਪੰਜਾਬੀ (PA)' : translations[language].pickLanguage}
              </Text>
              <Icon name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>

            <Modal visible={langModalVisible} transparent={true} animationType="fade" onRequestClose={() => setLangModalVisible(false)}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setLangModalVisible(false)}>
                <View style={{ width: '80%', backgroundColor: '#1e1e1e', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#333' }}>
                  <Text style={{ color: '#888', marginBottom: 15, fontSize: 14, fontWeight: 'bold' }}>SELECT LANGUAGE</Text>
                  
                  {[
                    { label: 'English (EN)', value: 'en' },
                    { label: 'Español (ES)', value: 'es' },
                    { label: 'Français (FR)', value: 'fr' },
                    { label: 'हिन्दी (HI)', value: 'hi' },
                    { label: 'ਪੰਜਾਬੀ (PA)', value: 'pa' }
                  ].map((lang) => (
                    <TouchableOpacity 
                      key={lang.value}
                      style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333', flexDirection: 'row', justifyContent: 'space-between' }}
                      onPress={() => {
                        changeLanguage(lang.value);
                        setLangModalVisible(false);
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: language === lang.value ? 'bold' : 'normal' }}>{lang.label}</Text>
                      {language === lang.value && <Icon name="checkmark" size={20} color="#6b21a8" />}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
}
