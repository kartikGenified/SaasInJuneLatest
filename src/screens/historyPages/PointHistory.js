import React, { useEffect, useId } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useFetchUserPointsMutation, useFetchUserPointsHistoryMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
const PointHistory = ({ navigation }) => {
    const points = 100
    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
    }] = useFetchUserPointsMutation()

    const [fetchUserPointsHistoryFunc, {
        data: fetchUserPointsHistoryData,
        error: fetchUserPointsHistoryError,
        isLoading: fetchUserPointsHistoryLoading,
        isError: fetchUserPointsHistoryIsError
    }] = useFetchUserPointsHistoryMutation()



    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;


    useEffect(() => {
        fetchPoints()
    }, [])
    const userId = useSelector(state => state.appusersdata.id);

    const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        console.log("userId", userId)
        const params = {
            userId: String(userId),
            token: token
        }
        userPointFunc(params)
        fetchUserPointsHistoryFunc(params)

    }
    useEffect(() => {
        if (userPointData) {
            console.log("userPointData", userPointData)
        }
        else if (userPointError) {
            console.log("userPointError", userPointError)
        }

    }, [userPointData, userPointError])
    useEffect(() => {
        if (fetchUserPointsHistoryData) {
            console.log("fetchUserPointsHistoryData", fetchUserPointsHistoryData.body)
        }
        else if (fetchUserPointsHistoryError) {
            console.log("fetchUserPointsHistoryError", fetchUserPointsHistoryError)
        }

    }, [fetchUserPointsHistoryData, fetchUserPointsHistoryError])

    const DisplayEarnings = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {userPointData && <PoppinsText style={{ color: "black" }} content={userPointData.body.point_earned}></PoppinsText>}
                    <PoppinsTextMedium style={{ color: "black", fontSize: 14, color: 'black' }} content="Lifetime Earnings"></PoppinsTextMedium>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                    {userPointData && <PoppinsText style={{ color: "black" }} content={userPointData.body.point_redeemed}></PoppinsText>}
                    <PoppinsTextMedium style={{ color: "black", fontSize: 14, color: 'black' }} content="Lifetime Burns"></PoppinsTextMedium>
                </View>
                <TouchableOpacity style={{ borderRadius: 2, height: 40, width: 100, backgroundColor: "#FFD11E", alignItems: "center", justifyContent: "center", marginLeft: 20, color: 'black' }}>
                    <PoppinsTextMedium style={{ color: 'black' }} content="Redeem"></PoppinsTextMedium>
                </TouchableOpacity>
            </View>
        )
    }

    const Header = () => {
        return (
            <View style={{ height: 40, width: '100%', backgroundColor: '#DDDDDD', alignItems: "center", justifyContent: "center", flexDirection: "row", marginTop: 20 }}>
                <PoppinsTextMedium style={{ marginLeft: 20, fontSize: 16, position: "absolute", left: 10, color: 'black' }} content="Redeemed Ladger"></PoppinsTextMedium>
                <TouchableOpacity style={{ position: "absolute", right: 20 }}>
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
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 8, borderBottomWidth: 1, borderColor: '#DDDDDD', paddingBottom: 10 }}>
                <View style={{ height: 60, width: 60, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: '#DDDDDD' }}>
                    <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={require('../../../assets/images/box.png')}></Image>
                </View>
                <View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 20 }}>
                    <PoppinsTextMedium style={{ fontWeight: '700', fontSize: 14, color: 'black' }} content={description}></PoppinsTextMedium>
                    <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'black' }} content={`Product Code : ${productCode}`}></PoppinsTextMedium>
                    <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, color: 'black' }} content={time}></PoppinsTextMedium>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/wallet.png')}></Image>
                    <PoppinsTextMedium style={{ color: "#91B406", fontSize: 16, color: 'black' }} content={` + ${amount}`}></PoppinsTextMedium>
                </View>
            </View>
        )
    }
    return (
        <View style={{ alignItems: 'center', justifyContent: "center" }}>
            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
                <PoppinsTextMedium content="Point History" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
                <TouchableOpacity style={{ marginLeft: 180 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={{ padding: 14, alignItems: "center", justifyContent: "flex-start", width: "100%", flexDirection: "row" }}>
                <View style={{ width: 100 }}>
                    <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }} content="You Have"></PoppinsTextMedium>
                    {userPointData &&
                        <PoppinsText style={{ marginLeft: 14, fontSize: 34, fontWeight: '600', color: '#373737',width:100 }} content={userPointData.body.point_balance}></PoppinsText>

                    }
                    <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }} content="Points"></PoppinsTextMedium>
                </View>
                <Image style={{ height: 80, width: 80, resizeMode: 'contain', position: 'absolute', right: 20 }} source={require('../../../assets/images/points.png')}></Image>
            </View>
            <DisplayEarnings></DisplayEarnings>
            <Header></Header>
            {fetchUserPointsHistoryData && <FlatList
                data={fetchUserPointsHistoryData.body.data}
                contentContainerStyle={{ paddingBottom: 200 }}
                renderItem={({ item, index }) => {
                    // console.log(index+1,item)
                    return (
                        <ListItem description={item.product_name} productCode={item.product_code} amount={item.points} time={moment(item.created_at).format('HH:MM')} />
                    )
                }}
                keyExtractor={item => item.id}
            />}



            {
                fetchUserPointsHistoryLoading &&
                <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            }



        </View>
    );
}

const styles = StyleSheet.create({})

export default PointHistory;