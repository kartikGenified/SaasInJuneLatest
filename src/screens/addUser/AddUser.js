import React, { useDeferredValue, useEffect, useState } from 'react';
import {View, StyleSheet, Image, TouchableOpacity,Dimensions, ScrollView, KeyboardAvoidingView ,Keyboard} from 'react-native';
import { useSelector } from 'react-redux';
import { useGetFormMutation } from '../../apiServices/workflow/GetForms';
import * as Keychain from 'react-native-keychain';
import TextInputRectangle from '../../components/atoms/input/TextInputRectangle';
import TextInputNumericRectangle from '../../components/atoms/input/TextInputNumericRectangle';
import InputDate from '../../components/atoms/input/InputDate';
import ImageInput from '../../components/atoms/input/ImageInput';
import TextInputAadhar from '../../components/atoms/input/TextInputAadhar';
import TextInputPan from '../../components/atoms/input/TextInputPan';
import TextInputGST from '../../components/atoms/input/TextInputGST';
import PrefilledTextInput from '../../components/atoms/input/PrefilledTextInput';
import PincodeTextInput from '../../components/atoms/input/PincodeTextInput';
import DropDownRegistration from '../../components/atoms/dropdown/DropDownRegistration';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useRegisterUserByBodyMutation } from '../../apiServices/register/UserRegisterApi';
import { useGetLocationFromPinMutation } from '../../apiServices/location/getLocationFromPincode';
import { useIsFocused } from '@react-navigation/native';

const AddUser = ({navigation}) => {
    const [addUserForm, setAddUserForm] = useState()
    const [userResponse, setUserResponse] = useState([])
    const [location, setLocation] = useState()
    const [selectUsers, setSelectUsers] = useState()
    const [userTypeList, setUserTypeList] = useState()
    const [message, setMessage] = useState();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
  const [modalTitle, setModalTitle] = useState()
    const [keyboardShow, setKeyboardShow] = useState(false)
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const userData = useSelector(state=>state.appusersdata.userData)
    const allUsers = useSelector(state=>state.appusers.value)
    console.log("userData",allUsers)
    const height = Dimensions.get('window').height
    const focused = useIsFocused()
    const [getFormFunc,{
        data:getFormData,
        error:getFormError,
        isLoading:getFormIsLoading,
        isError:getFormIsError
    }] = useGetFormMutation()

    const [getLocationFromPincodeFunc,{
        data:getLocationFormPincodeData,
        error:getLocationFormPincodeError,
        isLoading:getLocationFormPincodeIsLoading,
        isError:getLocationFromPincodeIsError
      } ] = useGetLocationFromPinMutation()

    const [registerUserFunc,{
        data:registerUserData,
        error:registerUserError,
        isLoading:registerUserIsLoading,
        isError:registerUserIsError
    }] = useRegisterUserByBodyMutation()
    Keyboard.addListener('keyboardDidShow',()=>{
        setKeyboardShow(true)
    })
    Keyboard.addListener('keyboardDidHide',()=>{
        setKeyboardShow(false)
    })

    var allUsersData=[]
    var allUsersList=[]

    useEffect(()=>{
        
         allUsers.map((item,index)=>{
         allUsersData.push({
            "userType":item.user_type,
            "userTypeId":item.user_type_id
        })
        allUsersList.push(item.user_type)
        })

        console.log("allUsersList",allUsersList)
        setSelectUsers(allUsersList)
        setUserTypeList(allUsersData)
        console.log("allUsersData",allUsersData)

    },[])

    useEffect(()=>{
        const getToken=async()=>{
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const form_type = "7"
            getFormFunc({form_type,token})
        }
        getToken()
    },[focused])

    useEffect(()=>{
        if(registerUserData){
            console.log("registerUserData",registerUserData)
            if(registerUserData.success)
            {
                setSuccess(true)
                setMessage(registerUserData.message)
                setModalTitle(`Dear ${userData.name}`)
            }
        }
        else if(registerUserError){
            console.log("registerUserError",registerUserError)
        }
    },[registerUserData,registerUserError])

    useEffect(()=>{
        if(getFormData){
            console.log("getFormData",JSON.stringify(getFormData))
            if(getFormData.success)
            {
                const template = getFormData.body.template
                const formTemplate = Object.values(template)
                setAddUserForm(formTemplate)
            }
        }
        else if(getFormError){
            console.log("getFormError",getFormError)
        }
    },[getFormData,getFormError])


    useEffect(()=>{
        if(getLocationFormPincodeData)
        {
          console.log("getLocationFormPincodeData",getLocationFormPincodeData)
          if(getLocationFormPincodeData.success  )
          {
            const address = getLocationFormPincodeData.body[0].office + ", " + getLocationFormPincodeData.body[0].district+ ", " + getLocationFormPincodeData.body[0].state+ ", " + getLocationFormPincodeData.body[0].pincode
            let locationJson = {
            
              lat:"N/A",
              lon:"N/A",
              address:address,
              city: getLocationFormPincodeData.body[0].district,
              district: getLocationFormPincodeData.body[0].division,
              state:getLocationFormPincodeData.body[0].state,
              country:"N/A",
              postcode:getLocationFormPincodeData.body[0].pincode
    
             
             }
             console.log(locationJson)
             setLocation(locationJson)
          }
        }
        else if(getLocationFormPincodeError)
        {
          console.log("getLocationFormPincodeError",getLocationFormPincodeError)
          setError(true)
          setMessage("Please enter a valid pincode")
        }
      },[getLocationFormPincodeData,getLocationFormPincodeError])

    const handleData = (data) => {
        console.log("removedValues",data);
       
        let submissionData = [...userResponse];
        let removedValues = submissionData.filter((item, index) => {
          return item.name !== data.name;
        });
        if(data.name==="user_type")
        {
            console.log("inside user_type",userTypeList)
            userTypeList.map((item,index)=>{
                console.log("item",item)
                if(item.userType===data.value)
                {
                    removedValues.push({
                        value: item.userTypeId,
                        name: "user_type_id",
                      });
                }
            })
        }
        // console.log("removedValues", removedValues);
        removedValues.push({
          value: data.value,
          name: data.name,
        });
        setUserResponse(removedValues);
        console.log("removedValues", removedValues);
    
      };

      const getLocationFromPinCode=async(pin)=>{
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username
          const params = {
            pincode:pin,
            token:token
            
          }
        getLocationFromPincodeFunc(params)
      
        }
      } 
      const handleFetchPincode=(data)=>{
        console.log("pincode is",data)
        getLocationFromPinCode(data)
        
        }
        const modalClose = () => {
            setError(false);
            setSuccess(false)
          };
    const handleSubmission=()=>{
        const inputFormData = {}
        inputFormData["is_approved_needed"] = true;
        inputFormData["is_online_verification"] = false;
        inputFormData["added_through"] = "app";
        inputFormData["added_by_name"] =userData.name
        inputFormData["added_by_id"] = userData.user_type_id;
        for(var i =0;i<userResponse.length;i++)
            {
                console.log(userResponse[i])
                inputFormData[userResponse[i].name] = userResponse[i].value
            }
            const body = inputFormData
            registerUserFunc(body)
    }
    return (
        <View style={{height:height,width:'100%',alignItems:"center",justifyContent:"center",backgroundColor:ternaryThemeColor}}>
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
              navigateTo="Dashboard"
              ></MessageModal>
          )}
            <View style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",width:'100%',marginTop:20,height:60,marginLeft:20}}>
            <TouchableOpacity onPress={()=>{
                navigation.goBack()
            }}>
            <Image style={{height:24,width:24,resizeMode:'contain',marginLeft:10}} source={require('../../../assets/images/blackBack.png')}></Image>

            </TouchableOpacity>
            <PoppinsTextMedium content ="Add User" style={{marginLeft:10,fontSize:16,fontWeight:'600',color:'white'}}></PoppinsTextMedium>
            <TouchableOpacity style={{marginLeft:200}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',width:'100%',backgroundColor:'white',height:height-60,borderTopRightRadius:30,borderTopLeftRadius:30,paddingTop:40,paddingBottom:keyboardShow ? 300:0}}>
            <KeyboardAvoidingView style={{width:"100%"}}>
            <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:"center",justifyContent:"center",width:'100%',paddingBottom:20}}>
            
            {addUserForm &&
            addUserForm.map((item, index) => {
              
              
              if (item.type === 'text') {
                
                   if (item.name === 'phone' || item.name==="mobile") {
                    return (
                      <TextInputNumericRectangle
                        jsonData={item}
                        key={index}
                        maxLength={10}
                        handleData={handleData}
                        placeHolder={item.name}
                        
                        label = {item.label}
                        required = {item.required}
                        
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
                      handleData={handleData}
                      placeHolder={item.name}
                      required = {item.required}
                      label = {item.label}
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
                      handleData={handleData}
                      placeHolder={item.name}
                      label = {item.label}
                      required = {item.required}
                      >
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
                      handleData={handleData}
                      placeHolder={item.name}
                      label = {item.label}
                      required = {item.required}
                      >
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
                      handleData={handleData}
                      placeHolder={item.name}
                      required = {item.required}
                      label = {item.label}>
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
                       handleData={handleData}
                       placeHolder={item.name}
                       value={location.city}
                       label = {item.label}
                       required = {item.required}
                       ></PrefilledTextInput>
                     )
                  
                  
                  
                }
                else if((item.name).trim().toLowerCase()==="pincode")
                {
                  return(
                    <PincodeTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    handleFetchPincode = {handleFetchPincode}
                    placeHolder={item.name}
                    label = {item.label}
                    required = {item.required}
                    maxLength={6}
                    ></PincodeTextInput>
                  )
                }
                
                else if((item.name).trim().toLowerCase()==="state" && location!==undefined)
                {
                    console.log("inside state" ,item)
                  return(
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    value={location.state}
                    label = {item.label}
                    required = {item.required}
                    ></PrefilledTextInput>
                  )
                }
                else if((item.name).trim().toLowerCase()==="district" && location!==undefined)
                {
                  
                    return(
                      <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                    value = {location.district}
                      label = {item.label}
                      required = {item.required}
                      ></PrefilledTextInput>
                    )
                  
                 
                  
                }
                else {
                  return (
                    <TextInputRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      required = {item.required}
                      label = {item.label}>
                      {' '}
                    </TextInputRectangle>
                  );
                }
              } else if (item.type === 'file') {
                return (
                  <ImageInput
                    jsonData={item}
                    handleData={handleData}
                    key={index}
                    data={item.name}
                    label = {item.label}
                    required = {item.required}
                    action="Select File"></ImageInput>
                );
              } else if (item.type === 'date') {
                return (
                  <InputDate
                    jsonData={item}
                    handleData={handleData}
                    data={item.label}
                    required = {item.required}
                    key={index}></InputDate>
                );
              }
              else if (item.type === "select") {
                return (
                  <DropDownRegistration
                    key={index}
                    title={item.name}
                    header={item.label}
                    jsonData={item}
                    data={item.options}
                    handleData={handleData}
                  ></DropDownRegistration>
                );
              }
            })
            
            }
            {
            selectUsers &&  
            <DropDownRegistration
                    
                    title="user_type"
                    header="UserType"
                    jsonData={{"label": "UserType", "maxLength": "100", "name": "user_type", "options": [], "required": true, "type": "text"}}
                    data={selectUsers}
                    handleData={handleData}
            ></DropDownRegistration>
            }
           
            <TouchableOpacity onPress={()=>{
                handleSubmission()
            }}  style={{height:40,width:120,borderRadius:4,backgroundColor:ternaryThemeColor,alignItems:"center",justifyContent:"center",marginTop:20}}>

                <PoppinsTextMedium content="Proceed" style={{color:'white',fontSize:20}}></PoppinsTextMedium>
            </TouchableOpacity>

            </ScrollView>
            </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default AddUser;
