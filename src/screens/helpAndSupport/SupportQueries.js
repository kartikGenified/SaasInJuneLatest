import React, {useEffect, useId, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
  Linking,
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import {useSelector} from 'react-redux';
import RectangularUnderlinedDropDown from '../../components/atoms/dropdown/RectangularUnderlinedDropDown';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';
import { useGetQueriesTypeMutation } from '../../apiServices/supportQueries/supportQueriesApi';

const SupportQueries = ({navigation}) => {
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#FFB533';

    const [getQueriesTypeFunc,{
        data:getQueriesTypeData,
        error:getQueriesTypeError,
        isLoading:getQueriesTypeIsLoading,
        isError:getQueriesTypeIsError
    }] = useGetQueriesTypeMutation()

    useEffect(()=>{
        const getTypes=async()=>{
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              console.log(
                'Credentials successfully loaded for user ' + credentials.username
              );
              const token = credentials.username
                const params = {token:token}
                getQueriesTypeFunc(params)
            }
        }
       getTypes()
    },[])
    useEffect(()=>{
        if(getQueriesTypeData){
            console.log("getQueriesTypeData",getQueriesTypeData)
        }
        else if(getQueriesTypeError){
console.log("getQueriesTypeError",getQueriesTypeError)
        }
    },[getQueriesTypeData,getQueriesTypeError])

    const modalClose = () => {
        setError(false);
        setSuccess(false)
        setMessage('')
      };

    return (
        <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'flex-start',backgroundColor:ternaryThemeColor}}>
             {error && (
        <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={modalTitle}
          message={message}
          openModal={success}
          navigateTo={navigatingFrom === "PasswordLogin" ? "PasswordLogin" : "OtpLogin"}
          params={{ needsApproval: needsApproval, userType: userType, userId: userTypeId }}></MessageModal>
      )}

      

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '10%',





        }}>
        <TouchableOpacity
          style={{
            height: 24, width: 24,
            position: 'absolute',
            top: 20,
            left: 10
          }}
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
        <View style={{ alignItems: 'center', justifyContent: 'center', position: "absolute", top: 20, left: 50 }}>
          <PoppinsTextMedium
            content="Support Queries"
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: '700',
              color: 'white',
            }}></PoppinsTextMedium>
        </View>
      </View> 
    <View style={{backgroundColor:'white',height:'90%',width:'100%',alignItems:'center',justifyContent:'center',borderTopLeftRadius:20,borderTopRightRadius:20}}>
        
    </View> 
        </View>
    );
}

const styles = StyleSheet.create({})

export default SupportQueries;
