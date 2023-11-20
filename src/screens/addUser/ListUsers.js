import React,{useEffect, useState} from 'react';
import {View, StyleSheet,Image,TouchableOpacity, ScrollView} from 'react-native';
import { useListAddedUsersMutation } from '../../apiServices/listUsers/listAddedUsersApi';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import Plus from 'react-native-vector-icons/AntDesign';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
const ListUsers = ({navigation}) => {

    const userData = useSelector(state=>state.appusersdata.userData)
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#FFB533';

    const [listAddedUserFunc, {
        data:listAddedUserData,
        error:listAddedUserError,
        isLoading:listAddedUserIsLoading,
        isError:listAddedUserIsError
    }]= useListAddedUsersMutation()

    useEffect(()=>{
    const getData=async()=>{
        const credentials = await Keychain.getGenericPassword();
    if (credentials) {
        console.log(
        'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        const userId = userData.id
        const params = {
            token:token,
            userId:userId
        }
        listAddedUserFunc(params)
    }
    }
    getData()
    },[])

    useEffect(()=>{
        if(listAddedUserData){
            console.log("listAddedUserData",JSON.stringify(listAddedUserData))
        }
        else if(listAddedUserError)
        {
            console.log("listAddedUserError",listAddedUserError)
        }
    },[listAddedUserData,listAddedUserError])


    const UserListComponent=(props)=>{
        const name= props.name
        const index = props.index+1
        const userType = props.userType
        const mobile = props.mobile
        return(
            <View style={{padding:6,width:'90%',backgroundColor:'white',elevation:2,borderWidth:1,borderColor:'#DDDDDD',marginTop:20,flexDirection:'row',borderRadius:4}}>
            <View style={{width:'20%',alignItems:"center",justifyContent:'center',height:'100%'}}>
                <View style={{height:30,width:30,borderRadius:15,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDDDDD'}}>
                <PoppinsTextMedium style={{color:'grey'}} content={index}></PoppinsTextMedium>

                </View>
            </View>
            <View style={{width:'80%',alignItems:"flex-start",justifyContent:'center',height:'100%'}}>
            <PoppinsTextMedium style={{color:'grey',fontWeight:"700"}} content={`Name : ${name}`}></PoppinsTextMedium>
            <PoppinsTextMedium style={{color:'grey',fontWeight:"700"}} content={`User Type : ${userType}`}></PoppinsTextMedium>
            <PoppinsTextMedium style={{color:'grey',fontWeight:"700"}} content={`Mobile : ${mobile}`}></PoppinsTextMedium>

 
            </View>
        </View>
        )
        
    }

    return (
        <View style={{alignItems:"center",justifyContent:'flex-start',height:'100%',width:'100%',backgroundColor:ternaryThemeColor,flex:1}}>
        <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: '10%',
          marginLeft: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content="Added Users List"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>       

      <View style={{height:'80%',width:'100%',alignItems:"center",justifyContent:'flex-start',backgroundColor:"white",paddingTop:30}}>
        <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:'center',justifyContent:'flex-start',paddingBottom:30}}>
          {listAddedUserData && listAddedUserData.body.data.map((item,index)=>{
            return(
           
            <UserListComponent userType={item.user_type} name={item.name} mobile ={item.mobile} key = {index} index ={index}></UserListComponent>
            

            )
          })}
</ScrollView>
        </View>   
      <View style={{height:'10%',width:'100%',alignItems:"center",justifyContent:'center',backgroundColor:"white",paddingTop:30,borderTopWidth:2,borderColor:ternaryThemeColor}}>
      <View style={{flexDirection:"row",alignItems:'center',justifyContent:'center',position:'absolute',right:20}}>
            <PoppinsText content="Add Users" style={{color:ternaryThemeColor,fontSize:20}}></PoppinsText>
            <TouchableOpacity onPress={()=>{navigation.navigate('AddUser')}} style={{backgroundColor:'#DDDDDD',height:60,width:60,borderRadius:30,alignItems:"center",justifyContent:'center',marginLeft:10}}>
            
            <Plus name="pluscircle" size={50} color={ternaryThemeColor}></Plus>
            </TouchableOpacity>
            </View>
        </View>
           
        </View>
    );
}

const styles = StyleSheet.create({})

export default ListUsers;
