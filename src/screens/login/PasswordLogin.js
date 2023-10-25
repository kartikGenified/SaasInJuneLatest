import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Image, ScrollView,TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {BaseUrl} from '../../utils/BaseUrl';
import LinearGradient from 'react-native-linear-gradient';import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import CustomTextInput from '../../components/organisms/CustomTextInput';
import { usePasswordLoginMutation } from '../../apiServices/login/passwordBased/PasswordLoginApi';
import ButtonNavigateArrow from '../../components/atoms/buttons/ButtonNavigateArrow';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import TextInputRectangularWithPlaceholder from '../../components/atoms/input/TextInputRectangularWithPlaceholder';
import { setAppUserId } from '../../../redux/slices/appUserDataSlice';
import { setAppUserName } from '../../../redux/slices/appUserDataSlice';
import { setAppUserType } from '../../../redux/slices/appUserDataSlice';
import { setUserData } from '../../../redux/slices/appUserDataSlice';
import { setId } from '../../../redux/slices/appUserDataSlice';
import * as Keychain from 'react-native-keychain';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';

const PasswordLogin = ({navigation,route}) => {
  const [username, setUsername] = useState("influencer_5")
  const [passwords, setPasswords] = useState("123456")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const width = Dimensions.get('window').width;



  // fetching theme for the screen-----------------------
  const dispatch = useDispatch()

  const primaryThemeColor = useSelector(
    state => state.apptheme.primaryThemeColor,
  )
    ? useSelector(state => state.apptheme.primaryThemeColor)
    : '#FF9B00';
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';

  const icon = useSelector(state => state.apptheme.icon)
    ? useSelector(state => state.apptheme.icon)
    : require('../../../assets/images/demoIcon.png');

  const buttonThemeColor = useSelector(
      state => state.apptheme.ternaryThemeColor,
    )
      ? useSelector(state => state.apptheme.ternaryThemeColor)
      : '#ef6110';
    
// ------------------------------------------

  // initializing mutations --------------------------------


    const [passwordLoginfunc,{
      data:passwordLoginData,
      error:passwordLoginError,
      isLoading:passwordIsLoading,
      isError:passwordIsError
    }] = usePasswordLoginMutation()
    
 // ------------------------------------------

// retrieving data from api calls--------------------------

    useEffect(()=>{
      if(passwordLoginData)
      {
        console.log("Password Login Data",passwordLoginData)
        if(passwordLoginData.success)
        {
          saveUserDetails(passwordLoginData.body)
          saveToken(passwordLoginData.body.token)
          setSuccess(true)
          setMessage(passwordLoginData.message)
        }
      }
      else if(passwordLoginError){
        console.log("Password Login Error",passwordLoginError)
        setError(true)
        setMessage("Login Failed")
      }
    },[passwordLoginData,passwordLoginError])

 // ------------------------------------------


    const userType = route.params.userType
    const userId = route.params.userId
    const needsApproval = route.params.needsApproval
    console.log("Needs approval",needsApproval)
    const height = Dimensions.get('window').height
    const getUserId=(data)=>{
        console.log(data)
        setUsername(data)
    }
    const getPassword=(data)=>{
        console.log(data)
        setPasswords(data)
    }
    const handleLogin=()=>{
      console.log( username,passwords)
      const user_id = username
      const password = passwords
      passwordLoginfunc({user_id,password})

    }
    const handleNavigationToRegister=()=>{
    // navigation.navigate('BasicInfo',{needsApproval:needsApproval, userType:userType, userId:userId})

      // navigation.navigate('RegisterUser',{needsApproval:needsApproval, userType:userType, userId:userId})
      navigation.navigate("BasicInfo",{needsApproval:needsApproval, userType:userType, userId:userId})

    }
    const saveUserDetails=(data)=>{
    
      try{
    console.log("Saving user details",data)
    dispatch(setAppUserId(data.user_type_id))
    dispatch(setAppUserName(data.name))
    dispatch(setAppUserType(data.user_type))
    dispatch(setUserData(data))
    dispatch(setId(data.id))
        }
  catch(e){
    console.log("error",e)
  }
  }
  const saveToken=async(data)=>{
    const token = data 
    const password ='17dec1998'
  
      await Keychain.setGenericPassword(token,password);
    }

    const modalClose = () => {
      setError(false);
      setSuccess(false)
      setMessage('')
      navigation.navigate('Dashboard')

    };
  return (
    <LinearGradient
      colors={["white", "white"]}
      style={{...styles.container,height:height}}>
      
      <View style={{width:'100%',alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:ternaryThemeColor,}}>
      <View
        style={{
          height: 120,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:ternaryThemeColor,
          flexDirection:'row',
          
        }}>
        
          <TouchableOpacity
          style={{height:50,alignItems:"center",justifyContent:'center',position:"absolute",left:10,top:30}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{height: 20, width: 20, resizeMode: 'contain'}}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity>
          <Image
            style={{
              height: 80,
              width: 120,
              resizeMode: 'center',
              top:10,
              position:"absolute",
              left:50,
            }}
            source={require('../../../assets/images/ozoneWhiteLogo.png')}></Image>

             <View style={{alignItems:'center',justifyContent:"center",position:'absolute',right:10,top:14}}>
        {/* <PoppinsTextMedium style={{fontSize:18}} content ="Don't have an account ?"></PoppinsTextMedium> */}
        <ButtonNavigate
              handleOperation={handleNavigationToRegister}
              backgroundColor="white"
              style={{color: 'black', fontSize: 16}}
              content="Register"
              >
        </ButtonNavigate>

        </View>
      </View>
      <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginTop: 10,
              width:'90%'
            }}>
            <PoppinsText
              style={{color: 'white', fontSize: 28}}
              content="Login To Your Account"></PoppinsText>
            
          </View>
      </View>
      {error && (
            <ErrorModal
              modalClose={modalClose}
              message={message}
              openModal={error}></ErrorModal>
          )}
          {success && (
            <MessageModal
              modalClose={modalClose}
              message={message}
              navigateTo="Dashboard"
              openModal={success}></MessageModal>
          )}
      <ScrollView style={{width:'100%',height:height-140}}>
       
        
        <View style={{width:"100%",alignItems:"center",justifyContent:"center",marginTop:30}}>
            {/* <CustomTextInput sendData={getUserId} title="Username" image={require('../../../assets/images/whiteUser.png')}></CustomTextInput>
            <CustomTextInput sendData={getPassword} title="Password" image={require('../../../assets/images/whitePassword.png')}></CustomTextInput> */}

            <TextInputRectangularWithPlaceholder
            placeHolder="UserName"
            handleData={getUserId}
            // maxLength={10}
              ></TextInputRectangularWithPlaceholder>
              <TextInputRectangularWithPlaceholder
            placeHolder="Password"
            handleData={getPassword}
            // maxLength={10}
              ></TextInputRectangularWithPlaceholder>
        </View>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:'center',width:'90%'}}>
          <PoppinsTextMedium style={{color:"#727272",fontSize:14}} content = "Not remembering password? "></PoppinsTextMedium>
          <TouchableOpacity >
            <PoppinsTextMedium style={{color:ternaryThemeColor,fontSize:14}} content="Forget Password"></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
        <View style={{width:"100%",alignItems:'flex-start',justifyContent:"center",marginLeft:20,marginTop:300}}>
        <ButtonNavigateArrow
              handleOperation={handleLogin}
              backgroundColor={buttonThemeColor}
              style={{color: 'white', fontSize: 16}}
              content="Login">
        </ButtonNavigateArrow>

        </View>

       
        
        </ScrollView>
      
        
      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  semicircle: {
    backgroundColor: 'white',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  banner: {
    height: 184,
    width: '90%',
    borderRadius: 10,
  },
  userListContainer: {
    width: '100%',
    height:600,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:20
  },
});

export default PasswordLogin;
