import React, { useState } from 'react';
import {View, StyleSheet, Image,Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import SelectLanguageBox from '../../components/molecules/SelectLanguageBox';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import { useSelector, useDispatch } from 'react-redux'
import { BaseUrl } from '../../utils/BaseUrl';


const SelectLanguage = () => {
    const [language, setLanguage] = useState()
    const primaryThemeColor = useSelector((state)=>state.apptheme.primaryThemeColor) ? useSelector((state)=>state.apptheme.primaryThemeColor) : "#FF9B00"
    const secondaryThemeColor = useSelector((state)=>state.apptheme.secondaryThemeColor) ? useSelector((state)=>state.apptheme.secondaryThemeColor) : "#FFB533"
    const icon = useSelector((state)=>state.apptheme.icon) ? useSelector((state)=>state.apptheme.icon) : require('../../../assets/images/demoIcon.png')
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    console.log(useSelector((state)=>state.apptheme.primaryThemeColor))
    const setSelectedLanguage=(language)=>{
        setLanguage(language)
        console.log(language)    
    }
    // http://103.153.58.83:5000/api/images/images-1691486775689-218266578.png

    return (
        
        <LinearGradient colors={[ternaryThemeColor,secondaryThemeColor]} style={{height:'100%',width:'100%'}}>
            <View style={{height:'20%',width:'100%',alignItems:'center',justifyContent:"center"}}>
                <Image style={{height:110,width:140,resizeMode:'contain'}} source={{uri:`${BaseUrl}/api/images/${icon}`}}></Image>
            </View>
            <View style={{height:'30%',width:'100%',alignItems:'center',justifyContent:"center"}}>
                <PoppinsText style={{color:'white',fontSize:24}} content="Choose" />
                <PoppinsText style={{color:'white',fontSize:28,marginTop:8}} content="Your Language"/>
            </View>
            <View style={{height:"50%",width:'100%',alignItems:"center",justifyContent:"center"}}>
            <SelectLanguageBox selectedLanguage={language}   setSelectedLanguage={setSelectedLanguage} languageHindi = 'हिन्दी' languageEnglish = 'Hindi' image = {require('../../../assets/images/languageHindi.png')}></SelectLanguageBox>
            <SelectLanguageBox selectedLanguage={language} setSelectedLanguage={setSelectedLanguage} languageHindi = 'English' languageEnglish = 'English' image = {require('../../../assets/images/languageEnglish.png')}></SelectLanguageBox>
            {language && <ButtonNavigate backgroundColor= {ternaryThemeColor} style={{color:'white',fontSize:16}} content="Continue" navigateTo="SelectUser"></ButtonNavigate>}
            </View>
        </LinearGradient>
        
    );
}



export default SelectLanguage;
