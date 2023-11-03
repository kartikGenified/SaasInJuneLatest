//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import moment from 'moment';

// create a component
const WarrantyClaimDetails = ({ navigation, route }) => {

    const warrantyItemData = route.params.warrantyItemData;
    const afterClaimData = route.params.afterClaimData;

    console.log("after claim data", afterClaimData)


    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#002940';


    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image source={require('../../../assets/images/warrantyReport.png')} style={{ height: 82, width: 75 }} />
            </View>
            <View style={{ marginTop: 18, }}>
                <PoppinsTextMedium content="Dear User" style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }} />
            </View>
            <View style={{ marginTop: 18, paddingHorizontal: 20 }}>
                <PoppinsTextMedium content="Thank You For Submitting Your details." style={{ fontWeight: '600', fontSize: 18, color: ternaryThemeColor }} />
                <PoppinsTextMedium content="We will get back to you soon." style={{ fontWeight: '600', fontSize: 18, color: ternaryThemeColor }} />
            </View>

            <View style={{ marginTop: 20 }}>
                <PoppinsTextMedium content={`Claim Date : ${ moment(afterClaimData?.body?.claim_date).format('YYYY-MM-DD') }`} style={{ fontWeight: '700', fontSize: 20, color: ternaryThemeColor }} />
            </View>

            <View style={{
                marginTop: 50,
                paddingTop: 10,
                paddingBottom: 20,
                width: '90%',
                marginBottom: 10,

                borderWidth: 1,
                borderRadius: 10,
                borderStyle: 'dashed',
                borderColor: '#85BFF1',
                alignSelf: 'center'
            }}>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row' }}>
                    <PoppinsTextMedium content="Prdoduct Name : " style={{ fontWeight: '700', fontSize: 20, color: "#474747" }} />
                    <PoppinsTextMedium content={`${warrantyItemData?.product_name}`} style={{ fontWeight: '700', fontSize: 20, color: "#474747" }} />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row' }}>
                    <PoppinsTextMedium content="Prdoduct Code : " style={{ fontWeight: '700', fontSize: 20, color: "#474747" }} />
                    <PoppinsTextMedium content={`${warrantyItemData?.product_code}`} style={{ fontWeight: '700', fontSize: 20, color: "#474747" }} />
                </View>


                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <PoppinsTextLeftMedium content="Product Damage : " style={{ fontWeight: '700', fontSize: 20, color: ternaryThemeColor, }} />
                </View>
                <View style={{ marginHorizontal: 20, justifyContent: 'flex-start', }}>
                    <PoppinsTextLeftMedium style={{ fontWeight: '400', fontSize: 17, color: ternaryThemeColor, textAlign: 'left' }} content={`${warrantyItemData?.description}`} ></PoppinsTextLeftMedium>
                </View>
                <View style={{
                    alignItems: 'left',
                    justifyContent: 'left',
                    marginTop: 20,
                    marginLeft: 20
                    // backgroundColor:'red'
                }}>
                    <Image style={{ height: 60, width: 63 }} source={require('../../../assets/images/giftSmall.png')} />
                </View>

            </View>

            {/* {
                fetchAllQrScanedListIsLoading && <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            } */}


        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    imageView: {
        marginTop: 76,
        alignSelf: 'center',

    }
});

//make this component available to the app
export default WarrantyClaimDetails;


