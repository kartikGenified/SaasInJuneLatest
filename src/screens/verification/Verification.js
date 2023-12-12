
import React, {useEffect, useId, useState,useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {useSelector,useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import {BaseUrlImages} from '../../utils/BaseUrlImages';
import { useRedeemGiftsMutation } from '../../apiServices/gifts/RedeemGifts';
import * as Keychain from 'react-native-keychain';
import ErrorModal from '../../components/modals/ErrorModal';
import { useVerifyPanMutation } from '../../apiServices/verification/PanVerificationApi';
import { useSendAadharOtpMutation,useVerifyAadharMutation } from '../../apiServices/verification/AadharVerificationApi';
import { useVerifyGstMutation } from '../../apiServices/verification/GstinVerificationApi';
import SuccessModal from '../../components/modals/SuccessModal';
import MessageModal from '../../components/modals/MessageModal';
import { useUpdateKycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import { setKycCompleted } from '../../../redux/slices/userKycStatusSlice';
import FastImage from 'react-native-fast-image';


const Verification = ({navigation}) => {
  const [kycArray, setKycArray] = useState([])
  const [showPan, setShowPan] = useState(false)
  const [showGst, setShowGst] = useState(false)
  const [showAadhar, setShowAadhar] = useState(false)
  const [showPanProgress, setShowPanProgress] = useState(false)
  const [showGstProgress, setShowGstProgress] = useState(false)
  const [showAadharProgress, setShowAadharProgress] = useState(false)
  const [verified, setVerified] = useState([])
  const [finalPan, setFinalPan] =useState()
  const [finalGst, setFinalGst] = useState()
  const [finalAadhar, setFinalAadhar] = useState()
  const [isManuallyApproved, setIsManuallyApproved] = useState()
  const [verifiedArray, setVerifiedArray] = useState([])
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
  // const [address, setAddress] = useState()
  // const [splitAddress , setSplitAddress] = useState()
  const dispatch = useDispatch()
  const kycOptions =useSelector(
        state => state.apptheme.kycOptions,
      )
  // const userData = useSelector(state=>)
  const userData = useSelector(state=>state.appusersdata.userData)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
      // console.log(kycOptions,userData)
      const manualApproval = useSelector(state => state.appusers.manualApproval)
      const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;

  const width = Dimensions.get('window').width
  let temp = []
  let tempVerification =[]
  

  console.log(userData)
    
useEffect(()=>{
  getVerificationForUser()
  if(manualApproval.includes(userData.user_type))
  {
    setIsManuallyApproved(true)
  }
  else
  {
    setIsManuallyApproved(false)
  }
},[])

const [verifyPanFunc,{
  data:verifyPanData,
  error:verifyPanError,
  isLoading:verifyPanIsLoading,
  isError:verifyPanIsError
}]= useVerifyPanMutation()


const [updateKycStatusFunc,{
  data:updateKycStatusData,
  error:updateKycStatusError,
  isLoading:updateKycStatusIsLoading,
  isError:updateKycStatusIsError
}]= useUpdateKycStatusMutation()



useEffect(()=>{
if(updateKycStatusData)
{
console.log("updateKycStatusData",updateKycStatusData)
if(updateKycStatusData.success)
{
  dispatch(setKycCompleted())
  setSuccess(true)
      setMessage("Kyc Completed")
      console.log("Success")
}
}
else if(updateKycStatusError)
{
console.log("updateKycStatusError",updateKycStatusError)
setError(true)
setMessage("Unable to update kyc status")
}
},[updateKycStatusData,updateKycStatusError])



const [verifyGstFunc,{
  data:verifyGstData,
  error:verifyGstError,
  isLoading:verifyGstIsLoading,
  isError:verifyGstIsError
}]= useVerifyGstMutation()









const showVerificationFields=(arr)=>{
console.log("showVerificationFields",arr)
  if(arr.length>0)
  {
   if(arr[0]==="PAN")
  {
   setShowPan(true)
   setShowPanProgress(true)
  }
  else if(arr[0]==="GSTIN")
  {
   setShowGst(true)
   setShowGstProgress(true)
  }
  else if(arr[0]==="Aadhar")
  {
   setShowAadhar(true)
   setShowAadharProgress(true)
  }
 }
 else{
   console.log("Verification Completed")
 }
  
  }




  // const showAndHideVerificationComponents=(element,tempVerificationArray)=>{
  //   console.log("showAndHideVerificationComponents",element)
  //   console.log("tempVerificationArray", kycArray)
  //    if(kycArray.length!==0)
  //    {
       
  //   const remainingArray = kycArray.filter((item,index)=>{
  //     return item.toLowerCase()!==element.toLowerCase()
  //   })
  //   // setVerified(remainingArray)
  //   showVerificationFields(remainingArray)
  //   console.log("removed element is",element,"remaining array is",remainingArray)
    
  //    }
   
  // }
  
 
  const modalClose = () => {
    setError(false);
    setSuccess(false)
  };

  const handleVerification=(type, value)=>{
   console.log("handleVerification", type,value)
  
    if(type=="aadhar")
    {
      temp.push({"type":"aadhar","value":value})

  //  showAndHideVerificationComponents("Aadhar",tempVerification)
     
    }
    else if(type==="gstin"){
    temp.push({"type":"gstin","value":value})
    // showAndHideVerificationComponents("GSTIN",tempVerification)

    }
    else if(type==="pan")
    {
      temp.push({"type":"pan","value":value})
      // showAndHideVerificationComponents("PAN",tempVerification)

    }
    
    else if(type==="aadhar_details")
    {
      temp.push({"type":"aadhar_details","value":value})
    }
    // setVerifiedArray(temp)
    // console.log("Verification Array",tempVerification)
  
  }

  const handleRegistrationFormSubmission=async()=>{
    console.log("verified array",JSON.stringify(temp))
    
    const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    const inputFormData = {}
    // inputFormData["user_type"] = userData.user_type;
    // inputFormData["user_type_id"] = userData.user_type_id;
    // inputFormData["is_approved_needed"] = isManuallyApproved;
    // inputFormData["name"] = userData.name;
    // inputFormData["mobile"] = userData.mobile;
  
    for(var i =0;i<temp.length;i++)
    {
      console.log("temp",temp[i])
      if(temp[i].type!=="aadhar_details")
      {
      inputFormData[`is_valid_${temp[i].type}`] = true
        
      }
      inputFormData[temp[i].type] = temp[i].value
    }
    const body=inputFormData
    const params = {body:body,id:userData.id}
    // updateProfileFunc(params)
    updateKycStatusFunc(params)
    console.log("responseArray",body)
  }
    
    
  }

  

 

  const getVerificationForUser=()=>{
    const userType = userData.user_type
    const keys = Object.keys(kycOptions)
    const values = Object.values(kycOptions)
    let tempArr=[]
    console.log(keys,values)
    for(var i =0;i<values.length;i++)
    {
      if(values[i].users.includes(userType))
      {
        tempArr.push(keys[i])
      }
    }
    setKycArray(tempArr)
    console.log("tempArr",tempArr)
    tempVerification = [...tempArr]
   for(var i =0;i<tempArr.length;i++)
   {
    if(tempArr[i]==="Aadhar")
    {
        setShowAadhar(true)
    }
    else if(tempArr[i]==="GSTIN")
    {
        setShowGst(true)
    }
    else if(tempArr[i]==="PAN")
    {
      setShowPan(true)
    }
   }
      
    
   
  }

console.log(showAadhar,showPan,showGst)



  const EnterPan=(props)=>{
  const [pan, setPan] = useState("")
  const [name, setName] = useState("")
  useEffect(()=>{
    if(verifyPanData)
    {
    console.log("verifyPanData",verifyPanData)
    if(verifyPanData.success)
    {
      // setName(verifyPanData.body.registered_name)
      // setPan(verifyPanData.body.pan)
     console.log("SUCCESS PAN")
     props.handleVerification("pan",verifyPanData.body.pan)
    }
    }
    else if(verifyPanError)
    {
    console.log("verifyPanError",verifyPanError)
    }
    },[verifyPanData,verifyPanError])
  

  console.log(pan)
    const handlePanInput=(text)=>{

      setPan(text)
      if(text.length===10)
      {
       
      const data={
       
        "pan":text
        }
      verifyPanFunc(data)
      }
    }

    const PANDataBox = ({ panNumber, name }) => {
      return (
        <View
          style={{
            width: '90%',
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: ternaryThemeColor, // Make sure "ternaryThemeColor" is defined
            borderRadius: 5,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 10,
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <PoppinsTextMedium content="PAN Number : " style={{ fontWeight: '700', color: '#919191', fontSize: 14 }}></PoppinsTextMedium>
            <PoppinsTextMedium content={panNumber} style={{ fontWeight: '600', color: '#919191', fontSize: 14, marginLeft: 10 }}></PoppinsTextMedium>
          </View>
          <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
            <PoppinsTextMedium content="Name : " style={{ fontWeight: '700', color: '#919191', fontSize: 14 }}></PoppinsTextMedium>
            <PoppinsTextMedium content={name} style={{ fontWeight: '600', color: '#919191', fontSize: 14 }}></PoppinsTextMedium>
          </View>
        </View>
      );
    };
    
    return(
      <View style={{
        width:'100%',alignItems:'center',justifyContent:'center',marginTop:20
      }}>
         <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
          <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
          <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Enter Pan Number" > </PoppinsTextMedium>
          </View>
          <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
          <TextInput maxLength={10} value={pan ? pan:verifyPanData?.body?.pan} onChangeText={(text)=>{handlePanInput(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20,color:'black'}} placeholder='DBJUU1234'></TextInput>
         {verifyPanData &&  <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
          <Image style={{height:22,width:22,resizeMode:'contain'}} source={require('../../../assets/images/tickBlue.png')}></Image>
          </View>}
          {verifyPanIsLoading && <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
             <FastImage
          style={{ width:20,height:20,alignItems:'center',justifyContent:'center',}}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        </View>
          }
          </View>
         
        </View>
         <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
          <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
          <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Enter Your Name" > </PoppinsTextMedium>
          </View>
          <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
          <TextInput value={name!=="" ? name : verifyPanData?.body?.registered_name } onChangeText={(text)=>{setName(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20,color:'black'}} placeholder='Enter Your Name'></TextInput>
          
          </View>
         
        </View>
       
       {verifyPanData && <PANDataBox name={verifyPanData.body.registered_name} panNumber={verifyPanData.body.pan}></PANDataBox>}
      </View>
    )
  }
  
  const EnterGst=(props)=>{
    const [businessName, setBusinessName] = useState("")
    const [gstin, setGstin] = useState("")
  
    useEffect(()=>{
      if(verifyGstData)
      {
      console.log("verifyGstData",verifyGstData)
      if(verifyGstData.success)
      {
        
        props.handleVerification("gstin",verifyGstData.body.GSTIN)
      console.log("SUCCESS GST")
      }
      
      }
      else if(verifyGstError)
      {
      console.log("verifyGstError",verifyGstError)
      }
      },[verifyGstData,verifyGstError])
  
     const handleGstInput=(text)=>{
        setGstin(text)
        if(text.length===15)
        {
          const data = {
            "gstin":text,
            // "business_name":"TEst"
        }
        verifyGstFunc(data)
          
        }
      }

      const GSTDataBox = ({ gstin, businessName }) => {
        return (
          <View
            style={{
              width: '90%',
              borderStyle:'dashed',
              borderWidth: 1,
              borderColor: ternaryThemeColor,
              borderRadius: 5,
             flexWrap:'wrap',
             alignItems:"flex-start",
             justifyContent:"center",
             padding:10,
             marginTop:10,
             marginBottom:20

             
             
            }}
          >
            <View style={{flexDirection:"row",width:'100%' }}>
              <PoppinsTextMedium content="GSTIN:" style={{ fontWeight: '700',color:'#919191',fontSize:14 }}></PoppinsTextMedium>
              <PoppinsTextMedium style={{fontWeight: '600',color:'#919191',fontSize:14,marginLeft:10}} content={gstin}></PoppinsTextMedium>
            </View>
            <View style={{ flexDirection:"row",width:'100%',marginTop:10}}>
              <PoppinsTextMedium content="Business Name:" style={{ fontWeight: '700',color:'#919191',fontSize:14 }}></PoppinsTextMedium>
              <PoppinsTextMedium style={{fontWeight: '600',color:'#919191',fontSize:14,width:200}} content={businessName}></PoppinsTextMedium>
            </View>
          </View>
        );
      };
      return(
        <View style={{
          width:'100%',alignItems:'center',justifyContent:'center',marginTop:20
        }}>
          <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
            <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Enter GSTIN" > </PoppinsTextMedium>
            </View>
            <View style={{alignItems:"center",justifyContent:'center',flexDirection:"row",width:'100%',height:40}}>
            <TextInput maxLength={15} value={gstin ? gstin : verifyGstData?.body?.GSTIN} onChangeText={(text)=>{handleGstInput(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='Enter GSTIN'></TextInput>
            <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
            {verifyGstData && <Image style={{height:22,width:22,resizeMode:'contain'}} source={require('../../../assets/images/tickBlue.png')}></Image>}
            
             {verifyGstIsLoading && <FastImage
          style={{ width:20,height:20,alignItems:'center',justifyContent:'center',}}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
       
          }
            </View>
            </View>
           
          </View>
           <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
            <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Business Name" > </PoppinsTextMedium>
            </View>
            <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
            <TextInput value={verifyGstData ? verifyGstData.body.legal_name_of_business:businessName} onChangeText={(text)=>{handleGstInput(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='Business Name'></TextInput>
            
            </View>
           
          </View>
          
         {verifyGstData && <GSTDataBox businessName={verifyGstData.body.legal_name_of_business} gstin={verifyGstData.body.GSTIN}></GSTDataBox>}
        </View>
      )
    }

  const EnterAadhar=(props)=>{
    const [aadhar, setAadhar] = useState("")
    const [otp, setOtp] = useState("")
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false)
    const inpref = useRef(null)
    const [sendAadharOtpFunc,{
      data:sendAadharOtpData,
      error:sendAadharOtpError,
      isLoading:sendAadharOtpIsLoading,
      isError:sendAadharOtpIsError
    }]= useSendAadharOtpMutation()
    const [verifyAadharFunc,{
      data:verifyAadharData,
      error:verifyAadharError,
      isLoading:verifyAadharIsLoading,
      isError:verifyAadharIsError
    }]= useVerifyAadharMutation()
    useEffect(()=>{
      if(verifyAadharData)
      {
        console.log("verifyAadharData",verifyAadharData)
        if(verifyAadharData.success)
        {
          const aadhar_details = {
            "address" : verifyAadharData.body.address,
            "split_address" : verifyAadharData.body.split_address
        }
        const gender = verifyAadharData.body.gender
        const dob = verifyAadharData.body.dob
      console.log("SUCCESS AADHAAR")  
      props.handleVerification("gender",gender)
      props.handleVerification("dob",dob)
      props.handleVerification("aadhar",aadhar)
      props.handleVerification("aadhar_details",aadhar_details)
      
      

        }
      }
      else if(verifyAadharError){
        console.log("verifyAadharError",verifyAadharError)
        setError(true)
    setMessage(verifyAadharError.data.Error.message)
      }
      },[verifyAadharError,verifyAadharData])

    useEffect(()=>{
    if(sendAadharOtpData)
    {
    console.log("sendAadharOtpData",sendAadharOtpData)
    // setRefId(sendAadharOtpData.body.ref_id)
    if(sendAadharOtpData.success)
    {
      setAadhaarOtpSent(true)
      console.log("otp sent")
      

    }
    }
    else if(sendAadharOtpError)
    {
    console.log("sendAadharOtpError",sendAadharOtpError)
    setError(true)
    setMessage(sendAadharOtpError.data.Error.message)
    }
    },[sendAadharOtpData,sendAadharOtpError])
    
    //  useEffect(()=>{
    //   console.log("aadhaar",aadhar)

     
      
    //  },[aadhar])
      

     const handleAadhaar=(text)=>{
      // setFinalAadhar(aadhar)
      setAadhar(text)
      if(text.length===12)
      {
        
        const data = {
          "aadhaar_number":text
      }
      sendAadharOtpFunc(data)
        console.log(data)
       
      }
     }

    //  useEffect(()=>{
   
    //  },[otp])
    const handleOtpInput=(text)=>{
      setOtp(text)
   if(text.length===6)
      {
        handleOtp(text)
      }
    }

     const handleOtp=(otp)=>{
      const data={
        "ref_id":sendAadharOtpData?.body.ref_id,
      "otp":otp
      }
      verifyAadharFunc(data)
    }
       
      const AadharDataBox = ({ dob, name,gender,address }) => {
        return (
          <View
            style={{
              width: '90%',
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: ternaryThemeColor, 
              borderRadius: 5,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: 10,
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <PoppinsTextMedium content="Name :" style={{ fontWeight: '700', color: '#919191', fontSize: 14 }}></PoppinsTextMedium>
              <PoppinsTextMedium  content ={name} style={{ fontWeight: '600', color: '#919191', fontSize: 14, marginLeft: 10 }}></PoppinsTextMedium>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
              <PoppinsTextMedium content="DOB :" style={{ fontWeight: '700', color: '#919191', fontSize: 14 }}></PoppinsTextMedium>
              <PoppinsTextMedium content={dob} style={{ fontWeight: '600', color: '#919191', fontSize: 14, marginLeft: 10}}></PoppinsTextMedium>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
              <PoppinsTextMedium content="Gender :" style={{ fontWeight: '700', color: '#919191', fontSize: 14 }}></PoppinsTextMedium>
              <PoppinsTextMedium content={gender} style={{ fontWeight: '600', color: '#919191', fontSize: 14, marginLeft: 10}}></PoppinsTextMedium>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
              <PoppinsTextMedium content="Address:" style={{ fontWeight: '700', color: '#919191', fontSize: 14 }}></PoppinsTextMedium>
              <PoppinsTextMedium content= {address}style={{ fontWeight: '600', color: '#919191', fontSize: 14,width:width-100 }}></PoppinsTextMedium>
            </View>
          </View>
        );
      };
      
      return(
        <View style={{
          width:'100%',alignItems:'center',justifyContent:'center',marginTop:20
        }}>
           
          <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
            <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Enter Aadhar Number" > </PoppinsTextMedium>
            </View>
            <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
            <TextInput ref={inpref} maxLength={12} value={ aadhar} onChangeText={(text)=>{
              handleAadhaar(text)
            }} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20,color:"black"}} placeholderTextColor="black" placeholder='Enter Aadhar Number'></TextInput>
            {verifyAadharData && <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
            <Image style={{height:22,width:22,resizeMode:'contain'}} source={require('../../../assets/images/tickBlue.png')}></Image>
            </View>}
            {sendAadharOtpIsLoading && <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
             <FastImage
          style={{ width:20,height:20,alignItems:'center',justifyContent:'center',}}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        </View>
          }
            </View>
           
          </View>
         {aadhaarOtpSent && <View style={{alignItems:'flex-start',justifyContent:'center',width:'100%'}}>
            <PoppinsTextMedium style={{color:ternaryThemeColor,fontWeight:'700', fontSize:16,marginLeft:30,marginTop:10}} content="OTP Sent"></PoppinsTextMedium>
          </View>}
          <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
            <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Enter OTP" > </PoppinsTextMedium>
            </View>
            <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
            <TextInput textContentType='oneTimeCode' value={otp} onChangeText={(text)=>{
              handleOtpInput(text)
            }} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20,color:'black'}} placeholderTextColor="black" placeholder='Enter OTP'></TextInput>
            {verifyAadharIsLoading && <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
             <FastImage
          style={{ width:20,height:20,alignItems:'center',justifyContent:'center',}}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        </View>
          }
            </View>
           
          </View>
         {verifyAadharData && <AadharDataBox dob={verifyAadharData.body.dob} name={verifyAadharData.body.name} gender={verifyAadharData.body.gender} address={verifyAadharData.body.address}></AadharDataBox>}
        </View>
      )
    }

  const KycProgress=(props)=>{

    const showPan = props.showPan
    const showAadhar = props.showAadhar
    const showGst = props.showGst
    console.log(kycArray.length)
    const Circle=(props)=>{
      const completed = props.completed
      const color= completed ? 'yellow': 'white'
      const title = props.title
      const index = props.index
      const data = props.data
      const length = data?.length
      const margin =index === 0 ? 0 : 100/length

      console.log("margin ",margin*index," at index ", index,margin,length )
      return(
        <View style={{alignItems:"center",justifyContent:'center'}}>
          <View style={{height:26,width:26,borderRadius:13,backgroundColor:color,alignItems:'center',justifyContent:'center'}}>
          {completed && <Image source={require('../../../assets/images/tickBlue.png')} style={{height:20,width:20,resizeMode:'center'}}></Image>}
        </View>
        <PoppinsTextMedium style={{color:'white',fontSize:12,marginTop:4}} content ={(title).toUpperCase()}></PoppinsTextMedium>
        </View>
      )
    }

    return(
      <View style={{alignItems:'center',justifyContent:"center",width:"100%"}}>
        <View style={{height:'10%',width:'100%',alignItems:'center',justifyContent:'center'}}>
        {kycArray.length!==0 && <View style={{height:2,width:'80%',backgroundColor:'white'}}></View>}
        <View style={{width: '90%',justifyContent:'space-between',flexDirection:'row'}}>
          {
            kycArray && kycArray.map((item,index)=>{
              return(
                <Circle data = {kycArray} key={index} completed={item === "PAN" ? showPan : item === "GSTIN" ? showGst : showAadhar } title={item} index={index}></Circle>
              )
            })
          }
          {
               
                kycArray.length==1 &&  <Circle key={1} data = {kycArray} completed={true } title="Complete" index={1}></Circle>
          }
          {/* <Circle key={} completed={true } title="Complete" index={3}></Circle> */}
        </View>
        </View>        
      </View>
    )
  }
  
  
  
 
  
    return (
        <View style={{alignItems:"center",justifyContent:'flex-start',backgroundColor:ternaryThemeColor,width:'100%',height:'100%'}}>
            <View style={{width:'100%',height:40,alignItems:"flex-start",justifyContent:'center',marginTop:10}}>
              <TouchableOpacity style={{marginLeft:20}} onPress={()=>{navigation.goBack()}}>
                <Image style={{height:20,width:20,resizeMode:'contain',transform:[{rotate:'180deg'}]}} source={require('../../../assets/images/whiteArrowRight.png')}></Image>
              </TouchableOpacity>
            </View>
            <KycProgress showPan={true} showAadhar={true} showGst={true}></KycProgress>
            <ScrollView style={{width:'100%',height:'90%',backgroundColor:'white',marginTop:20}}>
            {error && (
            <ErrorModal
              modalClose={modalClose}
              message={message}
              openModal={error}
              navigateTo="Verification"></ErrorModal>
          )}
          {success && (
            <MessageModal
              modalClose={modalClose}
              message={message}
              openModal={success}
              navigateTo="Dashboard"
              ></MessageModal>
          )}
            <View style={{width:'100%',height:'90%',backgroundColor:'white',alignItems:'center',justifyContent:"center",marginTop:20}}>
            {showPan  && <EnterPan handleVerification={handleVerification} ></EnterPan>}
            {showAadhar && <EnterAadhar handleVerification={handleVerification} ></EnterAadhar>}
            {showGst  && <EnterGst handleVerification={handleVerification} ></EnterGst>}
            <TouchableOpacity style ={{backgroundColor:ternaryThemeColor, height:50,width:200,borderRadius:4,marginTop:20, alignItems:'center', justifyContent:'center'}} onPress={()=>{
              handleRegistrationFormSubmission()
          //     console.log(verified[1])
          // if(verified[1].toLowerCase()==="pan")
          // {
          // showAndHideVerificationComponents(verified[0])
          //   setShowPan(true)
          //   setShowAadhar(false)
          //   setShowGst(false)
          // }
          // else if(verified[1].toLowerCase()==="gst")
          // {
          // showAndHideVerificationComponents(verified[0])
          //   setShowAadhar(false)
          //   setShowPan(false)
          //   setShowGst(true)
          // }
          // else if(verified[1].toLowerCase()==="aadhar")
          // {
          // showAndHideVerificationComponents(verified[0])
          //   setShowGst(false)
          //   setShowPan(false)
          //   setShowAadhar(true)
          // }
          
        }}>
          
          <PoppinsTextMedium style={{alignSelf:'center', fontWeight:'bold', fontSize:20, color:'white'}} content={"Proceed"}></PoppinsTextMedium>
        </TouchableOpacity>
        </View>
        
        </ScrollView>
        
           
        </View>
    );
}

const styles = StyleSheet.create({})

export default Verification;