import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
const TextInputRectangularWithPlaceholder = (props) => {
    const [value,setValue] = useState(props.value)
    console.log("value",props.value)
    const placeHolder = props.placeHolder
    const maxLength = props.maxLength
    useEffect(()=>{
        setValue(props.value)
    },[props.value])
    const handleInput=(text)=>{
        setValue(text)
        props.handleData(text)
    }
    const handleInputEnd=(text)=>{
    //    console.log(text)
        props.handleData(text)
    }

    return (
        <View style={{height:60,width:'86%',borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10,borderWidth:0.6}}>
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = {placeHolder}></PoppinsTextMedium>
            </View>
            <TextInput  maxLength={maxLength} onEndEditing={()=>{handleInputEnd(value)}} style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:32,letterSpacing:1,fontSize:16,color:'black'}} placeholderTextColor="#DDDDDD" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={placeHolder}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({})

export default TextInputRectangularWithPlaceholder;
