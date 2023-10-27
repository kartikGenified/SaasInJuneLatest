import React,{useEffect,useState} from 'react';
import {View, StyleSheet,ScrollView,Platform} from 'react-native';
import MenuItems from '../../components/atoms/MenuItems';
import { BaseUrl } from '../../utils/BaseUrl';
import { useGetAppDashboardDataMutation } from '../../apiServices/dashboard/AppUserDashboardApi';
import { useGetAppUserBannerDataMutation } from '../../apiServices/dashboard/AppUserBannerApi';
import * as Keychain from 'react-native-keychain';
import DashboardMenuBox from '../../components/organisms/DashboardMenuBox';
import Banner from '../../components/organisms/Banner';
import DrawerHeader from '../../components/headers/DrawerHeader';
import DashboardDataBox from '../../components/molecules/DashboardDataBox';
import KYCVerificationComponent from '../../components/organisms/KYCVerificationComponent';
import DashboardSupportBox from '../../components/molecules/DashboardSupportBox';
import { useGetWorkflowMutation } from '../../apiServices/workflow/GetWorkflowByTenant';
import { useGetFormMutation } from '../../apiServices/workflow/GetForms';
import { useSelector ,useDispatch} from 'react-redux';
import { setProgram,setWorkflow,setIsGenuinityOnly} from '../../../redux/slices/appWorkflowSlice';
import { setWarrantyForm,setWarrantyFormId} from '../../../redux/slices/formSlice';
import { setLocation } from '../../../redux/slices/userLocationSlice';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { useGetkycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import { setKycData } from '../../../redux/slices/userKycStatusSlice';

const Dashboard = ({navigation}) => {

    const [dashboardItems, setDashboardItems] = useState()
    const [bannerArray, setBannerArray] = useState()
    const [showKyc, setShowKyc] = useState(true)
    const dispatch = useDispatch()
    const userId = useSelector((state)=>state.appusersdata.userId)
    console.log("user id is from dashboard",userId)
    
    
    
    const [getDashboardFunc,{
      data:getDashboardData,
      error:getDashboardError,
      isLoading:getDashboardIsLoading,
      isError:getDashboardIsError
    }] =useGetAppDashboardDataMutation()

    const [getKycStatusFunc,{
      data:getKycStatusData,
      error:getKycStatusError,
      isLoading:getKycStatusIsLoading,
      isError:getKycStatusIsError
    }] = useGetkycStatusMutation()

    useEffect(()=>{
      if(getKycStatusData)
      {
        console.log("getKycStatusData",getKycStatusData)
        if(getKycStatusData.success)
        {
          const tempStatus = Object.values(getKycStatusData.body)
          setShowKyc(tempStatus.includes(false))
          
            dispatch(
              setKycData(getKycStatusData.body)
                    )
          
          
        }
      }
      else if(getKycStatusError)
      {
        console.log("getKycStatusError",getKycStatusError)
      }
    },[getKycStatusData,getKycStatusError])

    useEffect(()=>{
      if(getDashboardData)
      {
        console.log("getDashboardData",getDashboardData)
        setDashboardItems(getDashboardData.body.app_dashboard)
      }
      else if(getDashboardError)
      {
        console.log("getDashboardError",getDashboardError)
      }
    },[getDashboardData,getDashboardError])

    const [getBannerFunc,{
        data:getBannerData,
        error:getBannerError,
        isLoading:getBannerIsLoading,
        isError:getBannerIsError
    }] =useGetAppUserBannerDataMutation()

    const [getWorkflowFunc,{
      data:getWorkflowData,
      error:getWorkflowError,
      isLoading:getWorkflowIsLoading,
      isError:getWorkflowIsError
  }] =useGetWorkflowMutation()
    const [getFormFunc,{
      data:getFormData,
      error:getFormError,
      isLoading:getFormIsLoading,
      isError:getFormIsError
  }] =useGetFormMutation()


    useEffect(()=>{
      let lat=''
      let lon=''
      Geolocation.getCurrentPosition((res)=>{
        console.log("res",res)
          lat = res.coords.latitude
          lon = res.coords.longitude
          // getLocation(JSON.stringify(lat),JSON.stringify(lon))
          console.log("latlong",lat,lon)
          var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.coords.latitude},${res.coords.longitude}
          &location_type=ROOFTOP&result_type=street_address&key=AIzaSyADljP1Bl-J4lW3GKv0HsiOW3Fd1WFGVQE`
      
      fetch(url).then(response => response.json()).then(json => {
        console.log("location address=>", JSON.stringify(json));
        const formattedAddress = json.results[0].formatted_address
        const formattedAddressArray = formattedAddress.split(',')
       
       const locationJson = {
        city:formattedAddressArray[1],
        district:formattedAddressArray[2],
        state:formattedAddressArray[3],
        postcode:formattedAddressArray[4],
        country:formattedAddressArray[5],
        lat:json.results[0].geometry.location.lat,
        lon:json.results[0].geometry.location.lng,
        address:formattedAddress
       
       }
       console.log("formattedAddressArray",locationJson)
        dispatch(setLocation(locationJson))
    })
      })
      
    },[])

    useEffect(()=>{
        const getDashboardData=async()=>{
            try {
                // Retrieve the credentials
                const credentials = await Keychain.getGenericPassword();
                if (credentials) {
                  console.log(
                    'Credentials successfully loaded for user ' + credentials.username
                  );
                  const token = credentials.username
                  const form_type = "2"
                  console.log("token from dashboard ", token)
                  token && getDashboardFunc(token)
                  token && getKycStatusFunc(token)
                  token && getBannerFunc(token)
                  token && getWorkflowFunc({userId,token})
                  token && getFormFunc({form_type,token})
                } else {
                  console.log('No credentials stored');
                }
              } catch (error) {
                console.log("Keychain couldn't be accessed!", error);
              }
        }
        getDashboardData()
        
    },[])

    
    
    useEffect(()=>{
      if(getBannerData)
      {
          console.log("getBannerData",getBannerData.body)
          const images = Object.values(getBannerData.body).map((item)=>{
            return item.image[0]
          })
          console.log("images",images)
          setBannerArray(images)
      }
      else{
          console.log(getBannerError)
      }
  },[getBannerError,getBannerData])

    useEffect(()=>{
        if(getWorkflowData)
        {
          if(getWorkflowData.length===1 && getWorkflowData[0]==="Genuinity")
          {
            dispatch(setIsGenuinityOnly())
          }
          const removedWorkFlow = getWorkflowData.body[0].program.filter((item,index)=>{
            return item!=="Warranty"
          })
            console.log("getWorkflowData",getWorkflowData.body[0].program)
            dispatch(setProgram(removedWorkFlow))
            dispatch(setWorkflow(getWorkflowData.body[0].workflow_id))
            
        }
        else{
            console.log(getWorkflowError)
        }
    },[getWorkflowData,getWorkflowError])
    useEffect(()=>{
      if(getFormData)
      {
          console.log("Form Fields",getFormData.body)
          dispatch(setWarrantyForm(getFormData.body.template))
          dispatch(setWarrantyFormId(getFormData.body.form_template_id))
          
      }
      else{
          console.log("Form Field Error",getFormError)
      }
  },[getFormData,getFormError])

    const platformMarginScroll = Platform.OS ==='ios' ? 0:0
    

    return (
        <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"#F7F9FA",flex:1,height:'100%'}}>
            <DrawerHeader></DrawerHeader>
            <ScrollView style={{width:'100%',marginBottom:platformMarginScroll,height:'100%'}}>
                <View style={{width:'100%',alignItems:"center",justifyContent:"center",height:"100%"}}>
              <View style={{height:200,width:'100%',marginBottom:20}}>
        {bannerArray && 
          <Banner images={bannerArray}></Banner>
}
          </View>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{paddingLeft:10,paddingRight:10,paddingBottom:4}}>
          {/* <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox>
          <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox> */}

          </ScrollView>
          {dashboardItems && <DashboardMenuBox navigation={navigation} data={dashboardItems}></DashboardMenuBox>}  
            <View style={{width:'100%',alignItems:"center",justifyContent:"center",marginBottom:20}}>
          {showKyc && <KYCVerificationComponent buttonTitle="Complete Your KYC" title="Your KYC is not completed"></KYCVerificationComponent>}
            </View>
            <View style={{flexDirection:"row",width:'100%',alignItems:"center",justifyContent:"center"}}>
                <DashboardSupportBox text="Refer and Earn" backgroundColor="#FFF4EB" borderColor="#FEE8D4" image={require('../../../assets/images/info.png')} ></DashboardSupportBox>
                <DashboardSupportBox text="Customer support" backgroundColor="#EDEAFE" borderColor="#E4E0FC" image={require('../../../assets/images/support.png')} ></DashboardSupportBox>
                <DashboardSupportBox text="Feedback" backgroundColor="#FEE9E9" borderColor="#FDDADA" image={require('../../../assets/images/feedback.png')} ></DashboardSupportBox>

            </View>
          </View>
          </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Dashboard;
