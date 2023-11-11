import React, { Component,useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import InputDate from '../atoms/input/InputDate';
import PoppinsTextLeftMedium from '../electrons/customFonts/PoppinsTextLeftMedium';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import BottomModal from './BottomModal';
import { useSelector } from 'react-redux';

// create a component
const FilterModal = ({modalClose, message, openModal,handleFilter}) => {

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const ModalContent = (props) => {

        const[startDate, setStartDate] = useState("")
        const[endDate, setEndDate] = useState("")
        
        
  
  
        const handleStartDate = (startdate) =>{
          // console.log("start date", startdate)
          setStartDate(startdate?.value)
          props.handleFilter(startdate?.value,"start")
        }
      
        const handleEndDate = (enddate) =>{
          // console.log("end date", enddate?.value)
          setEndDate(enddate?.value)
          props.handleFilter(enddate?.value,"end")
        }

        const fetchDataAccToFilter=()=>{
            console.log(startDate,endDate)
            // setOpenBottomModal(!openModal)
            modalClose()
          }

        return (
          <View style={{ height: 320, backgroundColor: 'white', width: '100%',borderTopRightRadius:20,borderTopLeftRadius:20 }}>
            <PoppinsTextLeftMedium content="Filter Scanned Data" style={{ color: 'black', marginTop:20,marginLeft:'35%', fontWeight:'bold'  }}></PoppinsTextLeftMedium>
            <View>
              <InputDate data="Start Date" handleData={handleStartDate}/>
  
            </View>
            <View>
              <InputDate data="End Date" handleData={handleEndDate} />
            </View>
            <TouchableOpacity onPress={()=>{fetchDataAccToFilter()}} style={{backgroundColor: ternaryThemeColor,marginHorizontal:50, height:40,alignItems:'center', justifyContent:'center', marginTop:10,borderRadius:10}}>
              <PoppinsTextMedium content="SUBMIT" style={{color:'white', fontSize:20, borderRadius:10,}}></PoppinsTextMedium>
            </TouchableOpacity>
  
          </View>
        )
      }

    return (
            <BottomModal
                modalClose={modalClose}
                message={message}
                openModal={openModal}
                handleFilter={handleFilter}
                comp={ModalContent}></BottomModal>
      
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default FilterModal;