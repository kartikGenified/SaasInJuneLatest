import React from 'react';
import {View, StyleSheet,TouchableOpacity,Image} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
import { SvgUri } from 'react-native-svg';

const SelectUserBox = (props) => {
    const image = BaseUrlImages+props.image
    // const image = 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/atom.svg'
    // console.log(image)
    const color = props.color
    const otpLogin = props.otpLogin
    // const passwordLogin = props.passwordLogin
    // const autoApproval = props.autoApproval
    const manualApproval = props.manualApproval
    const registrationRequired = props.registrationRequired
    console.log(props.content, registrationRequired)

    const checkRegistrationRequired=()=>{
        if(registrationRequired.includes(props.content))
        {
            checkApprovalFlow(true)
            console.log("registration required")
        }
        else{
            checkApprovalFlow(false)
            console.log("registration not required")

        }
    }

    const checkApprovalFlow=(registrationRequired)=>{
        if(manualApproval.includes(props.content))
        {
            handleNavigation(true,registrationRequired)
        }
        else{
            handleNavigation(false,registrationRequired)
        }
        
    }

    const handleNavigation=(needsApproval,registrationRequired)=>{
        console.log("Needs Approval",needsApproval)
        if(otpLogin.includes(props.content)
        ){
            props.navigation.navigate('OtpLogin',{needsApproval:needsApproval, userType:props.content, userId:props.id,registrationRequired:registrationRequired})
        }
        else{
            props.navigation.navigate('PasswordLogin',{needsApproval:needsApproval, userType:props.content, userId:props.id,registrationRequired:registrationRequired})
        console.log("Password Login",props.content,props.id,registrationRequired,needsApproval)
        }

    }

    return (
        <TouchableOpacity onPress={()=>{
            checkRegistrationRequired()
        }} style={{...styles.container,backgroundColor:'white'}}>
            
            {image && <View style={{height:70,width:70,borderRadius:35,backgroundColor:"white",alignItems:"center",justifyContent:'center'}}>
            <Image source={{uri:image}} style={styles.image}></Image></View>}

            
            <PoppinsTextMedium style={{color:'#B0B0B0',marginTop:20,fontSize:18,fontWeight:'700'}} content ={(props.content).toUpperCase()}></PoppinsTextMedium>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        height:170,
        width:'40%',
        alignItems:"center",
        justifyContent:"center",
        margin:10,
        elevation:10,
        borderRadius:10,
        borderWidth:0.8,
        borderColor:'#DDDDDD'
       
    },
    image:{
        height:80,
        width:80,
        marginBottom:8
       
        
    }
})

export default SelectUserBox;
