import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import SelectLanguageBox from '../../components/molecules/SelectLanguageBox';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useSelector } from 'react-redux';
import { BaseUrlImages } from '../../utils/BaseUrlImages';


// import i18n from './i18n';

const SelectLanguage = ({ navigation }) => {
  const { t, i18n } = useTranslation(); // Initialize useTranslation

  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

    const icon = useSelector(state => state.apptheme.icon)
    ? useSelector(state => state.apptheme.icon)
    : require('../../../assets/images/demoIcon.png');

  const [language, setLanguage] = useState('');
  
  const setSelectedLanguage = (language) => {
    console.log("language", language);
    setLanguage(language);
    // Assuming 'english' and 'arabic' are the keys used in your translation files
    i18n.changeLanguage(language === 'english' ? 'en' : 'ar'); 
    navigation.navigate('SelectUser');
  };


  return (
    <LinearGradient colors={['#ddd', '#fff']} style={{ flex: 1 , backgroundColor:ternaryThemeColor}}>
      <View style={[styles.logoContainer,]}>
      <Image
            style={{
              height: 140,
              width: 300,
              resizeMode:'contain'
            }}
            
            source={{uri:BaseUrlImages+icon}}></Image>

      </View>
      <View style={styles.textContainer}>
        <PoppinsText style={styles.title} content={t('choose')} />
        <PoppinsText style={styles.subtitle} content={t('yourLanguage')} />
      </View>
      <View style={styles.languageContainer}>
        <SelectLanguageBox
          selectedLanguage={language}
          setSelectedLanguage={()=>setSelectedLanguage('hindi')}
          languageHindi={'hindi'}
          languageEnglish={t('Hindi')}
          image={require('../../../assets/images/languageHindi.png')}
        />
        <SelectLanguageBox
          selectedLanguage={language}
          setSelectedLanguage={()=>setSelectedLanguage('english')}
          languageHindi={t('english')}
          languageEnglish={t('english')}
          image={require('../../../assets/images/languageEnglish.png')}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
},
  logo: {
    height: 200,
    width: 240,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    color: 'black',
    fontSize: 24,
  },
  subtitle: {
    color: 'black',
    fontSize: 28,
    marginTop: 8,
  },
  languageContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default SelectLanguage;
