import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
const TextInputSquare = (props) => {
    const [value,setValue] = useState()
    const placeHolder = props.placeHolder
    const label = props.label
    const handleInput=(text)=>{
        setValue(text)
       
    }
    const handleInputEnd=()=>{
        let tempJsonData ={...props.jsonData,"value":value}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
    }

    return (
        <View style={{height:50,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = {label}></PoppinsTextMedium>
            </View>
            <TextInput onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:20,color:'black',fontSize:16}} placeholderTextColor="grey" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={placeHolder}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({})

export default TextInputSquare;
