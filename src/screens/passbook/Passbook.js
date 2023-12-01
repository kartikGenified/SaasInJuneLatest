import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import RewardBox from '../../components/molecules/RewardBox';
import { useGetActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import * as Keychain from 'react-native-keychain';
import PlatinumModal from '../../components/platinum/PlatinumModal';
import { useGetPointSharingDataMutation } from '../../apiServices/pointSharing/pointSharingApi';


const Passbook = ({ navigation }) => {
    const [warrantyOptionEnabled, setWarrantyOptionEnabled] = useState(false)
    const [couponOptionEnabled, setCouponOptionEnabled] = useState(false)
    const [cashbackOptionEnabled, setCashbackOptionEnabled] = useState(false)
    const [wheelOptionEnabled, setWheelOptionEnabled] = useState(false)
    const [pointsOptionEnabled, setPointsOptionEnabled] = useState(false)
    const [PlatinumModalOpen, setPlatinumModal] = useState(false)

    const shouldSharePoints = useSelector(state => state.pointSharing.shouldSharePoints)

    const [getPointSharingFunc, {
        data: getPointSharingData,
        error: getPointSharingError,
        isLoading: getPointSharingIsLoading,
        isError: getPointSharingIsError
    }] = useGetPointSharingDataMutation()




    const [getActiveMembershipFunc, {
        data: getActiveMembershipData,
        error: getActiveMembershipError,
        isLoading: getActiveMembershipIsLoading,
        isError: getActiveMembershipIsError
    }] = useGetActiveMembershipMutation();

    const [pointSharing, setPointSharing] = useState(false)
  const colors= ["blue","red","green"]


    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const userData = useSelector(state => state.appusersdata.userData)

    console.log('userdata', userData)
    const workflowProgram = useSelector(state => state.appWorkflow.program);
    const pointSharingData = useSelector(state => state.pointSharing.pointSharing)
    console.log("pointSharingData", pointSharingData, userData)
    const name = userData.name
    const membership = getActiveMembershipData && getActiveMembershipData.body?.tier.name;


    const getOptionsAccordingToWorkflow = () => {
        if (workflowProgram.includes('Warranty')) {
            setWarrantyOptionEnabled(true)
        }
        if (workflowProgram.includes('Static Coupon')) {
            setCouponOptionEnabled(true)
        }
        if (workflowProgram.includes('Points On Product')) {
            setPointsOptionEnabled(true)
        }
        if (workflowProgram.includes('Cashback')) {
            setCashbackOptionEnabled(true)
        }
        if (workflowProgram.includes('Wheel')) {
            setWheelOptionEnabled(true)
        }

    }
    useEffect(() => {
        getOptionsAccordingToWorkflow()
        getMembership()
    }, [])

    useEffect(() => {
        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const params = {
                token: token,   
                id: String(userData.id),
                cause: "registration_bonus"
            }
            getPointSharingFunc(params)

        })();
    }, []);

    
  useEffect(() => {
    if (getPointSharingData) {
      console.log("getPointSharingData", JSON.stringify(getPointSharingData))

    }
    else if (getPointSharingError) {
      console.log("getPointSharingError", getPointSharingError)
    }
  }, [getPointSharingData, getPointSharingError])


    const checkForPointSharing = () => {
        if (pointSharingData.is_point_sharing_bw_user) {
            setPointSharing(Object.keys(pointSharingData.point_sharing_bw_user.user).includes(userData.user_type))
            console.log("pointSharingData list", pointSharingData.point_sharing_bw_user.user)
        }
    }
    const getMembership = async () => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            console.log(
                'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            getActiveMembershipFunc(token)
        }
    }

    const closePlatinumModal = () => {
        setPlatinumModal(false)
    }

    useEffect(() => {
        getOptionsAccordingToWorkflow()
        checkForPointSharing()
    }, [])

    useEffect(() => {
        if (getActiveMembershipData) {
            console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
        }
        else if (getActiveMembershipError) {
            console.log("getActiveMembershipError", getActiveMembershipError)
        }
    }, [getActiveMembershipData, getActiveMembershipError])

    const NavigateTO = (props) => {
        const title = props.title
        const discription = props.discription
        const image = props.image
        const navigateToPages = (data) => {
            if (data === "Scanned History") {
                navigation.navigate('ScannedHistory')
            }
            else if (data === "Points History") {
                navigation.navigate('PointHistory')

            }
            else if (data === "Redeemed History") {
                navigation.navigate('RedeemedHistory')

            }
            else if (data === "Cashback History") {
                navigation.navigate('CashbackHistory')

            }
            else if (data === "Coupon History") {
                navigation.navigate('CouponHistory')

            }
            else if (data === "Wheel History") {
                navigation.navigate('WheelHistory')

            }
            else if (data === "Warranty History") {
                navigation.navigate('WarrantyHistory')

            }
            else if (data === "Shared Point History") {
                navigation.navigate('SharedPointsHistory')

            }
        }


        return (
            <TouchableOpacity onPress={() => {
                navigateToPages(title)
            }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", borderBottomWidth: 1, width: '100%', borderColor: '#EEEEEE', padding: 6 }}>
                <View style={{ height: 44, width: 44, alignItems: "center", justifyContent: "center", borderRadius: 4, borderColor: ternaryThemeColor, borderWidth: 1, marginLeft: 10 }}>
                    <Image style={{ height: 26, width: 26, resizeMode: "contain" }} source={image}></Image>
                </View>
                <View style={{ height: 50, width: 210, alignItems: "flex-start", justifyContent: "center", marginLeft: 14 }}>
                    <PoppinsText style={{ color: 'black', fontSize: 14 }} content={title}></PoppinsText>
                    <PoppinsTextMedium style={{ color: 'grey', fontSize: 12, textAlign: 'left' }} content={discription}></PoppinsTextMedium>
                </View>
                <TouchableOpacity onPress={() => {
                    navigateToPages(title)
                }} style={{ marginLeft: 20 }}>
                    <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/goNext.png')}></Image>
                </TouchableOpacity>

            </TouchableOpacity>
        )
    }
    return (
        <ScrollView style={{ height: '100%', width: '100%', flex: 1 }}>
            <View style={{ alignItems: "center", height: '100%', width: "100%", backgroundColor: "white", paddingBottom: 100 }}>

                {/* coloured header */}
                <View style={{ height: 200, width: '100%', backgroundColor: ternaryThemeColor, alignItems: "flex-start", justifyContent: 'flex-start' }}>

                    <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/blackBack.png')}></Image>
                        </TouchableOpacity>
                        <PoppinsTextMedium content="Passbook" style={{ marginLeft: 10, fontSize: 18, fontWeight: '700', color: 'white' }}></PoppinsTextMedium>
                        {/* <TouchableOpacity style={{marginLeft:'50%'}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity> */}
                    </View>
                    {/* name and membership */}
                    {/* --------------------------- */}
                    <View style={{ flexDirection: "row", height: 50, width: '100%', alignItems: "center", justifyContent: "flex-start" }}>
                        <PoppinsText content={name} style={{ color: 'white', fontSize: 20, marginLeft: 20 }}></PoppinsText>
                        <View style={{ height: 20, width: 2, backgroundColor: "white", marginLeft: 10 }}></View>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                            setPlatinumModal(true)
                        }}>
                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/reward.png')}></Image>
                            <PoppinsTextMedium style={{ color: "white" }} content={membership}></PoppinsTextMedium>
                        </TouchableOpacity>

                    </View>
                    {workflowProgram?.length !== 0 && <View style={{ alignItems: "center", justifyContent: "center", width: '100%', top: 10 }}>
                        <RewardBox ></RewardBox>

                    </View>}
                </View>


                {/* options----------------------------- */}
                <View style={{ width: '90%', alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 20, marginTop: 100 }}>
                    <View style={{ width: '100%', height: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderColor: '#EEEEEE' }}>
                    {(getPointSharingData?.body?.total !=="0") ? <PoppinsTextMedium style={{ color:ternaryThemeColor, fontWeight:'bold' }} content={`Registration Bonus : ${getPointSharingData?.body?.data?.[0]?.points  ? getPointSharingData?.body?.data?.[0]?.points +"Points" :"loading"} `}></PoppinsTextMedium >
                    : <PoppinsTextMedium style={{  fontWeight:'bold' }} content="What do you want to do?"></PoppinsTextMedium>    
                }  
                    </View>
                    {
                        pointsOptionEnabled &&
                        <NavigateTO  title="Points History" discription=" list of points redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>

                    }
                    {/* ozone change */}

                    {userData.user_type!=="dealer" && <NavigateTO title="Scanned History" discription=" list of products scan by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>}
                    <NavigateTO title="Redeemed History" discription=" list of products redeemed by you" image={require('../../../assets/images/redeemedHistory.png')}></NavigateTO>
                    <NavigateTO title="Cashback History" discription=" list of cashback redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>
                    
                    {/* {
                warrantyOptionEnabled &&  */}
                    <NavigateTO title="Warranty History" discription=" list of warranty redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>
                    {/* } */}
                    {
                        couponOptionEnabled &&
                        <NavigateTO title="Coupon History" discription=" list of coupons redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>
                    }
                    {
                        cashbackOptionEnabled &&
                        <NavigateTO title="Cashback History" discription=" list of cashback redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>

                    }

                    {
                        wheelOptionEnabled &&
                        <NavigateTO title="Wheel History" discription=" list of wheel spinned by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>

                    }
                    {
                        pointSharing && userData?.user_type != "influencer" && <NavigateTO title="Shared Point History" discription=" list of shared points recieved by you" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>
                    }



                </View>
                {/* ----------------------------------- */}
            </View>
            {/* modals */}
            {PlatinumModalOpen && <PlatinumModal isVisible={PlatinumModalOpen} onClose={closePlatinumModal} getActiveMembershipData={getActiveMembershipData} />}

        </ScrollView>

    );
}

const styles = StyleSheet.create({})

export default Passbook;