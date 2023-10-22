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
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import {BaseUrlImages} from '../../utils/BaseUrlImages';
import { useRedeemGiftsMutation } from '../../apiServices/gifts/RedeemGifts';
import * as Keychain from 'react-native-keychain';
import ErrorModal from '../../components/modals/ErrorModal';
import { useVerifyPanMutation } from '../../apiServices/verification/PanVerificationApi';
import { useSendAadharOtpMutation,useVerifyAadharMutation } from '../../apiServices/verification/AadharVerificationApi';
import { useVerifyGstMutation } from '../../apiServices/verification/GstinVerificationApi';
import { useUpdateProfileMutation } from '../../apiServices/profile/profileApi';
import SuccessModal from '../../components/modals/SuccessModal';
import MessageModal from '../../components/modals/MessageModal';

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

  const width = Dimensions.get('window').width
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

const [updateProfileFunc,{
  data:updateProfileData,
  error:updateProfileError,
  isError:updateProfileIsError,
  isLoading:updateProfileIsLoading
}] = useUpdateProfileMutation()

useEffect(()=>{
if(verifyPanData)
{
console.log("verifyPanData",verifyPanData)
if(verifyPanData.success)
{
  let temp = [...verifiedArray]
  showAndHideVerificationComponents("PAN")
  temp.push({"type":"pan","value":finalPan})
  setVerifiedArray(temp)
}
}
else if(verifyPanError)
{
console.log("verifyPanError",verifyPanError)
}
},[verifyPanData,verifyPanError])

const [verifyGstFunc,{
  data:verifyGstData,
  error:verifyGstError,
  isLoading:verifyGstIsLoading,
  isError:verifyGstIsError
}]= useVerifyGstMutation()

useEffect(()=>{
if(verifyGstData)
{
console.log("verifyGstData",verifyGstData)
if(verifyGstData.success)
{
  
showAndHideVerificationComponents("GSTIN")
let temp = [...verifiedArray]
  
  temp.push({"type":"gst","value":finalGst})
  setVerifiedArray(temp)
}

}
else if(verifyGstError)
{
console.log("verifyGstError",verifyGstError)
}
},[verifyGstData,verifyGstError])

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
if(sendAadharOtpData)
{
console.log("sendAadharOtpData",sendAadharOtpData)
// setRefId(sendAadharOtpData.body.ref_id)
if(sendAadharOtpData.success)
{
  const data={
    "ref_id":sendAadharOtpData.body.ref_id,
  "otp":"111000"
  }
  verifyAadharFunc(data)
}
}
else if(sendAadharOtpError)
{
console.log("sendAadharOtpError",sendAadharOtpError)
}
},[sendAadharOtpData,sendAadharOtpError])
useEffect(()=>{
  if(updateProfileData)
  {
    console.log("updateProfileData",updateProfileData)
    if(updateProfileData.success)
    {
      setSuccess(true)
      setMessage("Kyc Completed")
      console.log("Success")
    }
  }
  else if(updateProfileError){
    console.log("updateProfileError",updateProfileError)
    setError(true)
    setMessage("Kyc Failed")
  }
  },[updateProfileError,updateProfileData])

useEffect(()=>{
if(verifyAadharData)
{
  console.log("verifyAadharData",verifyAadharData)
  if(verifyAadharData.success)
  {
  //  showAndHideVerificationComponents("Aadhar")
  let temp = [...verifiedArray]
  
  temp.push({"type":"aadhar","value":finalAadhar})
  setVerifiedArray(temp)
  }
}
else if(verifyAadharError){
  console.log("verifyAadharError",verifyAadharError)
}
},[verifyAadharError,verifyAadharData])


  const showAndHideVerificationComponents=(element)=>{
    const temp = [...verified]
    const remainingArray = temp.filter((item,index)=>{
      return item.toLowerCase()!==element.toLowerCase()
    })
    setVerified(remainingArray)
    console.log("removed element is",element,"remaining array is",temp)
  }
  
  useEffect(()=>{
   
   if(verified[0]==="PAN")
   {
    setShowPan(true)
    setShowPanProgress(true)
   }
   else if(verified[0]==="GSTIN")
   {
    setShowGst(true)
    setShowGstProgress(true)
   }
   else if(verified[0]==="Aadhar")
   {
    setShowAadhar(true)
    setShowAadharProgress(true)
   }
  },[verified])

  const modalClose = () => {
    setError(false);
    setSuccess(false)
  };

  const handleRegistrationFormSubmission=async()=>{
    console.log("verified array",JSON.stringify(verifiedArray))
    const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    const inputFormData = {}
    inputFormData["user_type"] = userData.user_type;
    inputFormData["user_type_id"] = userData.user_type_id;
    inputFormData["is_approved_needed"] = isManuallyApproved;
    inputFormData["name"] = userData.name;
    inputFormData["mobile"] = userData.mobile;
  
    for(var i =0;i<verifiedArray.length;i++)
    {
      console.log(verifiedArray[i])
      inputFormData[verifiedArray[i].type] = verifiedArray[i].value
    }
    const body=inputFormData
    const params = {data:body,token:token}
    updateProfileFunc(params)
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
    setVerified(tempArr)

  }

console.log(showAadhar,showPan,showGst)



  const EnterPan=(props)=>{
  const [pan, setPan] = useState("")
  const [name, setName] = useState("")

  

  console.log(pan)
    useEffect(()=>{
      if(pan.length===10)
      {

      //   const data = {
      //     "name":name,
      //   "pan":pan
      // }
      setFinalPan(pan)
      const data={
        "name":"Test2",
        "pan":"AMJCL2021N"
        }
      verifyPanFunc(data)
      console.log(pan)
      setPan(pan)
        
      }
    },[pan])
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
          <View style={{alignItems:"center",justifyContent:'center',flexDirection:"row",width:'100%',height:40}}>
          <TextInput maxLength={10} value={pan ? pan:finalPan} onChangeText={(text)=>{setPan(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='DBJUU1234'></TextInput>
          <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
          <Image style={{height:22,width:22,resizeMode:'contain'}} source={require('../../../assets/images/tickBlue.png')}></Image>
          </View>
          </View>
         
        </View>
         <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
          <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
          <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Enter Your Name" > </PoppinsTextMedium>
          </View>
          <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
          <TextInput value={verifyPanData ? verifyPanData.body.name_provided : name} onChangeText={(text)=>{setName(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='Enter Your Name'></TextInput>
          
          </View>
         
        </View>
       
       {verifyPanData && <PANDataBox name={verifyPanData.body.name_provided} panNumber={verifyPanData.body.pan}></PANDataBox>}
      </View>
    )
  }
  
  const EnterGst=(props)=>{
    const [businessName, setBusinessName] = useState("")
    const [gstin, setGstin] = useState("")
  
    
  
      useEffect(()=>{
        if(gstin.length===15)
        {
          setFinalGst(gstin)
          const data = {
            "gstin":"29AAICP2912R1ZR",
    "business_name":"TEst"
        }
        verifyGstFunc(data)
          console.log(data)
        }
      },[gstin])

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
            <TextInput maxLength={15} value={gstin ? gstin : finalGst} onChangeText={(text)=>{setGstin(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='Enter GSTIN'></TextInput>
            <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
            {verifyGstData && <Image style={{height:22,width:22,resizeMode:'contain'}} source={require('../../../assets/images/tickBlue.png')}></Image>}
            </View>
            </View>
           
          </View>
           <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
            <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Business Name" > </PoppinsTextMedium>
            </View>
            <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
            <TextInput value={verifyGstData ? verifyGstData.body.legal_name_of_business:businessName} onChangeText={(text)=>{setBusinessName(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='Business Name'></TextInput>
            
            </View>
           
          </View>
          
         {verifyGstData && <GSTDataBox businessName={verifyGstData.body.legal_name_of_business} gstin={verifyGstData.body.GSTIN}></GSTDataBox>}
        </View>
      )
    }

  const EnterAadhar=(props)=>{
    const [aadhar, setAadhar] = useState("")
    const [otp, setOtp] = useState("")
    const inpref = useRef(null)
    
    
     useEffect(()=>{
      if(aadhar.length===12)
      {
        setFinalAadhar(aadhar)
        const data = {
          "aadhaar_number":"655675523712"
      }
      sendAadharOtpFunc(data)
        console.log(data)
       
      }
      
    
     },[aadhar])
      
       
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
            <View style={{alignItems:"center",justifyContent:'center',flexDirection:"row",width:'100%',height:40}}>
            <TextInput ref={inpref} maxLength={12} value={aadhar ? aadhar :finalAadhar} onChangeText={(text)=>{setAadhar(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='Enter Aadhar Number'></TextInput>
            <View style={{width:'14%',height:40,alignItems:'center',justifyContent:'center',}}>
            <Image style={{height:22,width:22,resizeMode:'contain'}} source={require('../../../assets/images/tickBlue.png')}></Image>
            </View>
            </View>
           
          </View>
          <View style={{height:70,width:'90%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"flex-start",marginTop:20}}>
            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"white",bottom:10,left:20}}>
            <PoppinsTextMedium style={{color:'#919191',fontSize:16,marginLeft:4,marginRight:4}} content="Enter OTP" > </PoppinsTextMedium>
            </View>
            <View style={{alignItems:"center",justifyContent:'flex-start',flexDirection:"row",width:'100%',height:40}}>
            <TextInput textContentType='oneTimeCode' value={otp} onChangeText={(text)=>{setOtp(text)}} style={{alignItems:'center',justifyContent:'center',width:'82%',height:40,fontSize:16,letterSpacing:1,marginLeft:20}} placeholder='Enter OTP'></TextInput>
            
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

    const Circle=(props)=>{
      const completed = props.completed
      const color= completed ? 'yellow': 'white'
      const title = props.title
      const index = props.index
      const margin =index === 1 ? 0 : index === 2 && kycArray.length===2 ? 80 : 100/(kycArray.length)
      console.log(margin)
      return(
        <View style={{alignItems:"center",justifyContent:'center',marginLeft:`${margin}%`}}>
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
        <View style={{flexDirection:'row',width: '90%',left:4}}>
          {
            kycArray && kycArray.map((item,index)=>{
              return(
                <Circle key={index} completed={item === "PAN" ? showPan : item === "GSTIN" ? showGst : showAadhar } title={item} index={index+1}></Circle>
              )
            })
          }
         

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
            <KycProgress showPan={showPanProgress} showAadhar={showAadharProgress} showGst={showGstProgress}></KycProgress>
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
              navigateTo="RedeemedHistory"
              ></MessageModal>
          )}
            <View style={{width:'100%',height:'90%',backgroundColor:'white',alignItems:'center',justifyContent:"center",marginTop:20}}>
            {showPan  && <EnterPan showAndHideVerificationComponents={showAndHideVerificationComponents}></EnterPan>}
            {showAadhar && <EnterAadhar showAndHideVerificationComponents={showAndHideVerificationComponents}></EnterAadhar>}
            {showGst  && <EnterGst showAndHideVerificationComponents={showAndHideVerificationComponents}></EnterGst>}
            <TouchableOpacity style ={{backgroundColor:ternaryThemeColor, height:50,width:200,borderRadius:4,marginTop:20}} onPress={()=>{
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
        }}></TouchableOpacity>
        </View>
        
        </ScrollView>
        
           
        </View>
    );
}

const styles = StyleSheet.create({})

export default Verification;
