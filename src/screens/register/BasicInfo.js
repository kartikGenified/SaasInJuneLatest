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
import {useSelector,useDispatch} from 'react-redux';
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
  const dispatch = useDispatch()

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
  const navigatingFrom = route.params.navigatingFrom
  const name = route.params?.name
  const mobile = route.params?.mobile
  console.log("appUsers",userType,userTypeId,isManuallyApproved,name,mobile)
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
    
    const AppUserType = userType
    getFormFunc({AppUserType})
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
      console.log("res",res)
        lat = res.coords.latitude
        lon = res.coords.longitude
        // getLocation(JSON.stringify(lat),JSON.stringify(lon))
        console.log("latlong",lat,lon)
        var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.coords.latitude},${res.coords.longitude}
        &location_type=ROOFTOP&result_type=street_address&key=AIzaSyADljP1Bl-J4lW3GKv0HsiOW3Fd1WFGVQE`
    
    fetch(url).then(response => response.json()).then(json => {
      console.log("location address=>", JSON.stringify(json));
      const formattedAddress = json.results[0].formatted_address
      const formattedAddressArray = formattedAddress.split(',')
     
      let locationJson = {
        
        lat:json.results[0].geometry.location.lat ===undefined ? "N/A":json.results[0].geometry.location.lat,
        lon:json.results[0].geometry.location.lng===undefined ? "N/A":json.results[0].geometry.location.lng,
        address:formattedAddress===undefined ? "N/A" :formattedAddress
       
       }

       const addressComponent = json.results[0].address_components
       console.log("addressComponent",addressComponent)
       for(let i=0;i<=addressComponent.length;i++)
       {
        if(i===addressComponent.length)
        {
          dispatch(setLocation(locationJson))
          setLocation(locationJson)
        }
        else{
          if(addressComponent[i].types.includes("postal_code"))
          {
          console.log("inside if")

            console.log(addressComponent[i].long_name)
            locationJson["postcode"]=addressComponent[i].long_name
          }
          else if(addressComponent[i].types.includes("country"))
          {
            console.log(addressComponent[i].long_name)

            locationJson["country"]=addressComponent[i].long_name
          }
          else if(addressComponent[i].types.includes("administrative_area_level_1"))
          {
            console.log(addressComponent[i].long_name)

            locationJson["state"]=addressComponent[i].long_name
          }
          else if(addressComponent[i].types.includes("administrative_area_level_2"))
          {
            console.log(addressComponent[i].long_name)

            locationJson["district"]=addressComponent[i].long_name
          }
          else if(addressComponent[i].types.includes("locality"))
          {
            console.log(addressComponent[i].long_name)

            locationJson["city"]=addressComponent[i].long_name
          }
        }
        
       }
     
     
     console.log("formattedAddressArray",locationJson)
     
  })
    })
    
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
              navigateTo={navigatingFrom==="PasswordLogin"? "PasswordLogin":"OtpLogin"}
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
                
                   if (item.name === 'phone' || item.name==="mobile") {
                    return (
                      <TextInputNumericRectangle
                        jsonData={item}
                        key={index}
                        maxLength={10}
                        handleData={handleChildComponentData}
                        placeHolder={item.name}
                        value={mobile}
                        
                        >
                        {' '}
                      </TextInputNumericRectangle>
                    );
                  
                } 
                else if((item.name).trim().toLowerCase()==="name")
                {
                  
                    return(
                      <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={name}
                      ></PrefilledTextInput>
                    )
                  
                 
                  
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
                  
                    return(
                      <PrefilledTextInput
                       jsonData={item}
                       key={index}
                       handleData={handleChildComponentData}
                       placeHolder={item.name}
                       value={location.city}
                       ></PrefilledTextInput>
                     )
                  
                  
                  
                }
                else if((item.name).trim().toLowerCase()==="pincode" && location!==undefined)
                {
                  return(
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    value={location.postcode}
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
                    value={location.state}
                    ></PrefilledTextInput>
                  )
                }
                else if((item.name).trim().toLowerCase()==="district" && location!==undefined)
                {
                  
                    return(
                      <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location.district}
                      ></PrefilledTextInput>
                    )
                  
                 
                  
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
