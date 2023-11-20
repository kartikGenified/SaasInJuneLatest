//import liraries
import React, { Component, useState , useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useFetchAllfaqsMutation } from '../../apiServices/faq/faqApi';
import * as Keychain from 'react-native-keychain';


// create a component
const FAQ = ({ navigation }) => {

    const[faqData, setFAQData] = useState([]);
    const[error,setError] = useState(false);

    const [fetchFAQ, {
        data:fetchFAQData, 
        error:FAQError,
        isLoading:FAQIsLoading,
        isError:FAQIsError
      }] = useFetchAllfaqsMutation()
  

    const tempArr = [
        {
            que: 'What is FAQ',
            ans: 'FAQ is FAQ'
        },

        {
            que: 'What is Not FAQ',
            ans: 'Not FAQ is Not FAQ'
        },

    ]

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    
    
    useEffect(()=>{
        const getToken=async()=>{
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              console.log(
                'Credentials successfully loaded for user ' + credentials.username
              );
              const token = credentials.username;
              let parmas = {
                token:token,
              }
                fetchFAQ(parmas)
            }
          }
          getToken();
        //   fetchFAQ();
    },[])

    useEffect(()=>{
       if(fetchFAQData){
        setFAQData(fetchFAQData.body.faqList)
        
       }
       else{
        setError(true)
       }
    },[fetchFAQData, FAQError])



        

    const faqComp = (item) => {
        console.log("FAQ item", FAQ)
        const [queVisible, setQueVisible] = useState(false);
        return (
            <View style={{ marginHorizontal: 20, borderWidth: 1, marginTop: 20, padding: 10, borderRadius: 5, borderColor:"#80808040" }}>
                <TouchableOpacity onPress={() => {
                    setQueVisible(!queVisible)
                }} style={{ flexDirection: 'row' }}>
                    <Image style={{ height: 14, width: 14, resizeMode: "contain", position: "absolute", right: 10, top: 10 }} source={require('../../../assets/images/arrowDown.png')}></Image>
                    <View >
                        <PoppinsTextLeftMedium style={{ fontSize: 20, color: '#000000', fontWeight: '800' }} content={item?.que}></PoppinsTextLeftMedium>
                    </View>
                </TouchableOpacity>


                {queVisible && (
                    <PoppinsTextLeftMedium content={item.ans} style={{ fontSize: 16, color: '#808080', fontWeight: '600', marginTop: 10 }}></PoppinsTextLeftMedium>
                )}

            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    height: 50,
                    width: '100%',
                    backgroundColor: ternaryThemeColor,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    // marginTop: 10,
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, position: 'absolute', left: 20, marginTop: 10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain', marginTop:5 }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff', marginTop: 10, position: 'absolute', left: 50 }} content={"FAQ"}></PoppinsTextMedium>


            </View>
            {/* navigator */}
            {console.log("faqData faq", faqData)}
            {
                faqData && faqData?.map((item) => {
                    return (
                        <View id={item.id}>
                            {faqComp(item)}
                        </View>
                    )

                })
            }
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default FAQ;