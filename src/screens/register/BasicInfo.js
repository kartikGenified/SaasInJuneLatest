import React, {useEffect, useId, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {useSelector} from 'react-redux';
import TextInputRectangleMandatory from '../../components/atoms/input/TextInputRectangleMandatory';
import TextInputRectangle from '../../components/atoms/input/TextInputRectangle';
import TextInputNumericRectangle from '../../components/atoms/input/TextInputNumericRectangle';
import InputDate from '../../components/atoms/input/InputDate';
import ImageInput from '../../components/atoms/input/ImageInput';
import * as Keychain from 'react-native-keychain';
import MessageModal from '../../components/modals/MessageModal';
import RegistrationProgress from '../../components/organisms/RegistrationProgress';
import { useGetFormAccordingToAppUserTypeMutation } from '../../apiServices/workflow/GetForms';
import ButtonOval from '../../components/atoms/buttons/ButtonOval';
import { useRegisterUserByBodyMutation } from '../../apiServices/register/UserRegisterApi';
import TextInputAadhar from '../../components/atoms/input/TextInputAadhar';
import TextInputPan from '../../components/atoms/input/TextInputPan';
import TextInputGST from '../../components/atoms/input/TextInputGST';
import ErrorModal from '../../components/modals/ErrorModal';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import PrefilledTextInput from '../../components/atoms/input/PrefilledTextInput';

const BasicInfo = ({navigation,route}) => {
    const [message, setMessage] = useState();
    const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [registrationForm, setRegistrationForm] = useState([])
  const [responseArray, setResponseArray] = useState([]);
  const [isManuallyApproved, setIsManuallyApproved] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [needsAadharVerification, setNeedsAadharVerification] = useState(false)
  const [location, setLocation] = useState()
  

  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';

  const userData = useSelector(state => state.appusersdata.userData);
  const appUsers = useSelector(state => state.appusers.value)
  const manualApproval = useSelector(state => state.appusers.manualApproval)
  const userType = route.params.userType
  const userTypeId = route.params.userId
  const needsApproval = route.params.needsApproval
  const name = route.params?.name
  const mobile = route.params?.mobile
  console.log("appUsers",userType,userTypeId,isManuallyApproved)
    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height

    const [getFormFunc,{
      data:getFormData,
      error:getFormError,
      isLoading:getFormIsLoading,
      isError:getFormIsError
  }] =useGetFormAccordingToAppUserTypeMutation()

  const [registerUserFunc,
  {
    data:registerUserData,
    error:registerUserError,
    isLoading:registerUserIsLoading,
    isError:registerUserIsError
  }] = useRegisterUserByBodyMutation()

  useEffect(()=>{
    const getData=async()=>{
      const credentials = await Keychain.getGenericPassword();
                if (credentials) {
                  console.log(
                    'Credentials successfully loaded for user ' + credentials.username
                  );
                  const token = credentials.username
                  const AppUserType = userType
                  
                  token && getFormFunc({AppUserType})
                }

    }
    getData()
    if(manualApproval.includes(userType))
    {
      setIsManuallyApproved(true)
    }
    else
    {
      setIsManuallyApproved(false)
    }
    
  },[])
  useEffect(()=>{
    let lat=''
    let lon=''
    Geolocation.getCurrentPosition((res)=>{
        lat = res.coords.latitude
        lon = res.coords.longitude
        getLocation(JSON.stringify(lat),JSON.stringify(lon))
    })
    const getLocation=(lat,lon)=>{
        if(lat!=='' && lon!=='')
        {
            console.log("latitude and longitude",lat,lon)
            try{
                axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}+&lon=${lon}&format=json`,{headers:{
                    'Content-Type': 'application/json'
                }}).then((res)=>{console.log("Addres Data",res.data)
                setLocation(res.data)
              })
            }
            catch(e)
            {
                console.log("Error in fetching location",e)
            }
        

        }
        else{
            console.log("latitude and longitude",lat,lon)
        }
    }
  },[])
  useEffect(()=>{
    if(getFormData)
    {
        console.log("Form Fields",getFormData.body.template)
        const values = Object.values(getFormData.body.template)
        setRegistrationForm(values)
    }
    else if(getFormError){
        console.log("Form Field Error",getFormError)
    }
},[getFormData,getFormError])

useEffect(()=>{
  if(registerUserData)
  {
      console.log("data after submitting form",registerUserData)
      if(registerUserData.success)
      {
      setSuccess(true)
      setMessage(registerUserData.message)
      setModalTitle("WOW")
      }
      
      // const values = Object.values(registerUserData.body.template)
      // setRegistrationForm(values)
  }
  else if(registerUserError){
      console.log("form submission error",registerUserError)
      setError(true)
      setMessage(registerUserError.data.message)
      
  }
},[registerUserData,registerUserError])

const handleChildComponentData = data => {
  console.log("from text input",data);

  // Update the responseArray state with the new data
  setResponseArray(prevArray => {
    const existingIndex = prevArray.findIndex(
      item => item.name === data.name,
    );

    if (existingIndex !== -1) {
      // If an entry for the field already exists, update the value
      const updatedArray = [...prevArray];
      updatedArray[existingIndex] = {
        ...updatedArray[existingIndex],
        value: data.value,
      };
      return updatedArray;
    } else {
      // If no entry exists for the field, add a new entry
      return [...prevArray, data];
    }
  });
};
console.log(responseArray)
  const modalClose = () => {
    setError(false);
  };
const handleRegistrationFormSubmission=()=>{
  const inputFormData = {}
  inputFormData["user_type"] = userType;
  inputFormData["user_type_id"] = userTypeId;
  inputFormData["is_approved_needed"] = isManuallyApproved;
  inputFormData["name"] = name;
  inputFormData["mobile"] = mobile;

  for(var i =0;i<responseArray.length;i++)
  {
    console.log(responseArray[i])
    inputFormData[responseArray[i].name] = responseArray[i].value
  }
  const body=inputFormData
  registerUserFunc(body)
  console.log("responseArray",body)
}
  
    return (
        <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
        
        
      }}>
        {error && (
            <ErrorModal
              modalClose={modalClose}
              
              message={message}
              openModal={error}></ErrorModal>
          )}
           {success && (
            <MessageModal
              modalClose={modalClose}
              title={modalTitle}
              message={message}
              openModal={success}
              navigateTo="PasswordLogin"
              params={{needsApproval:needsApproval, userType:userType, userId:userTypeId}}></MessageModal>
          )}
          
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '10%',
          
         
          
          
       
        }}>
        <TouchableOpacity
        style={{
            height:24,width:24,
            position:'absolute',
        top:20,
        left:10}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent: 'center',position:"absolute",top:20,left:50}}>
          <PoppinsTextMedium
            content="Registration"
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: '700',
              color: 'white',
            }}></PoppinsTextMedium>
        </View>
      </View>
      <ScrollView style={{width:'100%'}}>

      <View style={{width:width,backgroundColor:"white",alignItems:"center",justifyContent:'flex-start',paddingTop:20}}>
        <PoppinsTextMedium style={{color:'black',fontWeight:'700',fontSize:18,marginBottom:40}} content="Please Fill The Following Form To Register"></PoppinsTextMedium>
        {/* <RegistrationProgress data={["Basic Info","Business Info","Manage Address","Other Info"]}></RegistrationProgress> */}
        {registrationForm &&
            registrationForm.map((item, index) => {
              console.log(item);
              
              if (item.type === 'text') {
                // if (item.required === true ) {
                  // if( item.name !== 'phone' && item.name !== 'aadhar' && item.name !== 'pan' && item.name!== "mobile" && item.name!=='aadhaar')
                  // {
                  //   return (
                  //     <TextInputRectangleMandatory
                  //       jsonData={item}
                  //       key={index}
                  //       handleData={handleChildComponentData}
                  //       placeHolder={item.name}>
                  //       {' '}
                  //     </TextInputRectangleMandatory>
                  //   );
                  // }
                   if (item.name === 'phone' || item.name==="mobile") {
                    return (
                      <TextInputNumericRectangle
                        jsonData={item}
                        key={index}
                        maxLength={10}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}>
                        {' '}
                      </TextInputNumericRectangle>
                    );
                  
                } 
                // } 
                else if (item.name === 'aadhaar' || item.name==="aadhar") {
                  console.log("aadhar")
                  return (
                    <TextInputAadhar
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputAadhar>
                  );
                }
                else if (item.name === 'pan') {
                  console.log("pan")
                  return (
                    <TextInputPan
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputPan>
                  );
                } 
                else if (item.name === 'gstin') {
                  console.log("gstin")
                  return (
                    <TextInputGST
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputGST>
                  );
                }
                else if((item.name).trim().toLowerCase()==="city" && location!==undefined)
                {
                  if(location.address.city)
                  {
                    return(
                      <PrefilledTextInput
                       jsonData={item}
                       key={index}
                       handleData={handleChildComponentData}
                       placeHolder={item.name}
                       value={location.address.city}
                       ></PrefilledTextInput>
                     )
                  }
                  else if(location.address.state)
                  {
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    value={location.address.state}
                    ></PrefilledTextInput>
                  }
                  
                }
                else if((item.name).trim().toLowerCase()==="pincode" && location!==undefined)
                {
                  return(
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    value={location.address.postcode}
                    ></PrefilledTextInput>
                  )
                }
                else if((item.name).trim().toLowerCase()==="state" && location!==undefined)
                {
                  return(
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    value={location.address.state}
                    ></PrefilledTextInput>
                  )
                }
                else if((item.name).trim().toLowerCase()==="district" && location!==undefined)
                {
                  if(location.address.county)
                  {
                    return(
                      <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location.address.state_district}
                      ></PrefilledTextInput>
                    )
                  }
                  else{
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    value={location.address.district}
                    ></PrefilledTextInput>
                  }
                  
                }
                else {
                  return (
                    <TextInputRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputRectangle>
                  );
                }
              } else if (item.type === 'file') {
                return (
                  <ImageInput
                    jsonData={item}
                    handleData={handleChildComponentData}
                    key={index}
                    data={item.name}
                    action="Select File"></ImageInput>
                );
              } else if (item.type === 'date') {
                return (
                  <InputDate
                    jsonData={item}
                    handleData={handleChildComponentData}
                    data={item.label}
                    key={index}></InputDate>
                );
              }
            })}

             <ButtonOval
            handleOperation={() => {
              handleRegistrationFormSubmission();
            }}
            content="Submit"
            style={{
              paddingLeft: 30,
              paddingRight: 30,
              padding: 10,
              color: 'white',
              fontSize: 16,
            }}></ButtonOval>
      </View>
      </ScrollView>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default BasicInfo;
