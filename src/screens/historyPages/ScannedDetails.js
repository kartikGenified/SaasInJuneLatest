import React from 'react';
import {View, StyleSheet,TouchableOpacity,Image} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import StatusBox from '../../components/atoms/StatusBox';
import moment from 'moment';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
const ScannedDetails = ({navigation,route}) => {
    const status = "Success"
    
    const data = route.params.data
    console.log(data)
    const points = data?.points_on_product
    const image = data.images!==null ? data.images[0] : null
    const date = data.scanned_at


    const ScannedDetailsProductBox=(props)=>{
        const productName=data.product_name
        const productSerialNumber = data.product_code
        const recievedIn = props.recievedIn
        return(
            <View style={{height:180,width:'100%',backgroundColor:'#DDDDDD',alignItems:"center",justifyContent:'center',padding:16,marginTop:120}}>
               <View style={{height:154,width:154,borderRadius:10,borderWidth:1,backgroundColor:'white',position:"absolute",top:-74,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center"}}>
                <Image style={{height:100,width:100,resizeMode:'contain'}} source={{uri:BaseUrlImages+image}}></Image>
               </View>
               <View style={{alignItems:"flex-start",justifyContent:"center",position:"absolute",bottom:10,left:20}}>
               <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700',color:'black'}} content={`Product Name : ${productName}`}></PoppinsTextMedium>
                <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700',color:'black'}} content={`Product S.No : ${productSerialNumber}`}></PoppinsTextMedium>
                {/* <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700'}} content={`Recieved In `}></PoppinsTextMedium> */}
               </View>
                </View>
        )
    }

    const ClickToReport=()=>{
        return(
            <View style={{alignItems:"center",justifyContent:'center',width:"100%",position:"absolute",bottom:10}}>
                <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'700'}} content="Issue with this ?"></PoppinsTextMedium>
                <TouchableOpacity onPress={()=>{navigation.navigate("ReportAndIssue",{data:data})}} style={{height:50,width:180,backgroundColor:"#D10000",alignItems:"center",justifyContent:"center",borderRadius:4,marginTop:6}}>
                    <PoppinsTextMedium style={{color:'white',fontSize:16}} content="Click here to report"></PoppinsTextMedium>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{alignItems:"center",justifyContent:"flex-start",height:'100%'}}>
            <View style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",width:'100%',marginTop:10,height:40,marginLeft:20}}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
            <Image style={{height:24,width:24,resizeMode:'contain',marginLeft:10}} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
            <PoppinsTextMedium content ="Scanned Details" style={{marginLeft:10,fontSize:16,fontWeight:'600',color:'#171717'}}></PoppinsTextMedium>
            {/* <TouchableOpacity style={{marginLeft:160}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity> */}
            </View>
            <StatusBox status={status}></StatusBox>
            {/* <Image style={{height:70,width:70,resizeMode:"contain",marginTop:20}} source={require('../../../assets/images/greenTick.png')}></Image> */}
            
            {/* <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row",marginTop:20}}>
            <PoppinsTextMedium style={{fontSize:20,fontWeight:'800',color:'black'}} content="Points : "></PoppinsTextMedium>
            <View style={{backgroundColor:'#FFD11E',padding:10,borderRadius:24,paddingLeft:24,paddingRight:24}}>
            <PoppinsTextMedium style={{fontSize:20,fontWeight:'800',color:'black'}} content={points}></PoppinsTextMedium>
            </View>           
            </View> */}

            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:10}}>
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <Image style={{height:16,width:16,resizeMode:'contain'}} source={require('../../../assets/images/Date.png')}></Image>
                    <PoppinsTextMedium  style={{fontSize:16,fontWeight:'800',color:'black',marginLeft:4}} content={moment(date).format("DD MMM YYYY")}></PoppinsTextMedium>

                </View>
                <View style={{width:2,height:'100%',backgroundColor:"grey",marginLeft:20}}></View>
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginLeft:10}}>
                    <Image style={{height:16,width:16,resizeMode:'contain'}} source={require('../../../assets/images/clock.png')}></Image>
                    <PoppinsTextMedium style={{fontSize:16,fontWeight:'800',color:'black',marginLeft:4}} content={moment(date).format("HH:mm A")}></PoppinsTextMedium>
                </View>
            </View>
            <ScannedDetailsProductBox></ScannedDetailsProductBox>
            {/* <ClickToReport></ClickToReport> */}
        </View>
    );
}

const styles = StyleSheet.create({})

export default ScannedDetails;
