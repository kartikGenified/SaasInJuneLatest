import { useEffect, useState } from 'react';
import { View,Text,Image,TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../screens/dashboard/Dashboard';
import BottomNavigator from './BottomNavigator';
import RedeemRewardHistory from '../screens/historyPages/RedeemRewardHistory';
import AddBankAccountAndUpi from '../screens/payments/AddBankAccountAndUpi';
import Profile from '../screens/profile/Profile';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { useGetAppDashboardDataMutation } from '../apiServices/dashboard/AppUserDashboardApi';
import { useGetAppMenuDataMutation } from '../apiServices/dashboard/AppUserDashboardMenuAPi.js';
import * as Keychain from 'react-native-keychain';
import { SvgUri } from 'react-native-svg';
import { BaseUrlImages } from '../utils/BaseUrlImages';
import { ScrollView } from 'react-native-gesture-handler';
import { useGetActiveMembershipMutation } from '../apiServices/membership/AppMembershipApi';
import { useFetchProfileMutation } from '../apiServices/profile/profileApi';
import Share from 'react-native-share';
import { shareAppLink } from '../utils/ShareAppLink';

const Drawer = createDrawerNavigator();
const CustomDrawer=()=>{
  const [profileImage, setProfileImage] =useState()
  const [drawerData, setDrawerData] = useState()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    const primaryThemeColor = useSelector(
      state => state.apptheme.primaryThemeColor,
    )
      ? useSelector(state => state.apptheme.primaryThemeColor)
      : '#FF9B00';
    const userData = useSelector(state=>state.appusersdata.userData)
  console.log("userData",userData)
const navigation = useNavigation()

const [
  fetchProfileFunc,
  {
    data: fetchProfileData,
    error: fetchProfileError,
    isLoading: fetchProfileIsLoading,
    isError: fetchProfileIsError,
  },
] = useFetchProfileMutation();

const [getAppMenuFunc,{
  data:getAppMenuData,
  error:getAppMenuError,
  isLoading:getAppMenuIsLoading,
  isError:getAppMenuIsError
}]= useGetAppMenuDataMutation()

const [getActiveMembershipFunc,{
  data:getActiveMembershipData,
  error:getActiveMembershipError,
  isLoading:getActiveMembershipIsLoading,
  isError:getActiveMembershipIsError
}]=useGetActiveMembershipMutation()

useEffect(()=>{
  const fetchData = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username,
      );
      const token = credentials.username;
      fetchProfileFunc(token);

     
    }
  };
  fetchData()
  getMembership()
},[])


const getMembership=async()=>{
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    getActiveMembershipFunc(token)
  }
}
useEffect(() => {
  if (fetchProfileData) {
    console.log('fetchProfileData', fetchProfileData);
    if(fetchProfileData.success)
    {
      setProfileImage(fetchProfileData.body.profile_pic)
    }
  } else if (fetchProfileError) {
    console.log('fetchProfileError', fetchProfileError);
  }
}, [fetchProfileData, fetchProfileError]);

useEffect(()=>{
  if(getActiveMembershipData){
    console.log("getActiveMembershipData",JSON.stringify(getActiveMembershipData))
  }
  else if(getActiveMembershipError){
    console.log("getActiveMembershipError",getActiveMembershipError)
  }
},[getActiveMembershipData,getActiveMembershipError])

useEffect(()=>{
const fetchMenu=async()=>{
  const credentials = await Keychain.getGenericPassword();
                if (credentials) {
                  console.log(
                    'Credentials successfully loaded for user ' + credentials.username
                  );
                  const token = credentials.username
                  getAppMenuFunc(token)
                }

}
fetchMenu()
},[])
useEffect(()=>{
  if(getAppMenuData)
  {
    console.log("usertype",userData.user_type)
    console.log("getAppMenuData",JSON.stringify(getAppMenuData))
   const tempDrawerData = getAppMenuData.body.filter((item)=>{
    return item.user_type===userData.user_type
   })
   console.log("tempDrawerData",JSON.stringify(tempDrawerData))
   setDrawerData(tempDrawerData[0])
  }
  else if(getAppMenuError)
  {
    console.log("getAppMenuError",getAppMenuError)
  }
},[getAppMenuData,getAppMenuError])

const DrawerItems = (props) => {
  const image = BaseUrlImages+props.image
  const size = props.size
  console.log("image",image)
  return (
    <View
      style={{
        height: 54,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:1,
        borderBottomWidth: 1,
          borderColor: '#DDDDDD',
      }}>
      <View
        style={{
          width: '20%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          marginBottom:4
        }}>
          {/* <SvgUri width={40} height={40} uri={image}></SvgUri> */}
        {/* <Icon size={size} name="bars" color={ternaryThemeColor}></Icon> */}
        <Image style={{height:20,width:20,resizeMode:'contain'}} source={{uri:image}}></Image>
      </View>

      <View
        style={{
          
          width: '80%',
          alignItems: 'flex-start',
          justifyContent: 'center',
          
        }}>
        <TouchableOpacity
          onPress={() => {
            if(props.title==="Scan QR Code" || props.title==="Scan and Win")
            {
                navigation.navigate('QrCodeScanner')
            }
            else if(props.title.toLowerCase()==="passbook")
            {
                navigation.navigate("Passbook")
            }
            else if(props.title.toLowerCase()==="rewards"){
                navigation.navigate('RedeemRewardHistory')
            }
            else if(props.title.toLowerCase()==="gift catalogue"){
              navigation.navigate('RedeemGifts')
          }
            else if(props.title.toLowerCase() === "bank details" || props.title.toLowerCase() === "bank account"){
              navigation.navigate('BankAccounts')
          }
          else if(props.title.toLowerCase() === "profile"){
            navigation.navigate('Profile')
        }
        else if(props.title.toLowerCase() === "refer and earn"){
          navigation.navigate('ReferAndEarn')
      }
        else if(props.title.toLowerCase() === "warranty list"){
            navigation.navigate('WarrantyHistory')
        }
        else if(props.title.toLowerCase() === "help and support"){
          navigation.navigate('HelpAndSupport')
      }
      else if(props.title.toLowerCase() === "product catalogue"){
        navigation.navigate('ProductCatalogue')
    }
    else if(props.title.toLowerCase() === "video" || props.title.toLowerCase() === "videos"){
      navigation.navigate('VideoGallery')
  }
  else if(props.title.toLowerCase() === "gallery"){
    navigation.navigate('ImageGallery')
}
else  if(props.title.substring(0,4).toLowerCase()==="scan" && (props.title).toLowerCase() !=="scan list" )
{
    navigation.navigate('QrCodeScanner')
}
else  if(props.title.toLowerCase()==="scheme" )
{
    navigation.navigate('Scheme')
}
else  if(props.title.toLowerCase()==="store locator" )
{
    navigation.navigate('DataNotFound')
}
else  if(props.title.toLowerCase()==="scan list" )
{
    navigation.navigate('ScannedHistory')
}
else  if(props.title.toLowerCase()==="share app" )
{
  const options={
    title:"Share APP",
    url:shareAppLink}
Share.open(options)
.then((res) => {
  console.log(res);
})
.catch((err) => {
  err && console.log(err);
});
}
          }}>
          <Text style={{color: primaryThemeColor, fontSize: 15}}>{props.title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
return (
  <View>
    <View
      style={{
        height: 125,
        backgroundColor: ternaryThemeColor,
        borderBottomLeftRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{
          height: 60,
          width: 60,
          borderRadius: 30,
          marginLeft: 10,
          position: 'absolute',
          left: 4,
        }}
        source={{uri:BaseUrlImages+profileImage}}></Image>
      <View style={{justifyContent: 'center', marginLeft: 50}}>
      {userData && <Text
          style={{
            color: 'white',
            margin: 0,
            fontWeight: '600',
            fontSize: 16,
          }}>
          {userData.name}
        </Text>}
        {userData && <Text style={{color: 'white', margin: 0}}>{userData.user_type} Account</Text>}
        
        <View style={{flexDirection: 'row',marginTop:4}}>
           <View
            style={{
              height: 22,
              width: 80,
              borderRadius: 20,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 2,
            }}>
            {/* <Image
              style={{height: 16, width: 16,resizeMode:"contain"}}
              source={require('../../assets/images/greenTick.png')}></Image> */}
            <Text style={{marginLeft:4,color:'black',fontSize: 10, fontWeight: '500'}}>KYC Status</Text>
          </View>
           {/* <View
            style={{
              height: 22,
              width: 80,
              borderRadius: 20,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 2,
              marginLeft: 8,
            }}>
            <Image
              style={{height: 16, width: 16}}
              source={require('../../assets/images/whiteUser.png')}></Image>
            <Text style={{fontSize: 10, fontWeight: '500',color:'black'}}>TDS Status</Text>
          </View> */}
        </View>
      </View>
    </View>
    <ScrollView  style={{marginBottom:140}}>
    {
      drawerData!==undefined && drawerData.app_menu.map((item,index)=>{
        return(
          <DrawerItems
        key ={index}
      title={item.name}
      image={item.icon}
      size={20}></DrawerItems>
        )
        
      })
    }
   
         </ScrollView>
  </View>
);
}
function DrawerNavigator() {
  
  return (
    <Drawer.Navigator drawerContent={() => <CustomDrawer/>}>
      <Drawer.Screen options={{headerShown:false}} name="DashboardDrawer" component={BottomNavigator} />
      <Drawer.Screen options={{headerShown:false}} name="Redeem Reward" component={RedeemRewardHistory} />
      <Drawer.Screen options={{headerShown:false}} name="Add BankAccount And Upi" component={AddBankAccountAndUpi} />
      <Drawer.Screen options={{headerShown:false}} name="Profile" component={Profile} />


    </Drawer.Navigator>
  );
}

export default DrawerNavigator