import React from 'react';
import {View, StyleSheet,TouchableOpacity,Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Bell from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigation,DrawerActions } from '@react-navigation/core';
import { BaseUrl } from '../../utils/BaseUrl';

const DrawerHeader = () => {
    const navigation = useNavigation()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const icon = useSelector(state => state.apptheme.icon)
        ? useSelector(state => state.apptheme.icon)
        : require('../../../assets/images/demoIcon.png');
    return (
        <View style={{height:60,width:'100%',flexDirection:"row",alignItems:"center",marginBottom:20,backgroundColor:"white"}}>
            <TouchableOpacity onPress={()=>{navigation.dispatch(DrawerActions.toggleDrawer());}} style={{marginLeft:10}}>
            <Icon name="bars" size={30} color={ternaryThemeColor}></Icon>
            </TouchableOpacity>
            <Image style={{height:40,width:60,resizeMode:"contain",marginLeft:20}} source={{uri: `${BaseUrl}/api/images/${icon}`}}></Image>
            <TouchableOpacity onPress={()=>{navigation.navigate("Notification")}} style={{marginLeft:210}}>
                <Bell name="bell" size={30} color={ternaryThemeColor}></Bell>
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default DrawerHeader;
