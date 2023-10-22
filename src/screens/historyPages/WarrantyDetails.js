import React,{useEffect,useState} from 'react';
import {View, StyleSheet,TouchableOpacity,Image,FlatList,ImageBackground} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useGetWarrantyByAppUserIdMutation } from '../../apiServices/workflow/warranty/ActivateWarrantyApi';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
import moment from 'moment';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';

const WarrantyDetails = ({navigation,route}) => {
const warrantyStart=route.params.data.created_at
const warrantyEnd = route.params.data.end_date
const warrantyId = route.params.data.id
const data = route.params.data
const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';


    console.log("data",data)
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
    const ScannedDetailsProductBox=(props)=>{
        const productName=data.product_name
        // const productSerialNumber = props.product_code
        const productCode = data.product_code
        return(
            <View style={{height:200,width:'100%',backgroundColor:'#F7F7F7',alignItems:"center",justifyContent:'center',padding:16,marginTop:120}}>
               <View style={{height:154,width:154,borderRadius:10,borderWidth:1,backgroundColor:'white',position:"absolute",top:-74,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center"}}>
                <Image style={{height:100,width:100}} source={require('../../../assets/images/box.png')}></Image>
               </View>
               <View style={{alignItems:"flex-start",justifyContent:"center",position:"absolute",bottom:10,left:20}}>
               <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700'}} content={`Product Name : ${productName}`}></PoppinsTextMedium>
                <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700'}} content={`Product Code : ${productCode}`}></PoppinsTextMedium>
                {/* <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700'}} content={`Product S.No : ${productSerialNumber}`}></PoppinsTextMedium> */}
               </View>
                </View>
        )
    }
    return (
        <View style={{alignItems:"center",justifyContent:"flex-start",backgroundColor:"white",height:'100%'}}>
            <View style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",width:'100%',marginTop:10,height:40,marginLeft:20}}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
            <Image style={{height:24,width:24,resizeMode:'contain',marginLeft:10}} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
            <PoppinsTextMedium content ="Warranty Details" style={{marginLeft:10,fontSize:16,fontWeight:'600',color:'#171717'}}></PoppinsTextMedium>
            <TouchableOpacity style={{marginLeft:160}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity>
            </View>
            <ScannedDetailsProductBox></ScannedDetailsProductBox>
            <View style={{alignItems:"center",justifyContent:"center"}}>
                <PoppinsTextMedium style={{color:'black', fontSize:18}} content={`Warranty Start : ${moment(warrantyStart).format('DD MMM YYYY')}`}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:'black', fontSize:18,marginTop:4}} content={`Warranty End : ${moment(warrantyEnd).format('DD MMM YYYY')}`}></PoppinsTextMedium>
                <View style={{height:40,width:240,alignItems:"center",justifyContent:"center",borderWidth:1,borderStyle:'dashed',backgroundColor:secondaryThemeColor,borderRadius:4}}>
                <PoppinsTextMedium style={{color:'black', fontSize:18,marginTop:4}} content={`Warranty Id : ${warrantyId}`}></PoppinsTextMedium>
                </View>
            </View>
            <View style={{height:40,width:240,alignItems:"center",justifyContent:"center",backgroundColor:"#91B406",marginTop:20,borderRadius:4}}>
                <PoppinsTextMedium style={{color:'white', fontSize:18,marginTop:4}} content={`Download Warranty`}></PoppinsTextMedium>
                </View>
                <View style={{height:40,width:240,alignItems:"center",justifyContent:"center",backgroundColor:"#353535",marginTop:20,borderRadius:4}}>
                <PoppinsTextMedium style={{color:'white', fontSize:18,marginTop:4}} content={`Claim Warranty/View Claim`}></PoppinsTextMedium>
                </View>
                {/* <ClickToReport></ClickToReport> */}
        </View>
    );
}

const styles = StyleSheet.create({})

export default WarrantyDetails;
