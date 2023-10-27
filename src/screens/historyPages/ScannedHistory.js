import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Text, ScrollView } from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useFetchAllQrScanedListMutation } from '../../apiServices/qrScan/AddQrApi';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useAllUserPointsEntryMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
import moment from 'moment';
import BottomModal from '../../components/modals/BottomModal';

const ScannedHistory = ({ navigation }) => {
  const [distinctDateArr, setDistinctDateArr] = useState()
const [scannedListData, setScannedListData] = useState([])
  const [
    fetchAllQrScanedList,
    {
      data: fetchAllQrScanedListData,
      isLoading: fetchAllQrScanedListIsLoading,
      error: fetchAllQrScanedListError,
      isError: fetchAllQrScanedListIsError,
    },
  ] = useFetchAllQrScanedListMutation();

  const [userPointFunc, {
    data: userPointData,
    error: userPointError,
    isLoading: userPointIsLoading,
    isError: userPointIsError
  }] = useFetchUserPointsMutation()

  const qrData = useSelector(state => state.qrData.qrData)
  const userId = useSelector(state => state.appusersdata.userId);
  const id = useSelector(state => state.appusersdata.id);

  const userData = useSelector(state => state.appusersdata.userData)
  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData)
    }
    else if (userPointError) {
      console.log("userPointError", userPointError)
    }

  }, [userPointData, userPointError])
  const toDate = undefined
  var fromDate = undefined
  useEffect(() => {

    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      let queryParams = `?user_type_id=${userData.user_type_id
        }&app_user_id=${userData.id}`;
      if (fromDate && toDate) {
        queryParams += `&from_date=${moment(fromDate).format('YYYY-MM-DD')}&to_date=${moment(toDate).format('YYYY-MM-DD')}`;
      } else if (fromDate) {
        queryParams += `&from_date=${fromDate}`;
      }

      console.log("queryParams", queryParams);

      fetchAllQrScanedList({
        token: token,

        query_params: queryParams,
      });
    })();
  }, []);
  useEffect(() => {
    if (fetchAllQrScanedListData) {
      console.log("fetchAllQrScanedListData", fetchAllQrScanedListData.body.data)
      fetchDates(fetchAllQrScanedListData.body.data)
    }
    else if (fetchAllQrScanedListIsLoading) {
      console.log("fetchAllQrScanedListIsLoading", fetchAllQrScanedListIsLoading)
    }
  }, [fetchAllQrScanedListData, fetchAllQrScanedListIsLoading])

  useEffect(() => {
    fetchPoints()
  }, [])
  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: id,
      token: token
    }
    userPointFunc(params)

  }

  const fetchDates = (data) => {
    const dateArr = []
    let tempArr =[]
    let tempData=[]
    data.map((item,index) => {
      dateArr.push(moment(item.scanned_at).format("DD-MMM-YYYY"))
    })
    const distinctDates = Array.from(new Set(dateArr))
    console.log("distinctDates",distinctDates)

    distinctDates.map((item1,index)=>{
        tempData=[]
       data.map((item2,index)=>{
        if(moment(item2.scanned_at).format("DD-MMM-YYYY")===item1)
        {
            tempData.push(item2)
        }
       })
       tempArr.push({
        "date":item1,
            "data":tempData
        })
    })
   setScannedListData(tempArr)
    console.log("tempArr",JSON.stringify(tempArr))
  }
  var count = 0


  const DisplayEarnings = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const handleRedeemButtonPress = () => {
      if (Number(userPointData.body.point_balance) <= 0) {
        setError(true)
        setMessage("You dont have enough points !")
      }
      else {
        setModalVisible(true)
      }

    }
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20, marginLeft: 20 }}>

        <View style={{ alignItems: "center", }}>
          {userPointData && <PoppinsText style={{ color: "black" }} content={userPointData.body.point_earned}></PoppinsText>}
          <PoppinsTextMedium style={{ color: "black", fontSize: 14 }} content="Lifetime Earnings"></PoppinsTextMedium>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 25 }}>
          {userPointData && <PoppinsText style={{ color: "black" }} content={userPointData.body.point_redeemed}></PoppinsText>}
          <PoppinsTextMedium style={{ color: "black", fontSize: 14, }} content="Lifetime Burns"></PoppinsTextMedium>
        </View>

      </View>
    )
  }

  const Header = () => {
    const [openBottomModal, setOpenBottomModal] = useState(false)
    const [message, setMessage] = useState()
    const modalClose = () => {
      setOpenBottomModal(false);
    };
    const ModalContent = () => {
      return (
        <View style={{ alignItems: "center", justifyContent: 'center', height: 100, width: 200, backgroundColor: 'red', margin: 20 }}></View>
      )
    }
    return (
      <View style={{ height: 40, width: '100%', backgroundColor: '#DDDDDD', alignItems: "center", justifyContent: "center", flexDirection: "row", marginTop: 20 }}>
        {openBottomModal && <BottomModal
          modalClose={modalClose}
          message={message}
          openModal={openBottomModal}
          comp={ModalContent}></BottomModal>}
        <PoppinsTextMedium style={{ marginLeft: 20, fontSize: 16, position: "absolute", left: 10 }} content="Redeemed Ladger"></PoppinsTextMedium>

        <TouchableOpacity onPress={() => { setOpenBottomModal(!openBottomModal), setMessage("BOTTOM MODAL") }} style={{ position: "absolute", right: 20 }}>
          <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image>

        </TouchableOpacity>
      </View>
    )
  }
  const ListItem = (props) => {
    const description = props.description
    const productCode = props.productCode
    const time = props.time
    const amount = props.amount
    const data = props.data
    console.log("data",data)
    const image = data.images!==null ? data.images[0] : null
    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate('ScannedDetails', { data: data })
      }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 4, width: '100%',backgroundColor:'white' }}>
        <View style={{ height: 70, width: 70, alignItems: "center", justifyContent: "center", borderRadius: 10, borderColor: '#DDDDDD' }}>
          {image!==null &&<Image style={{ height: 60, width: 60, resizeMode: "contain" }} source={{ uri: BaseUrlImages + image }}></Image>}
        </View>
        <View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 10, width: 200 }}>
          <PoppinsTextMedium style={{ fontWeight: '600', fontSize: 14, textAlign: 'auto' }} content={description}></PoppinsTextMedium>
          <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12 }} content={`Product Code : ${productCode}`}></PoppinsTextMedium>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Image style={{ height: 14, width: 14, resizeMode: "contain" }} source={require('..s/../../assets/images/clock.png')}></Image>
            <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, marginLeft: 4 }} content={time}></PoppinsTextMedium>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 10 }}>
          <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/wallet.png')}></Image>
          <PoppinsTextMedium style={{ color: "#91B406", fontSize: 16 }} content={` + ${amount}`}></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View style={{ alignItems: "center", justifyContent: "flex-start", height: "100%", backgroundColor: '#ffffff' }}>
      <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
        <TouchableOpacity onPress={() => {
          navigation.goBack()
        }}>
          <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

        </TouchableOpacity>
        <PoppinsTextMedium content="Scanned History" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
        <TouchableOpacity style={{ marginLeft: 160 }}>
          {/* <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image> */}
        </TouchableOpacity>
      </View>
      <View style={{ padding: 14, alignItems: "flex-start", justifyContent: "flex-start", width: "100%" }}>
        <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }} content="You Have"></PoppinsTextMedium>


        {userPointData && <PoppinsText style={{ color: "black", marginLeft: 10, fontSize: 24, fontWeight: '600' }} content={userPointData.body.point_balance}></PoppinsText>}
        <Image style={{ position: 'absolute', right: 0, width: 82, height: 98, marginRight: 23, marginTop: 20 }} source={require('../../../assets/images/scanned.png')}></Image>



        <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }} content="Point Balance"></PoppinsTextMedium>

        <DisplayEarnings></DisplayEarnings>

      </View>
      <Header></Header>
      <ScrollView contentContainerStyle={{width:'100%'}}>
      {
        scannedListData && scannedListData.map((item,index)=>{
            return(
                <View style={{ alignItems: "flex-start", justifyContent: "center", width: '100%' }} key={index}>
                    
                <View style={{ alignItems: "center", justifyContent: "center", paddingBottom: 10, marginTop: 20,marginLeft:20,width:'100%'}}>
                  <PoppinsTextMedium style={{ color: 'black', fontSize: 16 }} content={(item.date)}></PoppinsTextMedium>
                 
                </View>
                
                {
                    item.data.map((item,index)=>{
                        return(
                            <ListItem key={item.id}  data={item} description={item.product_name} productCode={item.product_code} time={moment(item.scanned_at).format('HH:MM')} amount={item.points_on_product}></ListItem>

                        )
                    })
                }
              </View>
            )
            
        })
      }
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({})

export default ScannedHistory;