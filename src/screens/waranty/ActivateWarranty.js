import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextInputRectangleMandatory from '../../components/atoms/input/TextInputRectangleMandatory';
import TextInputRectangle from '../../components/atoms/input/TextInputRectangle';
import TextInputNumericRectangle from '../../components/atoms/input/TextInputNumericRectangle';
import InputDate from '../../components/atoms/input/InputDate';
import ImageInput from '../../components/atoms/input/ImageInput';
import ButtonOval from '../../components/atoms/buttons/ButtonOval';
import ProductList from '../../components/molecules/ProductList';
import {useUploadImagesMutation} from '../../apiServices/imageApi/imageApi';
import {useActivateWarrantyMutation} from '../../apiServices/workflow/warranty/ActivateWarrantyApi';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';

const ActivateWarranty = ({navigation, route}) => {
  const [responseArray, setResponseArray] = useState([]);
  const [addressData, setAddressData] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [invoice, setInvoice] = useState();
  const [date, setDate] = useState();
  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadImagesMutation();

  const [
    activateWarrantyFunc,
    {
      data: activateWarrantyData,
      error: activateWarrantyError,
      isLoading: activateWarantyIsLoading,
      isError: activateWarrantyIsError,
    },
  ] = useActivateWarrantyMutation();

  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#ef6110';
console.log("date console",date)
  const qrData = useSelector(state => state.qrData.qrData);
  const productData = useSelector(state => state.productData.productData);
  console.log('QR data', productData);
  const platform = Platform.OS === 'ios' ? '1' : '2';
  const productList = [];
  productList.push(qrData.created_by_name);
  // const productList=route.params.productList
  const height = Dimensions.get('window').height;
  const form = useSelector(state => state.form.warrantyForm);
  const formTemplateId = useSelector(state => state.form.warrantyFormId);
  const userType = useSelector(state => state.appusersdata.userType);
  const userTypeId = useSelector(state => state.appusersdata.userId);
  const location = useSelector(state=>state.userLocation.location)

  console.log(form);
  const workflowProgram = route.params.workflowProgram;

  useEffect(() => {
    if (uploadImageData) {
      console.log("uploadImageData",uploadImageData);
      const uploadArray=[]
      uploadArray.push(uploadImageData.body[0].filename)
      submitDataWithToken(uploadArray);
    } else {
      console.log(uploadImageError);
    }
  }, [uploadImageData, uploadImageError]);

  useEffect(() => {
    if (activateWarrantyData) {
      console.log('activate warranty data is', activateWarrantyData);
      if(activateWarrantyData.success)
      {
        handleWorkflowNavigation()
      }
      else{
        alert("Warranty status false")
      }
    } else if(activateWarrantyError) {
      if(activateWarrantyError.status===409)
      {
        handleWorkflowNavigation()
      }
      console.log("activateWarrantyError",activateWarrantyError);
    }
  }, [activateWarrantyData, activateWarrantyError]);

  const submitDataWithToken = async data => {
    console.log('image data is', data);

    try {
        const body= {
          name: name,
          phone: phone,
          warranty_start_date: date,
          warranty_image: data,
          user_type_id:  userTypeId,
          user_type: userType,
          product_id: productData.product_id,
          form_template_id: JSON.stringify(formTemplateId),
          platform_id: platform,
          secondary_data: responseArray,
          qr_id:qrData.id
      }
     
      console.log('body is', JSON.stringify(body));
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username,
        );

        const token = credentials.username;

        activateWarrantyFunc({token, body});
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  

  const warrantyForm = Object.values(form);
  // console.log(Object.keys(form))
  console.log(warrantyForm);
  // const handleDataTextInputMandatory = (data) => {
  //     console.log(data)
  // }
  // const handleDataTextInput = (data) => {
  //     console.log(data)
  // }
  // const handleOpenImageGallery = async () => {
  //     const result = await launchImageLibrary();
  // };
  const handleChildComponentData = data => {
    console.log("data",data);

    // Update the responseArray state with the new data
    setResponseArray(prevArray => {
      const existingIndex = prevArray.findIndex(
        item => item.name === data.name,
      );

      if (existingIndex !== -1) {
        // If an entry for the field already exists, update the value
        const updatedArray = [...prevArray];
        updatedArray[existingIndex] = {
          ...updatedArray[existingIndex],
          value: data.value,
        };
        return updatedArray;
      } else {
        // If no entry exists for the field, add a new entry
        return [...prevArray, data];
      }
    });
  };
  console.log('Response Array Is', JSON.stringify(responseArray));
  const handleWarrantyFormSubmission = () => {
    responseArray &&
      responseArray.map(item => {
        if (item.name === 'name' || item.name === 'Name') {
          setName(item.value);
        } else if (item.name === 'phone' || item.name === 'Phone') {
          setPhone(item.value);
        } else if (item.name === 'invoice' || item.name === 'Invoice') {
          console.log('Inside file');

          const imageData = {
            uri: item.value,
            name: item.value.slice(0, 10),
            type: 'jpg/png',
          };
          const uploadFile = new FormData();
          uploadFile.append('images', imageData);
          uploadImageFunc({body: uploadFile});
        } else if (item.name === 'dop' || item.name ==="Date Of Purchase") {
          setDate(item.value);
        }
      });

    //    console.log(productData)
  };
  const handleWorkflowNavigation = () => {
    console.log('scccess');

    if (workflowProgram[0] === 'Static Coupon') {
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType:"Static Coupon"
      });
    } else if (workflowProgram[0] === 'Warranty') {
      navigation.navigate('ActivateWarranty', {
        workflowProgram: workflowProgram.slice(1),
        
      });
    } else if (workflowProgram[0] === 'Points On Product') {
      console.log(workflowProgram.slice(1));
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType:"Points On Product"
      });
    } else if (workflowProgram[0] === 'Cashback') {
      console.log(workflowProgram.slice(1));
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType:'Cashback'
      });
    } else if (workflowProgram[0] === 'Wheel') {
      console.log(workflowProgram.slice(1));
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType:"Wheel"
      });
    } else if (workflowProgram[0] === 'Genuinity') {
      navigation.navigate('Genuinity', {
        workflowProgram: workflowProgram.slice(1),
      });
    } else {
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: buttonThemeColor,
      }}>
        {/* {error && (
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
              openModal={success}></MessageModal>)
           } */}
      <View
        style={{
          height: '10%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
        }}>
        <TouchableOpacity
          style={{height: 20, width: 20, position: 'absolute', left: 10}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{height: 20, width: 20, resizeMode: 'contain'}}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
            position: 'absolute',
            left: 60,
          }}
          content="Activate Warranty"></PoppinsTextMedium>
      </View>
      <ScrollView
        style={{
          width: '100%',
          height: '90%',
          position: 'absolute',
          bottom: 0,
          flex: 1,
          backgroundColor: 'white',
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}>
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <ProductList list={productList}></ProductList>
          {warrantyForm &&
            warrantyForm.map((item, index) => {
              console.log(item);
              if (item.type === 'text') {
                if (item.required === true && item.name !== 'phone') {
                  return (
                    <TextInputRectangleMandatory
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputRectangleMandatory>
                  );
                }
                else if((item.name).trim().toLowerCase()==="city" && location!==undefined)
                {
                  
                    return(
                      <PrefilledTextInput
                       jsonData={item}
                       key={index}
                       handleData={handleChildComponentData}
                       placeHolder={item.name}
                       value={location.city}
                       ></PrefilledTextInput>
                     )
                  
                  
                  
                }
                else if((item.name).trim().toLowerCase()==="pincode" && location!==undefined)
                {
                  return(
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    value={location.postcode}
                    ></PrefilledTextInput>
                  )
                }
                else if((item.name).trim().toLowerCase()==="state" && location!==undefined)
                {
                  return(
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    value={location.state}
                    ></PrefilledTextInput>
                  )
                }
                else if((item.name).trim().toLowerCase()==="district" && location!==undefined)
                {
                  
                    return(
                      <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location.district}
                      ></PrefilledTextInput>
                    )
                  
                 
                  
                } else if (item.name === 'phone') {
                  return (
                    <TextInputNumericRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputNumericRectangle>
                  );
                } else {
                  return (
                    <TextInputRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputRectangle>
                  );
                }
              } else if (item.type === 'file') {
                return (
                  <ImageInput
                    jsonData={item}
                    handleData={handleChildComponentData}
                    key={index}
                    data={item.name}
                    action="Select File"></ImageInput>
                );
              } else if (item.type === 'date') {
                return (
                  <InputDate
                    jsonData={item}
                    handleData={handleChildComponentData}
                    data={item.label}
                    key={index}></InputDate>
                );
              }
            })}
          <ButtonOval
            handleOperation={() => {
              handleWarrantyFormSubmission();
            }}
            content="Submit"
            style={{
              paddingLeft: 30,
              paddingRight: 30,
              padding: 10,
              color: 'white',
              fontSize: 16,
            }}></ButtonOval>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ActivateWarranty;
