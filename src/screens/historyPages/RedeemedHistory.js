import React,{useEffect, useState} from 'react';
import {View, StyleSheet,TouchableOpacity,Image,FlatList,Modal,Pressable,Text} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useFetchGiftsRedemptionsOfUserMutation } from '../../apiServices/workflow/RedemptionApi';
import * as Keychain from 'react-native-keychain';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import moment from 'moment';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
import { useIsFocused } from '@react-navigation/native';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';

const RedeemedHistory = ({navigation}) => {
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
  const userData = useSelector(state=>state.appusersdata.userData)
  const userId = useSelector(state => state.appusersdata.userId);
  const id = useSelector(state => state.appusersdata.id);
      const focused = useIsFocused()
  const fetchPoints=async()=>{
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const params ={userId:id,
      token:token}
      userPointFunc(params)

  }
  useEffect(()=>{
    fetchPoints()
  },[focused])
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

    const [
        FetchGiftsRedemptionsOfUser,
        {
          data: fetchGiftsRedemptionsOfUserData,
          isLoading: fetchGiftsRedemptionsOfUserIsLoading,
          isError: fetchGiftsRedemptionsOfUserIsError,
          error: fetchGiftsRedemptionsOfUserError,
        },
      ] = useFetchGiftsRedemptionsOfUserMutation();

      const [userPointFunc,{
        data:userPointData,
        error:userPointError,
        isLoading:userPointIsLoading,
        isError:userPointIsError
    }]= useFetchUserPointsMutation()
     

      useEffect(() => {
        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token =credentials.username;
          const userId = userData.id
    
          FetchGiftsRedemptionsOfUser({
            token: token,
            userId:userId,
            type: "1",
            
          });
        })();
      }, [focused]);
      useEffect(()=>{
        if(fetchGiftsRedemptionsOfUserData)
        {
            console.log("fetchGiftsRedemptionsOfUserData",fetchGiftsRedemptionsOfUserData.body.userPointsRedemptionList)
        }
        else if(fetchGiftsRedemptionsOfUserError)
        {
            console.log("fetchGiftsRedemptionsOfUserIsLoading",fetchGiftsRedemptionsOfUserError)
        }
      },[fetchGiftsRedemptionsOfUserData,fetchGiftsRedemptionsOfUserError])

      const modalClose = () => {
        setError(false);
        setSuccess(false)
      };

    const DisplayEarnings=()=>{
        const [modalVisible, setModalVisible] = useState(false);
        const handleRedeemButtonPress=()=>{
          if(Number(userPointData.body.point_balance)<=0)
          {
            setError(true)
            setMessage("You dont have enough points !")
          }
          else{
          setModalVisible(true)
          }
  
        }
        return(
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           <Image style={{height:80,width:80,marginTop:20}} source={require('../../../assets/images/gift1.png')}></Image>
           <PoppinsTextMedium style={{color:'black',width:300,marginTop:20}} content="Do you want redeem your point with amazing gift or cashback"></PoppinsTextMedium>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:"center",marginTop:20}}>
            <TouchableOpacity onPress={()=>{
                console.log("gift")
                setModalVisible(false)
                navigation.navigate('RedeemGifts')

            }} style={{alignItems:"center",justifyContent:"center",backgroundColor:'#0E2659',flexDirection:"row",height:40,width:100,borderRadius:10}}>
                <Image style={{height:20,width:20,resizeMode:"contain"}} source={require('../../../assets/images/giftWhite.png')}></Image>
                <PoppinsTextMedium style={{color:'white',marginLeft:10}} content="Gift"></PoppinsTextMedium>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                console.log("cashback")
                setModalVisible(false)
                navigation.navigate('RedeemCashback')
            }} style={{alignItems:"center",justifyContent:"center",backgroundColor:ternaryThemeColor,flexDirection:"row",marginLeft:40,height:40,width:120,borderRadius:10}}>
                <Image style={{height:20,width:20,resizeMode:"contain"}} source={require('../../../assets/images/giftWhite.png')}></Image>
                <PoppinsTextMedium style={{color:'white',marginLeft:10}} content="Cashback"></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
          
          </View>
        </View>
      </Modal>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                    {userPointData && <PoppinsText style={{color:"black"}} content={userPointData.body.point_earned}></PoppinsText>}
                    <PoppinsTextMedium style={{color:"black",fontSize:14}} content="Lifetime Earnings"></PoppinsTextMedium>
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginLeft:20}}>
                    {userPointData && <PoppinsText style={{color:"black"}} content={userPointData.body.point_redeemed}></PoppinsText>}
                    <PoppinsTextMedium style={{color:"black",fontSize:14}} content="Lifetime Burns"></PoppinsTextMedium>
                </View>
                <TouchableOpacity onPress={()=>{
                  handleRedeemButtonPress()
                }} style={{borderRadius:2,height:40,width:100,backgroundColor:"#FFD11E",alignItems:"center",justifyContent:"center",marginLeft:20}}>
                    <PoppinsTextMedium  style={{color:'black'}} content="Redeem"></PoppinsTextMedium>
                </TouchableOpacity> 
            </View>
        )
    }
    const Header=()=>{
        return(
            <View style={{height:40,width:'100%',backgroundColor:'#DDDDDD',alignItems:"center",justifyContent:"center",flexDirection:"row",marginTop:20}}>
                <PoppinsTextMedium style={{marginLeft:20,fontSize:16,position:"absolute",left:10}} content="Redeemed Ladger"></PoppinsTextMedium>
                <TouchableOpacity style={{position:"absolute",right:20}}>
                <Image style={{height:22,width:22,resizeMode:"contain"}} source={require('../../../assets/images/settings.png')}></Image>

                </TouchableOpacity>
            </View>
        )
    }
    const ListItem=(props)=>{
        const data = props.data
        const description = data.gift.gift[0].name
        const productCode = props.productCode
        const time = props.time
        const amount =props.amount
        const image = data.gift.gift[0].images[0]
        console.log("data from listItem",data.gift.gift[0])
        return(
            <TouchableOpacity onPress={()=>{
                navigation.navigate('RedeemedDetails',{data:data})
            }} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:10,width:"100%",marginBottom:10}}>
                <View style={{height:70,width:70,alignItems:"center",justifyContent:"center",borderRadius:10,borderWidth:1,borderColor:'#DDDDDD',right:10}}>
                    <Image style={{height:50,width:50,resizeMode:"contain"}} source={{uri:BaseUrlImages+image}}></Image>
                </View>
                <View style={{alignItems:"flex-start",justifyContent:"center",marginLeft:0,width:160}}>
                    <PoppinsTextMedium style={{fontWeight:'600',fontSize:16,color:'black',textAlign:'auto'}} content={description}></PoppinsTextMedium>
                    <View style={{backgroundColor:ternaryThemeColor,alignItems:'center',justifyContent:"center",borderRadius:4,padding:3,paddingLeft:5,paddingRight:5}}>
                    <PoppinsTextMedium style={{fontWeight:'400',fontSize:12,color:'white'}} content="Track Product"></PoppinsTextMedium>
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:4}}>
                        <Image style={{height:14,width:14,resizeMode:"contain"}} source={require('../../../assets/images/clock.png')}></Image>
                        <PoppinsTextMedium style={{fontWeight:'200',fontSize:12,color:'grey',marginLeft:4}} content={time}></PoppinsTextMedium>
                    
                    </View>
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginLeft:40}}>
                    
                    <PoppinsTextMedium style={{color:ternaryThemeColor,fontSize:18,fontWeight:"700"}} content={` - ${amount}`}></PoppinsTextMedium>
                    <PoppinsTextMedium style={{color:"grey",fontSize:14}} content="PTS"></PoppinsTextMedium>

                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{alignItems:"center",justifyContent:"flex-start",width:'100%',height:'100%',backgroundColor:"white"}}>
          {error && (
            <ErrorModal
              modalClose={modalClose}
              message={message}
              openModal={error}></ErrorModal>
          )}
          {success && (
            <MessageModal
              modalClose={modalClose}
              message={message}
              openModal={success}></MessageModal>
          )}
            <View style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",width:'100%',marginTop:10,height:40,marginLeft:20}}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
            <Image style={{height:24,width:24,resizeMode:'contain',marginLeft:10}} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
            <PoppinsTextMedium content ="Redeemed History" style={{marginLeft:10,fontSize:16,fontWeight:'600',color:'#171717'}}></PoppinsTextMedium>
            <TouchableOpacity style={{marginLeft:160}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity>
            </View>
            <View style={{padding:14,alignItems:"flex-start",justifyContent:"flex-start",width:"100%"}}>
                <PoppinsTextMedium style={{marginLeft:10,fontSize:20,fontWeight:'600',color:'#6E6E6E'}} content="You Have"></PoppinsTextMedium>
                {userPointData && 
                <PoppinsText style={{marginLeft:10,fontSize:34,fontWeight:'600',color:'#373737'}} content={userPointData.body.point_balance}></PoppinsText>
                
                }
                <PoppinsTextMedium style={{marginLeft:10,fontSize:20,fontWeight:'600',color:'#6E6E6E'}} content="Points Balance"></PoppinsTextMedium>
            </View>
            <DisplayEarnings></DisplayEarnings>
            <Header></Header>
            {fetchGiftsRedemptionsOfUserData && <FlatList
        data={fetchGiftsRedemptionsOfUserData.body.userPointsRedemptionList}
        style={{width:'100%'}}
        contentContainerStyle={{width:'100%'}}
        renderItem={({item,index}) => {
            console.log(index+1,item)
            return(
                <ListItem data={item} description={item.gift} productCode={item.product_code} amount={item.points} time={moment(item.created_at).format('HH:MM')}/>
            )
        }}
        keyExtractor={item => item.id}
      />}
                {/* <ListItem description="Product" productCode="PRO123" amount="100" time="10:20"/> */}

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
        position:'absolute',
        bottom:0,
      width:'100%',
      height:240,
      backgroundColor: 'white',
      borderTopRightRadius:40,
      borderTopLeftRadius:40,
      
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
      borderRadius: 20,
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
    },
  });

export default RedeemedHistory;
