import React, {useState,useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { useSelector } from 'react-redux';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const ErrorModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    const navigateTo = props.navigateTo
    
  useEffect(()=>{
    if(props.openModal===true)
    {
        setModalVisible(true)
    }
    else{
        setModalVisible(false)
    }
  },[])
  const closeModal=()=>{
    setModalVisible(!modalVisible)
    props.modalClose()
    navigation.navigate(navigateTo)
  }
   


  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            props.modalClose()
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={{color:'black',fontSize:24,fontWeight:'600'}}>SORRY</Text>
          <Icon name="disabled-by-default" size={100} color="red"></Icon>

            <Text style={{...styles.modalText,fontSize:20,fontWeight:'600'}}>{props.message}</Text>
            <Pressable
              style={{...styles.button,backgroundColor:ternaryThemeColor,width:100}}
              onPress={() => closeModal()}>
              <Text style={styles.textStyle}>Hide</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalView: {
   
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ErrorModal;