import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text,Image, TouchableOpacity} from 'react-native';
import DotHorizontalList from '../../components/molecules/DotHorizontalList';


const Introduction = ({navigation}) => {
    const [imageIndex, setImageIndex] = useState(0)
    const [skipEnabled, setSkipEnabled] = useState(false)

    useEffect(()=>{
        setTimeout(() => {
            setSkipEnabled(true)
         }, 1500);
         
    },[])
    // This is the array used to display images, add or remove image from the array to modify as per clients need----------------
    
    const descriptionImages=[require('../../../assets/images/genuinemarkDescription.png'),require('../../../assets/images/rewardifyDescription.png'),require('../../../assets/images/dwamDescription.png'),require('../../../assets/images/scanAndWinDescription.png')]

    
    
    // function to handle next button press and to navigate to Select Language page when all the images are showed-----------------
    const handleNext=()=>{
        console.log(descriptionImages.length)
        if(imageIndex<descriptionImages.length)
        {
            
            if(imageIndex==descriptionImages.length-1)
            {
                // navigation.navigate('SelectLanguage')
        navigation.navigate('SelectUser')

            }
            else{
                setImageIndex(imageIndex+1)
            }
        }
        
    }


    const handleSkip=()=>{
        // navigation.navigate('SelectLanguage')
        navigation.navigate('SelectUser')

    }

    return (
        <View style={{backgroundColor:"#F2F2F2",height:'100%',width:'100%',flex:1}}>
            <View style={{height:'20%',width:'100%'}}>

            </View>
            <View style={{width:'100%',height:'60%'}}>
                <Image style={{height:"100%",width:"100%"}} source={descriptionImages[imageIndex]}></Image>
            </View>
            <View style={{height:'20%',width:'100%',paddingBottom:20}}>
            <DotHorizontalList no = {descriptionImages.length} primaryColor="white" secondaryColor="#0085A2" selectedNo = {imageIndex} ></DotHorizontalList>
            
            <View style={{width:"100%",height:'100%'}}>
                {skipEnabled && <TouchableOpacity disabled={!skipEnabled} style={{position:"absolute",left:40,bottom:20}} onPress={()=>{handleSkip()}}>
                <Text style={{fontSize:18,color:"#0087A2",fontWeight:'600'}}>Skip</Text>

                </TouchableOpacity>}
                <Text onPress={()=>{handleNext()}} style={{fontSize:18,color:"#0087A2",position:"absolute",right:40,bottom:20,fontWeight:'600'}}>Next</Text>
            </View>
            </View>
            
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default Introduction;
