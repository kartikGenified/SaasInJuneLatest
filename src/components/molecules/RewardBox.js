import React, { useEffect } from 'react';
import {View, StyleSheet,ScrollView} from 'react-native';
import RewardSquare from '../atoms/RewardSquare';
import { useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';

const RewardBox=()=>{
    const workflow = useSelector(state=>state.appWorkflow.program)
  const id = useSelector(state => state.appusersdata.id);

    const [userPointFunc,{
        data:userPointData,
        error:userPointError,
        isLoading:userPointIsLoading,
        isError:userPointIsError
    }]= useFetchUserPointsMutation()
    useEffect(()=>{
        fetchPoints()
      },[])
      const fetchPoints=async()=>{
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params ={userId:id,
        token:token}
        userPointFunc(params)
  
    }

    useEffect(()=>{
        if(userPointData)
        {
            console.log("userPointData",userPointData)
        }
        else if(userPointError)
        {
            console.log("userPointError",userPointError)
        }
    
    },[userPointData,userPointError])


    console.log(workflow)
    return(
        <View style={{padding:4,width:'90%',borderRadius:14,backgroundColor:"white",elevation:4,alignItems:'center',justifyContent:"center"}}>
           
            <ScrollView style={{ borderRadius:20,width:'100%',padding:10}} showsHorizontalScrollIndicator={false} horizontal={true}>
               {
                workflow.includes("Static Coupon") &&  <RewardSquare color="#FFE2E6" image ={require('../../../assets/images/voucher.png')} title="My Coupons"></RewardSquare>
               }
               {
                workflow.includes("Cashback") &&  <RewardSquare color="#FFF4DE" image ={require('../../../assets/images/cashback.png')} title="Cashback"></RewardSquare>
               }
               {
                workflow.includes("Points On Product") && userPointData &&<RewardSquare amount={userPointData.body.point_earned}  color="#DCFCE7" image ={require('../../../assets/images/points.png')} title="Earned Points"></RewardSquare>
               }
                {
                workflow.includes("Wheel") && <RewardSquare color="#FFE2E6" image ={require('../../../assets/images/cashback.png')} title="Spin Wheel"></RewardSquare>

               }

            </ScrollView>
           
        </View>
    )
}

const styles = StyleSheet.create({})

export default RewardBox;
