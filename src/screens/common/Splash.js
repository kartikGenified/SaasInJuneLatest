import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import DotHorizontalList from '../../components/molecules/DotHorizontalList';
import { useGetAppThemeDataMutation } from '../../apiServices/appTheme/AppThemeApi';
import { useSelector, useDispatch } from 'react-redux'
import { setPrimaryThemeColor, setSecondaryThemeColor, setIcon, setIconDrawer, setTernaryThemeColor, setOptLogin, setPasswordLogin, setButtonThemeColor, setColorShades, setKycOptions,setIsOnlineVeriification } from '../../../redux/slices/appThemeSlice';
import { setManualApproval, setAutoApproval, setRegistrationRequired } from '../../../redux/slices/appUserSlice';
import { setPointSharing } from '../../../redux/slices/pointSharingSlice';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Splash = ({ navigation }) => {
  const dispatch = useDispatch()
  const focused = useIsFocused()

  const [isAlreadyIntroduced, setIsAlreadyIntroduced] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);



  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/ozonegif.gif')).uri;
  // generating functions and constants for API use cases---------------------
  const [
    getAppTheme,
    {
      data: getAppThemeData,
      error: getAppThemeError,
      isLoading: getAppThemeIsLoading,
      isError: getAppThemeIsError,
    }
  ] = useGetAppThemeDataMutation();

  useEffect(()=>{
    getData();
  },[])

  // calling API to fetch themes for the app
  useEffect(() => {
    getAppTheme("oopl")
    //         VersionCheck.getLatestVersion()
    // .then(latestVersion => {
    //     console.log(latestVersion);   
    //     });
  }, [focused])

  // fetching data and checking for errors from the API-----------------------
  useEffect(() => {
    if (getAppThemeData) {
      console.log("getAppThemeData", JSON.stringify(getAppThemeData.body))
      dispatch(setPrimaryThemeColor(getAppThemeData.body.theme.color_shades["600"]))
      dispatch(setSecondaryThemeColor(getAppThemeData.body.theme.color_shades["400"]))
      dispatch(setTernaryThemeColor(getAppThemeData.body.theme.color_shades["700"]))
      dispatch(setIcon(getAppThemeData.body.logo[0]))
      dispatch(setIconDrawer(getAppThemeData.body.logo[1]))
      dispatch(setOptLogin(getAppThemeData.body.login_options.Otp.users))
      dispatch(setPasswordLogin(getAppThemeData.body.login_options.Password.users))
      dispatch(setButtonThemeColor(getAppThemeData.body.theme.color_shades["700"]))
      dispatch(setManualApproval(getAppThemeData.body.approval_flow_options.Manual.users))
      dispatch(setAutoApproval(getAppThemeData.body.approval_flow_options.AutoApproval.users))
      dispatch(setRegistrationRequired(getAppThemeData.body.registration_options.Registration.users))
      dispatch(setColorShades(getAppThemeData.body.theme.color_shades))
      dispatch(setKycOptions(getAppThemeData.body.kyc_options))
      dispatch(setPointSharing(getAppThemeData.body.points_sharing))
      
      if(getAppThemeData.body.addon_features.kyc_online_verification!==undefined)
      {
        if(getAppThemeData.body.addon_features.kyc_online_verification)
        {
          dispatch(setIsOnlineVeriification())
        }
      }
      console.log("isAlreadyIntro", isAlreadyIntroduced)
      if(isAlreadyIntroduced == "Yes"){
        // if(isLoggedIn == "Yes"){
        //   navigation.navigate('Dashboard');
          
        // }
        // else{
      
        // }

            setTimeout(()=>{
            navigation.navigate('SelectUser');
          }, 2000)
  
      }
      else{
        setTimeout(() => {
          navigation.navigate('Introduction')
      }, 2000);

      }
    }
    else {
      getAppTheme("oopl")

      console.log("getAppThemeIsError", getAppThemeIsError)
      console.log("getAppThemeError", getAppThemeError)
    }
  }, [getAppThemeData, getAppThemeError, isAlreadyIntroduced])


  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('isAlreadyIntroduced');
      const isLoggedValue = await AsyncStorage.getItem("isAlreadyVerifiedOTP");
      if (value !== null) {
        // value previously stored
        console.log("asynch value",value)
        setIsAlreadyIntroduced(value);

        if(isLoggedValue!==null){
          setIsLoggedIn(isLoggedValue);
        }

      }
    } catch (e) {
      console.log("error",e)
      // error reading value
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <ImageBackground resizeMode='stretch' style={{ flex: 1, height: '100%', width: '100%', }} source={require('../../../assets/images/splash.png')}>

        {/* <Image  style={{ width: 200, height: 200,  }}  source={require('../../../assets/gif/ozonegif.gif')} /> */}
        <FastImage
          style={{ width: 350, height: 350, marginTop:'auto',alignSelf:'center' }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />




      </ImageBackground>

    </View>


  );
}

const styles = StyleSheet.create({})

export default Splash;