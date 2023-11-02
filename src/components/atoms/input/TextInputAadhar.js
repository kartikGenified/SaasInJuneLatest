import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,Modal,Pressable,Text,Image} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useSendAadharOtpMutation } from '../../../apiServices/verification/AadharVerificationApi';
import { useVerifyAadharMutation } from '../../../apiServices/verification/AadharVerificationApi';
import ZoomImageAnimation from '../../animations/ZoomImageAnimation';
const TextInputAadhar = (props) => {
    const [value,setValue] = useState()
    const [otp, setOtp] = useState()
    const [modalVisible, setModalVisible] = useState(false);
    const placeHolder = props.placeHolder
  const label = props.label
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

    console.log("Aadhar TextInput")

    useEffect(()=>{
      if(value)
      {
        if(value.length===12)
      {
        
        const data = {
          "aadhaar_number":"655675523712"
      }
      sendAadharOtpFunc(data)
        
       
      }
      }
      
    
     },[value])
     useEffect(()=>{
        if(otp)
        {
            if(otp.length===6)
            {
                const data={
                    "ref_id":sendAadharOtpData.body.ref_id,
                  "otp":otp
                  }
                  verifyAadharFunc(data)
            }
        }
     },[otp])
     useEffect(()=>{
        if(sendAadharOtpData)
        {
        console.log("sendAadharOtpData",sendAadharOtpData)
        // setRefId(sendAadharOtpData.body.ref_id)
        if(sendAadharOtpData.success)
        {
          console.log("success")
        }
        }
        else if(sendAadharOtpError)
        {
        console.log("sendAadharOtpError",sendAadharOtpError)
        }
        },[sendAadharOtpData,sendAadharOtpError])

        useEffect(()=>{
            if(verifyAadharData)
            {
              console.log("verifyAadharData",verifyAadharData)
              if(verifyAadharData.success)
              {
              setModalVisible(true)
              }
            }
            else if(verifyAadharError){
              console.log("verifyAadharError",verifyAadharError)
            }
            },[verifyAadharError,verifyAadharData])
    const handleInput=(text)=>{
        setValue(text)
        // props.handleData(value)
       
    }
    
    const handleInputEnd=()=>{
        let tempJsonData ={...props.jsonData,"value":value}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
    }

    return (
        <View style={{alignItems:"center",justifyContent:"center",width:'100%'}}>
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
         
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Aadhar Verified Succesfully</Text>
            <ZoomImageAnimation style={{marginBottom:20}} zoom={100} duration={1000}  image={require('../../../../assets/images/greenTick.png')}></ZoomImageAnimation>
            {/* <Image style={{height:60,width:60,margin:20}} source={require('../../../../assets/images/greenTick.png')}></Image> */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
            <View style={{height:60,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
            
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = {label}></PoppinsTextMedium>
            </View>
            <TextInput maxLength={12} onSubmitEditing={(text)=>{handleInputEnd()}} onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:24,color:'black',fontSize:16}} placeholderTextColor="grey" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={`${placeHolder} *`}></TextInput>
        </View>
       {sendAadharOtpData  && <View style={{height:60,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
        
        <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
            <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = "OTP"></PoppinsTextMedium>
        </View>
        <TextInput maxLength={6}  style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:24,color:'black',fontSize:16}} placeholderTextColor="grey" onChangeText={(text)=>{setOtp(text)}} value={otp} placeholder={`OTP`}></TextInput>
    </View>}
        </View>
        
        
    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
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
      borderRadius:4,
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
      fontSize:16,
      color:'black',
      fontWeight:'600'
    },
  });

export default TextInputAadhar;
