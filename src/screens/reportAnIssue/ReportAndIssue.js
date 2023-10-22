import React, { useEffect, useState } from 'react';
import {View, StyleSheet,TouchableOpacity,Image,ScrollView, Dimensions, Linking,TextInput} from 'react-native';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useGetAppVideoMutation } from '../../apiServices/video/VideoApi';
import * as Keychain from 'react-native-keychain';
import Logo from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';
import RectangularUnderlinedDropDown from '../../components/atoms/dropdown/RectangularUnderlinedDropDown';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ButtonWithPlane from '../../components/atoms/buttons/ButtonWithPlane';

const ReportAndIssue = ({navigation,route}) => {

    const [description, setDescription] = useState('')
    const [imageArray, setImageArray] = useState([])
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const height = Dimensions.get('window').height
    const data = route.params.data
    const productName = data.product_name

const getReason=(data)=>{
console.log(data)
}
const getPictures=async()=>{
    const result = await launchImageLibrary();2
    console.log(result.assets[0].uri)
    let temp =[...imageArray]
    temp.push(result.assets[0].uri)
    setImageArray(temp)
}
const deleteImages=(data)=>{
    console.log("image to delete",data)
    let temp =[...imageArray]
    const filteredArray = temp.filter((item,index)=>{
        return String(item)!==String(data)
    })
    console.log("filteredArray",filteredArray)
    setImageArray(filteredArray)
}
console.log(imageArray)

const ShowImage=(props)=>{
    const image =props.image
    console.log(image)
    return(
        <View style={{alignItems:"center",justifyContent:'center',height:200,width:180,backgroundColor:'white',elevation:8,margin: 10,borderRadius:10}}>
            <TouchableOpacity style={{position:"absolute",top:-10,right:-10,height:40,width:40}} onPress={()=>{deleteImages(image)}}>
            <Logo name="cancel" size={40} color="red" ></Logo>

            </TouchableOpacity>
            <Image style={{height:'86%',width:'86%',resizeMode:"contain"}} source={{uri:image}}></Image>
        </View>
    )
}



    return (
        <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: '10%',
          marginLeft: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content="Report And Issue"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>
      <ScrollView style={{width:'100%',height:'90%'}}>

      
<View
  style={{
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: 'white',
    minHeight:height-100,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: 40,
  }}>
    <PoppinsTextMedium style={{marginLeft:20,marginTop:20,fontWeight:'700',color:'#55595A',fontSize:16}} content ={`Product Name : ${productName}`}></PoppinsTextMedium>
    <RectangularUnderlinedDropDown style={{marginLeft:10}} header="Select a reason" data={["1","2","3","4"]} handleData={getReason}></RectangularUnderlinedDropDown>
<View style={{width:'90%',borderBottomWidth:2,borderColor:"#DDDDDD",height:40,marginLeft:10,marginTop:10}}>
    <TextInput onChangeText={(val)=>{
        setDescription(val)
    }} value={description} placeholder='Write / Describe the claim issue' style={{height:'100%',width:'100%'}}></TextInput>
</View>
<View style={{alignItems:"center",justifyContent:'center',flexDirection:'row',width:'90%',marginLeft:10,height:40,marginTop:20}}>
    <PoppinsTextMedium style={{color:'#58585A',position:'absolute', left:10}} content="Upload the product image" ></PoppinsTextMedium>
    <TouchableOpacity onPress={()=>{getPictures()}} style={{position:"absolute",right:10,height:40,width:40,}}>
    <Image style={{height:40,width:40,resizeMode:'contain'}} source={require('../../../assets/images/clip.png')}></Image>

    </TouchableOpacity>
</View>
<View style={{alignItems:'center',justifyContent:'center',width:'100%',height:260}}>
<ScrollView style={{width:'100%',marginTop:20}} showsHorizontalScrollIndicator={false} horizontal={true}>
    {imageArray && imageArray.map((item,index)=>{
    return(
        <ShowImage key={index} image={item}></ShowImage>
    )
    })}
</ScrollView>
</View>

<ButtonWithPlane title="Submit" navigate="" parmas={{}}></ButtonWithPlane>
</View>


        </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({})

export default ReportAndIssue;
