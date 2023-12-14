import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useFetchCashbackEnteriesOfUserMutation } from '../../apiServices/workflow/rewards/GetCashbackApi';
import DataNotFound from '../data not found/DataNotFound';
import AnimatedDots from '../../components/animations/AnimatedDots';

const CashbackHistory = ({ navigation }) => {
    const [showNoDataFound, setShowNoDataFound] = useState(false)
    const cashback = 0
    const userId = useSelector(state => state.appusersdata.userId);
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#FFB533';
    console.log(userId)
    const [fetchCashbackEnteriesFunc, {
        data: fetchCashbackEnteriesData,
        error: fetchCashbackEnteriesError,
        isLoading: fetchCashbackEnteriesIsLoading,
        isError: fetchCashbackEnteriesIsError
    }] = useFetchCashbackEnteriesOfUserMutation()


    useEffect(() => {
        const getData = async () => {

            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log(
                    'Credentials successfully loaded for user ' + credentials.username
                );
                const token = credentials.username
                const params = { token: token, userId: userId }
                fetchCashbackEnteriesFunc(params)
            }
        }
        getData()

    }, [])
    useEffect(() => {
        if (fetchCashbackEnteriesData) {
            console.log("fetchCashbackEnteriesData", fetchCashbackEnteriesData)
            if (fetchCashbackEnteriesData.body.data.length === 0) {
                setShowNoDataFound(true)
            }
        }
        else if (fetchCashbackEnteriesError) {
            console.log("fetchCashbackEnteriesError", fetchCashbackEnteriesError)
        }
    }, [fetchCashbackEnteriesData, fetchCashbackEnteriesError])


    const Header = () => {
        return (
            <View style={{ height: 40, width: '100%', backgroundColor: '#DDDDDD', alignItems: "center", justifyContent: "center", flexDirection: "row", marginTop: 20 }}>
                <PoppinsTextMedium style={{ marginLeft: 20, fontSize: 16, position: "absolute", left: 10, color:'black' }} content="Cashback Ledger"></PoppinsTextMedium>
                <View style={{ position: "absolute", right: 20 }}>
                    {/* <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image> */}
                    <Image
            style={{ height: 22, width: 22, resizeMode: "contain" }}
            source={require("../../../assets/images/list.png")}
          ></Image>
                </View>
            </View>
        )
    }
    const CashbackListItem = (key,data) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('CashbackDetails')
            }} style={{ alignItems: "flex-start", justifyContent: "center", width: "90%", borderBottomWidth: 1, borderColor: "#DDDDDD", paddingBottom: 10, margin: 10 }}>
                <View style={{ alignItems: "flex-start", justifyContent: "flex-start", flexDirection: "row", marginBottom: 10 }}>
                    <PoppinsTextMedium style={{ color: 'black', fontWeight: '600', fontSize: 18, }} content="Credited to cash balance"></PoppinsTextMedium>
                    <PoppinsTextMedium style={{ color: '#91B406', fontWeight: '600', fontSize: 18, marginLeft: 50 }} content="INR +100"></PoppinsTextMedium>

                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image style={{ height: 50, width: 50, resizeMode: "contain" }} source={require('../../../assets/images/greenRupee.png')}></Image>
                    <View style={{ alignItems: "flex-start", justifyContent: "flex-start", marginLeft: 20 }}>
                        <PoppinsTextMedium style={{ color: 'black', fontWeight: '600', fontSize: 18, }} content="Product Warranty Activation"></PoppinsTextMedium>
                        <PoppinsTextMedium style={{ color: '#91B406', fontWeight: '600', fontSize: 18 }} content="2 Sept 2023 11:30 AM"></PoppinsTextMedium>

                    </View>
                </View>

            </TouchableOpacity>
        )
    }
    return (
        <View style={{ alignItems: "center", justifyContent: "flex-start" }}>
            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
                <PoppinsTextMedium content="Cashback History" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
                {/* <TouchableOpacity style={{ marginLeft: 160 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
            </View>
            <View style={{ padding: 14, alignItems: "flex-start", justifyContent: "flex-start", width: "100%", }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        style={{ height: 30, width: 30, resizeMode: "contain", marginTop:8 }}
                        source={require("../../../assets/images/wallet.png")}
                    ></Image>

                    <PoppinsText style={{ marginLeft: 10, fontSize: 34, fontWeight: '600', color: 'black' }} content={fetchCashbackEnteriesData?.body?.total != undefined ?  `${fetchCashbackEnteriesData?.body?.total}` : <AnimatedDots color={'black'}/>}></PoppinsText>
                </View>

                {/* <PoppinsTextMedium style={{marginLeft:10,fontSize:20,fontWeight:'600',color:'#6E6E6E'}} content="Cashback"></PoppinsTextMedium> */}
                <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }} content="Cashbacks are now instantly credited"></PoppinsTextMedium>
                <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 15, fontWeight: '700', color: '#6E6E6E' }} content="Total cashback earned till date"></PoppinsTextMedium>

            </View>
            <Header></Header>

            <FlatList
              initialNumToRender={20}
              contentContainerStyle={{alignItems:"center",justifyContent:"center"}}
              style={{width:'100%'}}
                data={fetchCashbackEnteriesData?.body?.data}
                renderItem={({ item, index }) => (
                  <CashbackListItem
                    key={index}
                    data={item}
                  ></CashbackListItem>
                )}
                keyExtractor={(item) => item.id}
              />
            
            {/* <CashbackListItem></CashbackListItem> */}
           

        </View>

    );
}

const styles = StyleSheet.create({})

export default CashbackHistory;