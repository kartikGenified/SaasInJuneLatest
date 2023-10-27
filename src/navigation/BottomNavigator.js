import React from 'react';
import {View,Text,Platform, TouchableOpacity} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/dashboard/Dashboard';
import Home from 'react-native-vector-icons/AntDesign'
import Qrcode from 'react-native-vector-icons/AntDesign'
import Book from 'react-native-vector-icons/AntDesign'
import {useSelector, useDispatch} from 'react-redux';
import Wave from '../../assets/svg/bottomDrawer.svg'
import PoppinsTextMedium from '../components/electrons/customFonts/PoppinsTextMedium';


const Tab = createBottomTabNavigator();

//custom bottom drawer 



function BottomNavigator({navigation}) {
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

    const platformFontWeight = Platform.OS==="ios" ? "400":"800"

  return (
    <Tab.Navigator tabBar={()=><View style={{alignItems:"center",justifyContent:"center",width:"100%",backgroundColor:"#F7F7F7"}}>
      <Wave style={{top:10}} width={100}></Wave>
    <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row",height:60,backgroundColor:"white",width:'100%'}}>
    <TouchableOpacity onPress={()=>{navigation.navigate('Dashboard')}} style={{alignItems:"center",justifyContent:"center",position:'absolute'}}>
    <Home name="home" size={24} color={ternaryThemeColor}></Home>
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content="Home"></PoppinsTextMedium>
    </TouchableOpacity>
    
    <TouchableOpacity onPress={()=>{navigation.navigate('QrCodeScanner')}} style={{alignItems:"center",justifyContent:"center",position:'absolute',left:30}}>
    <Qrcode name="qrcode" size={24} color={ternaryThemeColor}></Qrcode>
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content="Scan QR Code"></PoppinsTextMedium>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>{navigation.navigate('Passbook')}} style={{alignItems:"center",justifyContent:"center",position:'absolute',right:30}}>
    <Book name="book" size={24} color={ternaryThemeColor}></Book>
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content="Passbook"></PoppinsTextMedium>
    </TouchableOpacity>
    </View>
    </View>}>
      <Tab.Screen  options={{headerShown:false,
      tabBarLabel:"Home",
    tabBarIcon:()=><Home name="home" size={24} color={ternaryThemeColor}></Home>
    }} name="DashboardBottom" component={Dashboard} />
    </Tab.Navigator>
  );
}

export default BottomNavigator