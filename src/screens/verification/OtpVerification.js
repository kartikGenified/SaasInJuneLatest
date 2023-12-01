import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Text
} from "react-native";
import { useGetLoginOtpMutation } from "../../apiServices/login/otpBased/SendOtpApi";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";
import TextInputRectangularWithPlaceholder from "../../components/atoms/input/TextInputRectangularWithPlaceholder";
import OtpInput from "../../components/organisms/OtpInput";
import { useVerifyOtpForNormalUseMutation } from "../../apiServices/otp/VerifyOtpForNormalUseApi";
import * as Keychain from 'react-native-keychain';
import { useRedeemGiftsMutation } from "../../apiServices/gifts/RedeemGifts";
import { useRedeemCashbackMutation } from "../../apiServices/cashback/CashbackRedeemApi";
import { useGetLoginOtpForVerificationMutation } from "../../apiServices/otp/GetOtpApi";

const OtpVerification = ({navigation,route}) => {
  const [message, setMessage] = useState();
  const [otp, setOtp] = useState()
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobile, setMobile] = useState();
  const [showRedeemButton,setShowRedeemButton] = useState(false)
  const pointsConversion = useSelector(state=>state.redemptionData.pointConversion)
  const cashConversion = useSelector(state=>state.redemptionData.cashConversion)
console.log("Point conversion and cash conversion data",pointsConversion,cashConversion)
  const [
    verifyOtpForNormalUseFunc,
    {
      data: verifyOtpForNormalUseData,
      error: verifyOtpForNormalUseError,
      isLoading: verifyOtpForNormalUseIsLoading,
      isError: verifyOtpForNormalUseIsError,
    },
  ] = useVerifyOtpForNormalUseMutation();
  
  const [redeemGiftsFunc, {
    data: redeemGiftsData,
    error: redeemGiftsError,
    isLoading: redeemGiftsIsLoading,
    isError: redeemGiftsIsError
  }] = useRedeemGiftsMutation()
  const [
    redeemCashbackFunc,
    {
      data: redeemCashbackData,
      error: redeemCashbackError,
      isLoading: redeemCashbackIsLoading,
      isError: redeemCashbackIsError,
    },
  ] = useRedeemCashbackMutation();

  const [
    getOtpforVerificationFunc,
    {
      data: getOtpforVerificationData,
      error: getOtpforVerificationError,
      isLoading: getOtpforVerificationIsLoading,
      isError: getOtpforVerificationIsError,
    },
  ] = useGetLoginOtpForVerificationMutation();
  
  const type = route.params.type
  
  useEffect(()=>{
    if(redeemCashbackData)
    {
        console.log("redeemCashbackData",redeemCashbackData)
        setSuccess(true)
        setMessage(redeemCashbackData.message)
    }
    else if(redeemCashbackError){
      console.log("redeemCashbackError",redeemCashbackError)

      if(redeemCashbackError.status=="409")
      {
        // navigation.navigate("BasicInfo",{
        //   "userType":userData.user_type,
        //   "userTypeId":userData.user_type_id
        // })
        setError(true)
        setMessage("Kindly Complete")
      }
      else{
        setError(true)
        setMessage(redeemCashbackError.data.message)
      }
        
    }
  },[redeemCashbackData,redeemCashbackError])
  useEffect(() => {
    if (verifyOtpForNormalUseData) {
      console.log("Verify Otp", verifyOtpForNormalUseData)
      if (verifyOtpForNormalUseData.success) {
        
       
      }
    } else if (verifyOtpForNormalUseError) {
      console.log("verifyOtpForNormalUseError", verifyOtpForNormalUseError)
      setError(true)
      setMessage("Please Enter The Correct OTP")
      
    }
  }, [verifyOtpForNormalUseData, verifyOtpForNormalUseError]);

  useEffect(() => {
    if (redeemGiftsData) {
      console.log("redeemGiftsData", redeemGiftsData)
      setSuccess(true)
      setMessage(redeemGiftsData.message)
    }
    else if (redeemGiftsError) {
      console.log("redeemGiftsError", redeemGiftsError)
      setMessage(redeemGiftsError.data.message)
      setError(true)
    }
  }, [redeemGiftsError, redeemGiftsData])

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const cart = useSelector((state) => state.cart.cart);
    const address = useSelector(state=>state.address.address)
  const userData = useSelector((state) => state.appusersdata.userData);

  console.log("cart and address", cart,address);
  useEffect(() => {
    if (getOtpforVerificationData) {
      console.log("getOtpforVerificationData", getOtpforVerificationData);
      
    } else if (getOtpforVerificationError) {
      console.log("getOtpforVerificationError", getOtpforVerificationError);
    }
  }, [getOtpforVerificationData, getOtpforVerificationError]);

  

  const getOtpFromComponent = (value) => {
    if (value.length === 6) {
      setOtp(value)
      console.log("From Verify Otp", value);
      setShowRedeemButton(true)
      handleOtpSubmission(value)
    }
  };

  const handleOtpSubmission=(otp)=>{
    const mobile = userData.mobile;
      const name = userData.name;
      const user_type_id = userData.user_type_id;
      const user_type = userData.user_type;
      
      verifyOtpForNormalUseFunc({ mobile, name, otp, user_type_id, user_type });
      
  }
  const modalClose = () => {
    setError(false);
    setSuccess(false)
  };
  const finalGiftRedemption=async()=>{
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username
    if(type==="Gift")
    {
      let tempID = []
    cart && cart.map((item, index) => {
      tempID.push(((item.gift_id)))
    })
    console.log("tempID", tempID)

      const data = {
        "user_type_id": String(userData.user_type_id),
        "user_type": userData.user_type,
        "platform_id": 1,
        "platform": "mobile",
        "gift_ids": tempID,
        "approved_by_id": "1",
        "app_user_id": String(userData.id),
        "remarks": "demo",
        "type": "point",
        "address_id": address.data.id
      }
      const params = {
        token: token,
        data: data
      }
      redeemGiftsFunc(params)
    
    }
    else if(type==="Cashback"){
      const params = {
        data :{ user_type_id: userData.user_type_id,
         user_type: userData.user_type,
         platform_id: 1,
         platform: 'mobile',
         points: Number(pointsConversion),
         approved_by_id: 1,
         app_user_id: userData.id,
         remarks: 'demo'},
         token:token
       };
       redeemCashbackFunc(params)
       console.log("params",params)
    }
  }

  }

  const handleOtpResend=()=>{
    handleOtpSubmission(otp)
    setShowRedeemButton(false)
  }
  const getMobile = (data) => {
    console.log("mobile number from mobile textinput", data)
    setMobile(data);
    if (data !== undefined) {
      if (data.length === 10) {
        const user_type = userData.user_type;
        const user_type_id = userData.user_type_id;
        const name = userData.name;
        const params = {
          mobile: data,
          name: name,
          user_type: user_type,
          user_type_id: user_type_id,
        };
        getOtpforVerificationFunc(params);

        Keyboard.dismiss();
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          height: "10%",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          marginBottom: 20,
          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{ height: 20, width: 20, marginLeft: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextMedium
          style={{ fontSize: 20, color: "#ffffff", marginLeft: 10 }}
          content={"Verify OTP"}
        ></PoppinsTextMedium>

        {error && (
          <ErrorModal
            modalClose={modalClose}
            message={message}
            openModal={error}
          ></ErrorModal>
        )}
        {success && (
          <MessageModal
            modalClose={modalClose}
            title={"Thanks"}
            message={message}
            openModal={success}
            navigateTo="RedeemedHistory"
          ></MessageModal>
        )}
      </View>
      <View style={{alignItems:'center',justifyContent:"center",width:'100%',backgroundColor:ternaryThemeColor,padding:20,marginBottom:60,marginTop:20}}>
        <PoppinsTextMedium style={{color:'white',fontSize:16}} content="OTP has been sent to your registered mobile number"></PoppinsTextMedium>
      </View>
      <TextInputRectangularWithPlaceholder
        placeHolder="Mobile No"
        handleData={getMobile}
        maxLength={10}
        editable = {false}
        value={userData.mobile}
      ></TextInputRectangularWithPlaceholder>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OtpInput
          getOtpFromComponent={getOtpFromComponent}
          color={"white"}
        ></OtpInput>
        <PoppinsTextMedium content = "Enter OTP" style={{color:'black',fontSize:20,fontWeight:'800'}}></PoppinsTextMedium>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop:10
          }}>
          <PoppinsTextMedium
            style={{ fontSize: 14, color: 'black' }}
            content="Didn't you recieve the OTP?"></PoppinsTextMedium>
          <Text
            style={{
              color: ternaryThemeColor,
              fontSize: 14,
              marginLeft: 4,
              fontWeight: '800',
            }}
            onPress={() => {
              handleOtpResend();
            }}>
            Resend
          </Text>
        </View>

      </View>
      {showRedeemButton && <View style={{alignItems:'center',justifyContent:'center',width:'100%',position: 'absolute',bottom:20}}>
        <TouchableOpacity onPress={()=>{
          finalGiftRedemption()
        }} style={{height:50,width:140,alignItems:'center',justifyContent:'center',backgroundColor:ternaryThemeColor,borderRadius:4}}>
          <PoppinsTextMedium content = "Redeem" style ={{color:'white',fontSize:20,fontWeight:'700'}}></PoppinsTextMedium>
        </TouchableOpacity>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({});

export default OtpVerification;
