
import React,{useState,useEffect} from 'react';
import {View, StyleSheet,Image,TouchableOpacity,Dimensions,FlatList,Keyboard, Pressable, Modal,Text, KeyboardAvoidingView, ScrollView} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import RectanglarUnderlinedTextInput from '../../components/atoms/input/RectanglarUnderlinedTextInput';
import InputDate from '../../components/atoms/input/InputDate';
import ImageInput from '../../components/atoms/input/ImageInput';
import { useUploadImagesMutation } from '../../apiServices/imageApi/imageApi';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useUpdateProfileMutation } from '../../apiServices/profile/profileApi';
import * as Keychain from 'react-native-keychain';
import MessageModal from '../../components/modals/MessageModal';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
import ErrorModal from '../../components/modals/ErrorModal';
import InputDateProfile from '../../components/atoms/input/InputDateProfile';
import RectangularUnderlinedDropDown from '../../components/atoms/dropdown/RectangularUnderlinedDropDown';
import ProfileDropDown from '../../components/atoms/dropdown/ProfileDropDown';
import moment from 'moment';
import PincodeTextInput from '../../components/atoms/input/PincodeTextInput';
import PincodeEditProfileTextInput from '../../components/atoms/input/PincodeEditProfileTextInput';
import { useGetLocationFromPinMutation } from '../../apiServices/location/getLocationFromPincode';
import { setLocation } from '../../../redux/slices/userLocationSlice';
import Geolocation from '@react-native-community/geolocation';
import DisplayOnlyTextInput from '../../components/atoms/DisplayOnlyTextInput';
import ImagePicker from 'react-native-image-crop-picker';


const EditProfile = ({navigation,route}) => {
  const [changedFormValues, setChangedFormValues] = useState([])
  const [hasManualkyc, setHasManualKyc] = useState(false)
  const [pressedSubmit, setPressedSubmit] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(route.params?.savedImage )
  const [filename, setFilename] = useState(route.params?.savedImage)
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [marginB, setMarginB] = useState(0)
  const [location, setLocation] = useState()
  const [fixedHeight, setFixedHeight] = useState(false)
  // const userData = useSelector(state=>state.appusersdata.userData)
console.log("saved image",route.params?.savedImage)
  // console.log("route.params.savedImage",route.params.savedImage)
  const dispatch = useDispatch()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const formFields = route.params?.formFields
    const formValues = route.params?.formValues
    const height = Dimensions.get('window').height
    let submissionData= [...changedFormValues]
              let removedValues=[...changedFormValues] ;
    // const manualkyc = ["fabricator","consumer","retailer","dealer"]
    console.log("form fields and values",JSON.stringify(formFields),formValues)
    Keyboard.addListener('keyboardDidShow',()=>{
      setFixedHeight(true)
  })
    const [
      uploadImageFunc,
      {
        data: uploadImageData,
        error: uploadImageError,
        isLoading: uploadImageIsLoading,
        isError: uploadImageIsError,
      },
    ] = useUploadImagesMutation();

    const[updateProfileFunc,{
      data:updateProfileData,
      error:updateProfileError,
      isLoading:updateProfileIsLoading,
      isError:updateProfileIsError
    }] =useUpdateProfileMutation()

    const [getLocationFromPincodeFunc,{
      data:getLocationFormPincodeData,
      error:getLocationFormPincodeError,
      isLoading:getLocationFormPincodeIsLoading,
      isError:getLocationFromPincodeIsError
    } ] = useGetLocationFromPinMutation()
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
      if(updateProfileData)
      {
        console.log("updateProfileData",updateProfileData)
        setMessage("Profile Updated Successfully")
        setSuccess(true)
      }
      else if(updateProfileError)
      {
        console.log("updateProfileError",updateProfileError)
        setMessage(updateProfileError.data.message)
        setError(true)
      }
    },[updateProfileData,updateProfileError])

    useEffect(()=>{
      const temp=[]
      formFields && formValues && formFields.map((item,index)=>{
        temp.push({
            "value":formValues[index],
              "name":item.name
        })
      })
      setChangedFormValues(temp)
      submissionData = temp
      
    },[])
    
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

    useEffect(() => {
      if (uploadImageData) {
        console.log(uploadImageData);
        if(uploadImageData.success)
        {
       setFilename(uploadImageData.body[0].filename)
       setModalVisible(false)
      //  setMessage(uploadImageData.message)
      //  setSuccess(true)

        }
      } else {
        console.log(uploadImageError);
      }
    }, [uploadImageData, uploadImageError]);
    
      const handleData=(data,title)=>{
        console.log(data,title , title.length,"WOW")
        if(changedFormValues.length!==0)
        {
          console.log("changedFormValues",changedFormValues)
          submissionData = changedFormValues
            
            
              submissionData = submissionData.filter((item,index)=>{
               console.log("--->" ,item , title , item.name === title)
               return item.name!==title
             })
            //   submissionData.push({
            //   "value":data,
            //   "name":title
            // }),
              const finalData = [...submissionData,{"name": title, "value": data}]
              
            setChangedFormValues(finalData)
            // for(var i =0; i<submissionData.length;i++)
            // {
            //   const element = submissionData[i]
            //   removedValues = submissionData.splice(i,1)
            //   console.log(element)
            // }
            
            //  console.log("finalData",finalData)
            
             console.log("removed values are not complete",finalData,title)
            
            
           
          
        }
        
          
            
            
        //     console.log("removedValues",removedValues)
          
      //  console.log("changedFormValues",changedFormValues)
      }

      useEffect(() => {
        
        console.log("abcdefgh",changedFormValues)
      }, [changedFormValues])
      


      Keyboard.addListener("keyboardDidShow", () => {
        setMarginB(100)
      });
      Keyboard.addListener("keyboardDidHide", () => {
        setMarginB(0)
      });

      const handleFetchPincode=(data)=>{
        console.log("pincode is",data)
        getLocationFromPinCode(data)
        
        }

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
          setLocation()
        
          }
        } 

      const modalClose = () => {
        setError(false);
        setSuccess(false)
      };
      const updateProfile=()=>{
        Keyboard.dismiss()
        setPressedSubmit(true)
        console.log("FinalchangedFormValues",changedFormValues)
        var profileData = {}
        
          profileData["profile_pic"] = filename
        changedFormValues.map((item)=>{
          profileData[item.name] = item.value
        })
        if(Object.keys(profileData).length!==0)
        {
          console.log("profileData",profileData)
          submitProfileData(profileData)
        }
        
      }
      const submitProfileData=async(tempData)=>{
        console.log("tempData",tempData)
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username
          const params={token:token,data:tempData}
          console.log("params from submitProfile",params)
          setTimeout(() => {
            updateProfileFunc(params)
          }, 2000);
        }
      }

      const handleImageUpload=async()=>{
        
        const result = await launchImageLibrary();
        console.log("image reult from gallery",result.assets[0].uri)
        setProfileImage(result.assets[0])
      }
      const uploadProfilePicture=()=>{
        if(profileImage!==BaseUrlImages+route.params.savedImage && profileImage!==null)
        {
          const imageData = {
            uri: profileImage.uri,
            name: profileImage.uri.slice(0, 10),
            type: 'jpg/png',
          };
          const uploadFile = new FormData();
          uploadFile.append('images', imageData);
          uploadImageFunc({body: uploadFile});
        }
        else{
        console.log("else")
        setError(true)
        setMessage("Please select the image to be uploaded")
        }
      }
    return (
      
     
        <View style={{height:'100%',backgroundColor:"white",flex:1}}>
           
          {modalVisible && <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{height:40,width:'100%',backgroundColor:"#303030",flexDirection:'row',alignItems:"center",justifyContent:"flex-start",borderTopRightRadius:10,borderTopLeftRadius:10}}>
              <TouchableOpacity onPress={()=>{
                setModalVisible(false)
              }} style={{height:20,width:20,alignItems:"center",justifyContent:"center",marginLeft:10}}>
               <Image style={{height:20,width:20,resizeMode:'contain',transform:[{rotate:'45deg'}]}} source={require('../../../assets/images/plus.png')}></Image>
              
              </TouchableOpacity>
              <PoppinsTextMedium content="Select the image to upload " style={{color:'white',fontSize:16,marginLeft:10}}></PoppinsTextMedium>
              <TouchableOpacity style={{height:30,width:80,alignItems:"center",justifyContent:'center',marginLeft:20,borderRadius:10,backgroundColor:ternaryThemeColor}} onPress={()=>{
                handleImageUpload()
              }}>
                <PoppinsTextMedium style={{color:'white',fontSize:16}} content="Upload"></PoppinsTextMedium>
              </TouchableOpacity>
            </View>
            <View style={{height:150,width:150,borderRadius:75,backgroundColor:'white',alignItems:'center',justifyContent:'center',borderColor:'#DDDDDD',borderWidth:0.6,marginTop:20}}>
            <View style={{height:130,width:130,borderRadius:65 ,backgroundColor:'white',alignItems:'center',justifyContent:'center',borderColor:'#DDDDDD',borderWidth:0.6}}>
              {profileImage!==route.params?.savedImage && <Image style={{height:130,width:130,borderRadius:65,resizeMode:"contain" }} source={{uri:profileImage?.uri}}></Image>}
              {profileImage===route.params?.savedImage && <Image style={{height:130,width:130,borderRadius:65,resizeMode:'contain' }} source={{uri:BaseUrlImages+profileImage}}></Image>}

            </View>
            </View>
            <TouchableOpacity onPress={()=>{
              uploadProfilePicture()
            }} style={{height:40,width:100,backgroundColor:ternaryThemeColor,borderRadius:20,alignItems:'center',justifyContent:"center",marginTop:20}}>
              <PoppinsTextMedium style={{color:'white',fontWeight:'700',fontSize:18}} content="Done"></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>}
      {error && (
            <ErrorModal
              modalClose={modalClose}
              message={message}
              openModal={error}></ErrorModal>
          )}
           {success && (
            <MessageModal
              navigateTo = "Profile"
              modalClose={modalClose}
              title="Success"
              message={message}
              openModal={success}></MessageModal>
          )}
            <View style={{height:'10%',width:'100%',backgroundColor:ternaryThemeColor,alignItems:"center",justifyContent:"flex-start",flexDirection:"row"}}>
            <TouchableOpacity
            style={{height: 20, width: 20,marginLeft:14}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{height: 20, width: 20, resizeMode: 'contain'}}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity>
          <PoppinsTextMedium style={{color:'white',fontWeight:'700',fontSize:16,marginLeft:14}} content="Edit Profile"></PoppinsTextMedium>
            
        </View>
        
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start", backgroundColor:ternaryThemeColor,height:160}}>
       <View style={{backgroundColor:"white",height:110,width:110,borderRadius:50,alignItems:"center",justifyContent:"center",flexDirection:"row",borderWidth:1,borderColor:'#DDDDDD', marginBottom:40, marginLeft:20}}>
       {profileImage!==route.params?.savedImage && profileImage!==null && <Image style={{height:98,width:98,borderRadius:49,resizeMode:"contain" }} source={{uri:profileImage.uri}}></Image>}
              {profileImage===route.params?.savedImage && <Image style={{height:98,width:98,borderRadius:49,resizeMode:"contain" }} source={{uri:BaseUrlImages+profileImage}}></Image>}

       </View>
       <TouchableOpacity onPress={()=>{
        setModalVisible(true)
       }} style={{height:50,width:160,padding:4,backgroundColor:'white',marginLeft:40,borderRadius:30,alignItems:"center",justifyContent:'center', marginBottom:40,}}>
        <PoppinsTextMedium style={{color:ternaryThemeColor,fontWeight:'600',fontSize:14, }} content ="Change Profile Picture"></PoppinsTextMedium>
       </TouchableOpacity>

        </View>
       
        <View style={{height:'60%',width:"100%",borderTopLeftRadius:40,borderTopRightRadius:40,alignItems:"center",justifyContent:"flex-start",backgroundColor:"white",marginTop:20,paddingTop:20}}>
            {/* data goes here */}
            <ScrollView showsVerticalScrollIndicator={false} style={{width:'90%',height:'100%'}}>
{
  
    formFields && formValues && formFields.map((item,index)=>{
      if(item.type==="text")
      {
        if(item.name==="city")
        {
          return(
         
         location &&   <RectanglarUnderlinedTextInput pressedSubmit={pressedSubmit} key ={index} handleData={handleData} label = {item.label} title={item.name} value={location.city}></RectanglarUnderlinedTextInput>
             )
        }
        else if(item.name==="state")
        {
          return(
         
          location &&  <RectanglarUnderlinedTextInput pressedSubmit={pressedSubmit} key ={index} handleData={handleData} label = {item.label} title={item.name} value={location.state}></RectanglarUnderlinedTextInput>
             )
        }
        else if(item.name==="district")
        {
          return(
         
          location &&  <RectanglarUnderlinedTextInput pressedSubmit={pressedSubmit} key ={index} handleData={handleData} label = {item.label} title={item.name} value={location.district}></RectanglarUnderlinedTextInput>
             )
        }
        else if(item.name==="mobile")
        {
          return(
            <DisplayOnlyTextInput
                      key={index}
                      data={formValues[index] === null ? 'No data available' : formValues[index]}
                      title={item.label}
                      photo={require('../../../assets/images/eye.png')}>
                    </DisplayOnlyTextInput>
          )
          
        }
        else if((item.name).toLowerCase()==="pan")
        {
          return(
            <DisplayOnlyTextInput
                      key={index}
                      data={formValues[index] === null ? 'No data available' : formValues[index]}
                      title={item.label}
                      photo={require('../../../assets/images/eye.png')}>
                    </DisplayOnlyTextInput>
          )
          
        }
        else if((item.name).toLowerCase()==="aadhar" || (item.name).toLowerCase() === "addhar"|| (item.name).toLowerCase() === "adhaar")
        {
          return(
            <DisplayOnlyTextInput
                      key={index}
                      data={formValues[index] === null ? 'No data available' : formValues[index]}
                      title={item.label}
                      photo={require('../../../assets/images/eye.png')}>
                    </DisplayOnlyTextInput>
          )
          
        }
        else if(item.name==="pincode")
        {
          return(
         
           location && <PincodeEditProfileTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    handleFetchPincode = {handleFetchPincode}
                    placeHolder={item.name}
                    value={location.postcode}
                    label = {item.label}
                    required = {item.required}
                    maxLength={6}
                    ></PincodeEditProfileTextInput>
          )
        }
        
        else{
          return(
         
            <RectanglarUnderlinedTextInput maxLength = {Number(item.maxLength)} placeHolder={item.label} pressedSubmit={pressedSubmit} key ={index} handleData={handleData} label = {item.label} title={item.name} value={formValues[index]}></RectanglarUnderlinedTextInput>
             )
        }
       
      }
       else if(item.type==="date")
      {
        return(
        <InputDateProfile key ={index} data={formValues[index]} label = {item.label} title={item.name} handleData = {handleData}></InputDateProfile>
    
        )
      }
      else if(item.type==="select")
      {
        return(
          <ProfileDropDown key={index} title={item.name} header={item.label} value={formValues[index]} data={item.options} handleData={handleData}></ProfileDropDown>
    
        )
      }
    })
   


}
</ScrollView>
</View>       
<View style={{height:'10%',width:'100%',backgroundColor:"white",alignItems:'center',justifyContent:"center",marginBottom:20}}>
              <TouchableOpacity onPress={()=>{
                updateProfile()
              }} style={{height:40,width:200,backgroundColor:ternaryThemeColor,borderRadius:4,alignItems:'center',justifyContent:"center"}}>
                <PoppinsTextMedium style={{color:'white',fontWeight:'700',fontSize:16}} content="Update Profile"></PoppinsTextMedium>
              </TouchableOpacity>
            </View>

        
        
        </View>
     


    );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    backgroundColor: 'rgba(52, 52, 52, 0.6)'
  },
  modalView: {
    
    height:'40%',
    width:'90%',
    backgroundColor: 'white',
    borderRadius: 20,
    
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default EditProfile;
