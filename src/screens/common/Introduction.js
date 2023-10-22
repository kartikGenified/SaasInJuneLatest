import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text,Image} from 'react-native';
import DotHorizontalList from '../../components/molecules/DotHorizontalList';
import  {useGetAppThemeDataMutation}  from '../../apiServices/appTheme/AppThemeApi';
import { useSelector, useDispatch } from 'react-redux'
import { setPrimaryThemeColor,setSecondaryThemeColor,setIcon,setIconDrawer,setTernaryThemeColor,setOptLogin,setPasswordLogin,setButtonThemeColor,setColorShades,setKycOptions} from '../../../redux/slices/appThemeSlice';
import { setManualApproval,setAutoApproval,setRegistrationRequired} from '../../../redux/slices/appUserSlice';
// import VersionCheck from 'react-native-version-check';

const Introduction = ({navigation}) => {
    const [imageIndex, setImageIndex] = useState(0)
    const dispatch = useDispatch()
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

      // calling API to fetch themes for the app
      useEffect(()=>{
        getAppTheme("oopl")
    //         VersionCheck.getLatestVersion()
    // .then(latestVersion => {
    //     console.log(latestVersion);   
    //     });
      },[])

      // fetching data and checking for errors from the API-----------------------
      useEffect(()=>{
        if(getAppThemeData)
        {
            
            console.log("getAppThemeData",JSON.stringify(getAppThemeData.body))
            dispatch(setPrimaryThemeColor(getAppThemeData.body.theme.color_shades["500"]))
            dispatch(setSecondaryThemeColor(getAppThemeData.body.theme.color_shades["300"]))
            dispatch(setTernaryThemeColor(getAppThemeData.body.theme.color_shades["600"]))
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





        }
        else{
            getAppTheme("oopl")

            console.log("getAppThemeIsError",getAppThemeIsError)
            console.log("getAppThemeError",getAppThemeError)
        }
      },[getAppThemeData,getAppThemeError])


      

    // This is the array used to display images, add or remove image from the array to modify as per clients need----------------
    
    const descriptionImages=[require('../../../assets/images/genuinemarkDescription.png'),require('../../../assets/images/rewardifyDescription.png'),require('../../../assets/images/supplybeamDescription.png')]
    
    
    // function to handle next button press and to navigate to Select Language page when all the images are showed-----------------
    const handleNext=()=>{
        console.log(descriptionImages.length)
        if(imageIndex<descriptionImages.length)
        {
            
            if(imageIndex==descriptionImages.length-1)
            {
                navigation.navigate('SelectLanguage')
            }
            else{
                setImageIndex(imageIndex+1)
            }
        }
        
    }

    return (
        <View style={{backgroundColor:"#F2F2F2",height:'100%',width:'100%',flex:1}}>
            <View style={{height:'20%',width:'100%'}}>

            </View>
            <View style={{width:'100%',height:'60%'}}>
                <Image style={{height:"100%",width:"100%"}} source={descriptionImages[imageIndex]}></Image>
            </View>
            <View style={{height:'20%',width:'100%',paddingBottom:20}}>
            <DotHorizontalList no = {descriptionImages.length} primaryColor="white" secondaryColor="#0085A2" selectedNo = {imageIndex} ></DotHorizontalList>
            
            <View style={{width:"100%",height:'100%'}}>
                <Text onPress={()=>{console.log("skipped")
            {getAppThemeData && navigation.navigate('SelectLanguage')}
            }} style={{fontSize:18,color:"#0087A2",position:"absolute",left:40,bottom:20,fontWeight:'600'}}>Skip</Text>
                <Text onPress={()=>{handleNext()}} style={{fontSize:18,color:"#0087A2",position:"absolute",right:40,bottom:20,fontWeight:'600'}}>Next</Text>
            </View>
            </View>
            
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default Introduction;
