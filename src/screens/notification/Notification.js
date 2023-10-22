import React,{useEffect,useState} from "react";
import {View,Text,Image,TouchableOpacity,ScrollView,Dimensions} from 'react-native'
import { useSelector } from "react-redux";



const Notification=({route,navigation})=>{
    
    const buttonThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#ef6110';
    const height =Dimensions.get('window').height

    const Notificationbar=(props)=>{
        return(
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <View style={{height:40,width:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:"#FFE7E7",marginLeft:20}}>
                <Image style={{width:20,height:20}} source={require('../../../assets/images/noti-small.png')}></Image>
                </View>
                
                <View style={{width:'80%',margin:20}}>
                    <Text style={{fontWeight:'600',color:'black'}}>{props.notification}</Text>
                    <Text style={{color:'black'}}>25 june 1:03pm</Text>
                </View>
            </View>
        )
    }

    return(
                <ScrollView  style={{height:'10%',backgroundColor:buttonThemeColor}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginLeft:10}}>
                        <TouchableOpacity onPress={()=>{
                            console.log("hello")
                            navigation.goBack()
                        }}>
                        <Image style={{height:30,width:30,resizeMode:'contain',marginRight:8}} source={require('../../../assets/images/blackBack.png')}></Image>
                        </TouchableOpacity>
                <Text style={{color:'white',marginLeft:10,fontWeight:'500'}}>Notification</Text>
                </View>
                <View style={{paddingBottom:120,height:height,backgroundColor:'white',width:'100%',borderTopLeftRadius:30,borderTopRightRadius:30,marginTop:20}}>
                  
                       
                                <Notificationbar  notification="Lorem Ipsum"></Notificationbar>
                           
                        
                    
                </View>
                </ScrollView>
                
                
                )
}

export default Notification