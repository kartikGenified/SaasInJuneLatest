import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { SvgUri } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import Dashboard from '../../screens/dashboard/Dashboard';
import { useTranslation } from 'react-i18next';
import { select_user_type } from '../../utils/usertTypeOption';


const SelectUserBox = (props) => {
    const [boxColor, setBoxColor] = useState('white')
    const focused = useIsFocused()
    const { t } = useTranslation()

    const image = props.image
    // const image = 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/atom.svg'
    // console.log(image)
    const color = props.color
    const otpLogin = props.otpLogin
    // const passwordLogin = props.passwordLogin
    // const autoApproval = props.autoApproval
    const manualApproval = props.manualApproval
    const registrationRequired = props.registrationRequired
    console.log(props.content, registrationRequired)

    useEffect(() => {
        setBoxColor("white")

    }, [focused])





    const checkRegistrationRequired = () => {
        setBoxColor(color)
        setTimeout(() => {
            if (registrationRequired.includes(props.content)) {
                checkApprovalFlow(true)
                console.log("registration required")
            }
            else {
                checkApprovalFlow(false)
                console.log("registration not required")

            }
        }, 400);

    }

    const checkApprovalFlow = (registrationRequired) => {
        if (manualApproval.includes(props.content)) {
            handleNavigation(true, registrationRequired)
        }
        else {
            handleNavigation(false, registrationRequired)
        }

    }

    const handleNavigation = (needsApproval, registrationRequired) => {
        console.log("Needs Approval", needsApproval)
        if (otpLogin.includes(props.content)
        ) {
            props.navigation.navigate('OtpLogin', { needsApproval: needsApproval, userType: props.content, userId: props.id, registrationRequired: registrationRequired })
        }
        else {
            props.navigation.navigate('PasswordLogin', { needsApproval: needsApproval, userType: props.content, userId: props.id, registrationRequired: registrationRequired })
            console.log("Password Login", props.content, props.id, registrationRequired, needsApproval)
        }

    }

    return (
        <TouchableOpacity onPress={() => {
            checkRegistrationRequired()
        }} style={{ ...styles.container, backgroundColor: boxColor }}>

            <View style={{ flexDirection: select_user_type == "grid" ? "column" : "row" , }}>

                {image!=null && <View style={{ height: 90, width: 90, borderRadius: 45, backgroundColor: "white",alignItems: "center", justifyContent: 'center', marginLeft:select_user_type =="grid" ? 0:0 , alignSelf:select_user_type == "grid" ? "center" : ""}}>
                    <Image source={{ uri: image }} style={styles.image}></Image>
                    {/* <SvgUri width={'100%'} height={'100%'} uri={image}></SvgUri> */}

                </View>}

                <View style={select_user_type == "list" ? {marginLeft:"10%", }:{marginLeft:0, }}>
                    <PoppinsTextMedium style={{ color: '#B0B0B0', marginTop: select_user_type == "grid" ? 20 : 30, fontSize: select_user_type == "grid" ? 17 : 24, fontWeight: '700' }} content={(props.content).toUpperCase() == "CARPENTER" ? t("CARPENTER") : (props.content).toUpperCase() == "CONTRACTOR" ? t("CONTRACTOR") : (props.content).toUpperCase() == "FABRICATOR" ? t("FABRICATOR") : props.content.toUpperCase() == "DEALER" ? t("DEALER") : props.content.toUpperCase() == "SALES" ? t("SALES") : props.content.toUpperCase()}></PoppinsTextMedium>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: select_user_type == "grid" ? 170 : 100,
        width: select_user_type == "grid" ? "42%" : "92%",
        alignItems: select_user_type == "grid" ? "center" : "flex-start",
        justifyContent: select_user_type == "grid" ? "center" : "",
        margin: 10,
        elevation: 4,
        borderRadius: 10,
        borderWidth: 0.8,
        borderColor: '#DDDDDD'

    },
    image: {
        height: select_user_type == "grid" ? 80 : 70,
        width: 80,
        borderRadius: 45,
        // marginLeft: select_user_type == "grid" ? 0 : 25,
        marginBottom: select_user_type == "grid" ? 8 : 0,
         resizeMode: 'contain'


    }
})

export default SelectUserBox;

