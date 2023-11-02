import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground, TextInput, Button, ScrollView,Platform } from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useGetWarrantyByAppUserIdMutation } from '../../apiServices/workflow/warranty/ActivateWarrantyApi';
import { BaseUrlImages } from '../../utils/BaseUrlImages';
import moment from 'moment';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import { Text } from 'react-native-svg';
import BottomModal from '../../components/modals/BottomModal';
import RectangularUnderlinedDropDown from '../../components/atoms/dropdown/RectangularUnderlinedDropDown';
import { useClaimWarrantyMutation } from '../../apiServices/workflow/warranty/ClaimWarrantyApi';
import FeedbackTextArea from '../../components/feedback/FeedbackTextArea';
import ImageInput from '../../components/atoms/input/ImageInput';
import ImageInputWithUpload from '../../components/atoms/input/ImageInputWithUpload';
import ButtonRectangle from '../../components/atoms/buttons/ButtonRectangle';
import { useUploadImagesMutation } from '../../apiServices/imageApi/imageApi';

const WarrantyDetails = ({ navigation, route }) => {

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    // const [claimText, setClaimText] = useState("");
    const [modal, setModal] = useState(false);
    const [imageData, setImageData] = useState(null);

    const [
        uploadImageFunc,
        {
          data: uploadImageData,
          error: uploadImageError,
          isLoading: uploadImageIsLoading,
          isError: uploadImageIsError,
        },
      ] = useUploadImagesMutation();



    let claimText = "";

    const warrantyStart = route.params.data.created_at
    const warrantyEnd = route.params.data.end_date
    const warrantyId = route.params.data.id
    const data = route.params.data
    console.log(data)
    const secondaryThemeColor = useSelector(
        state => state.apptheme.secondaryThemeColor,
    )
        ? useSelector(state => state.apptheme.secondaryThemeColor)
        : '#FFB533';

    const [
        createWarrantyClaim,
        { data: warrantyClaimData, error: warantyClaimError },
    ] = useClaimWarrantyMutation();

    useEffect(()=>{

        if(uploadImageData){
            console.log("upload image data", uploadImageData)
            if(uploadImageData.success){
                const data = {
                    warranty_id: modalData.id,
                    description: description,
                    images: uploadImageData.uri,
                    platform_id: Platform.OS == "Android" ? 2: 3 ,
                    platform: Platform.OS,
                  };
                createWarrantyClaim()
            }   
        }
    },[uploadImageData, uploadImageError])

    useEffect(() => {

        if (warrantyClaimData?.success) {
            setSuccess(true)
        }
        else {
            setError(true)
        }

    }, [warrantyClaimData, warantyClaimError])


    console.log("data of item", data)


    const CommentTextArea = ({ placeholder, style }) => {
        const [text, setText] = useState("");

        useEffect(() => {
            claimText = text
        }, [text])

        return (
            <View style={[styles.container, style]} behavior="padding" enabled>
                <TextInput
                    multiline
                    placeholder={placeholder}
                    placeholderTextColor="#808080"
                    style={styles.textInput}
                    onChangeText={(text) => { setText(text) }}
                    value={text}
                />
            </View>
        );
    };


    const handleChildComponentData = data => {

        console.log("from image input", data);

        setImageData(data)

        // Update the responseArray state with the new data

    };

    const onSubmit = () => {
        if(claimText!=""){
            uploadImageFunc(imageData);
        }
    }





    const ClickToReport = () => {
        return (
            <View style={{ alignItems: "center", justifyContent: 'center', width: "100%", position: "absolute", bottom: 10 }}>
                <PoppinsTextMedium style={{ color: 'black', fontSize: 16, fontWeight: '700' }} content="Issue with this ?"></PoppinsTextMedium>
                <TouchableOpacity onPress={() => { navigation.navigate("ReportAndIssue", { data: data }) }} style={{ height: 50, width: 180, backgroundColor: "#D10000", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 6 }}>
                    <PoppinsTextMedium style={{ color: 'white', fontSize: 16 }} content="Click here to report"></PoppinsTextMedium>
                </TouchableOpacity>
            </View>
        )
    }
    const ScannedDetailsProductBox = (props) => {
        const productName = data.product_name
        // const productSerialNumber = props.product_code
        const productCode = data.product_code
        return (
            <View style={{ height: 200, width: '100%', backgroundColor: '#F7F7F7', alignItems: "center", justifyContent: 'center', padding: 16, marginTop: 120 }}>
                <View style={{ height: 154, width: 154, borderRadius: 10, borderWidth: 1, backgroundColor: 'white', position: "absolute", top: -74, borderColor: '#DDDDDD', alignItems: "center", justifyContent: "center" }}>
                    <Image style={{ height: 100, width: 100 }} source={require('../../../assets/images/box.png')}></Image>
                </View>
                <View style={{ alignItems: "flex-start", justifyContent: "center", position: "absolute", bottom: 10, left: 20, backgroundColor: "" }}>
                    <PoppinsTextMedium style={{ margin: 4, fontSize: 18, fontWeight: '700' }} content={`Product Name : ${productName}`}></PoppinsTextMedium>
                    <PoppinsTextMedium style={{ margin: 4, fontSize: 18, fontWeight: '700' }} content={`Product Code : ${productCode}`}></PoppinsTextMedium>
                    {/* <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700'}} content={`Product S.No : ${productSerialNumber}`}></PoppinsTextMedium> */}
                </View>


            </View>
        )
    }

    const ModalContent = () => {
        console.log("the data item", data)
        return (
            <ScrollView style={{ height: 560, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <View>
                    <View style={{ alignSelf: 'center', borderWidth: 1, marginTop: 20, width: 100 }}>

                    </View>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 30, borderRadius: 10, alignItems: 'flex-start', padding: 10, }}>
                    <View style={{ backgroundColor: '#EBF3FA', width: '100%', padding: 20, borderWidth: 1, borderColor: '#85BFF1', borderRadius: 10, borderStyle: 'dotted' }}>
                        <View style={{ flexDirection: 'row', marginLeft: 10, }}>
                            <PoppinsTextMedium content="Product Name :" style={{ color: 'black' }}></PoppinsTextMedium>
                            <PoppinsTextMedium  content={`${data?.product_name}`} style={{ color: 'black' }}></PoppinsTextMedium>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                            <PoppinsTextMedium content="Product Code :" style={{ color: 'black', fontWeight: '600' }}></PoppinsTextMedium>
                            <PoppinsTextMedium content={`${data?.product_code}`} style={{ color: 'black', fontWeight: '600' }}></PoppinsTextMedium>
                        </View>
                    </View>


                    <View style={{ marginTop: 20, width: '100%', }}>
                        <CommentTextArea style={{ borderColor: '#808080', borderBottomWidth: 0.3, }} placeholder={"Write The Product Claim"} />
                    </View>


                    <View style={{ backgroundColor: '#EBF3FA', marginTop: 30, width: '100%', }}>
                        <View>
                            <ImageInputWithUpload
                                // jsonData={item}
                                handleData={handleChildComponentData}
                                // key={index}
                                data={"image"}
                                action="Select File"></ImageInputWithUpload>
                        </View>
                    </View>


                </View>

                <View style={{ marginHorizontal: 50, height: 70, marginTop: 20 }}>
                    <ButtonRectangle backgroundColor="#FB774F" content="Submit" style={{ fontSize: 18, }} handleOperation={onSubmit} />

                </View>

            </ScrollView>
        )
    }
    return (
        <View style={{ alignItems: "center", justifyContent: "flex-start", backgroundColor: "white", height: '100%' }}>



            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
                <PoppinsTextMedium content="Warranty Details" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
                <TouchableOpacity style={{ marginLeft: 160 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity>
            </View>
            {modal &&
                <BottomModal
                    modalClose={false}
                    // message={message}
                    openModal={true}
                    comp={ModalContent} ></BottomModal>}

            <ScannedDetailsProductBox></ScannedDetailsProductBox>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <PoppinsTextMedium style={{ color: 'black', fontSize: 18 }} content={`Warranty Start : ${moment(warrantyStart).format('DD MMM YYYY')}`}></PoppinsTextMedium>
                <PoppinsTextMedium style={{ color: 'black', fontSize: 18, marginTop: 4 }} content={`Warranty End : ${moment(warrantyEnd).format('DD MMM YYYY')}`}></PoppinsTextMedium>
                <View style={{ height: 40, width: 240, alignItems: "center", justifyContent: "center", borderWidth: 1, borderStyle: 'dashed', backgroundColor: secondaryThemeColor, borderRadius: 4 }}>
                    <PoppinsTextMedium style={{ color: 'black', fontSize: 18, marginTop: 4 }} content={`Warranty Id : ${warrantyId}`}></PoppinsTextMedium>
                </View>
            </View>
            <View style={{ height: 40, width: 240, alignItems: "center", justifyContent: "center", backgroundColor: "#91B406", marginTop: 20, borderRadius: 4 }}>
                <PoppinsTextMedium style={{ color: 'white', fontSize: 18, marginTop: 4 }} content={`Download Warranty`}></PoppinsTextMedium>
            </View>
            <TouchableOpacity onPress={() => { setModal(true) }} style={{ height: 40, width: 240, alignItems: "center", justifyContent: "center", backgroundColor: "#353535", marginTop: 20, borderRadius: 4 }}>
                <PoppinsTextMedium style={{ color: 'white', fontSize: 18, marginTop: 4 }} content={`Claim Warranty/View Claim`}></PoppinsTextMedium>
            </TouchableOpacity>
            {/* <ClickToReport></ClickToReport> */}
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        height: 100,
        fontSize: 16,
        // alignSelf: 'flex-start',
        // textAlignVertical: 'center',
        paddingBottom: 20,
        color: '#000000'
    },
})

export default WarrantyDetails;