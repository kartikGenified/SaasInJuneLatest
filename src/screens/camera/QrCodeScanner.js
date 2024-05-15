import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ScannedListItem from '../../components/atoms/ScannedListItem';
import * as Keychain from 'react-native-keychain';
import {useVerifyQrMutation} from '../../apiServices/qrScan/VerifyQrApi';
import ErrorModal from '../../components/modals/ErrorModal';
import ButtonProceed from '../../components/atoms/buttons/ButtonProceed';
import {useAddQrMutation} from '../../apiServices/qrScan/AddQrApi';
import {useSelector, useDispatch} from 'react-redux';
import {setQrData, setQrIdList} from '../../../redux/slices/qrCodeDataSlice';
import {useCheckGenuinityMutation} from '../../apiServices/workflow/genuinity/GetGenuinityApi';
import {useCheckWarrantyMutation} from '../../apiServices/workflow/warranty/ActivateWarrantyApi';
import {useGetProductDataMutation} from '../../apiServices/product/productApi';
import {setProductData,setProductMrp,setScanningType} from '../../../redux/slices/getProductSlice';
import { useAddBulkQrMutation } from '../../apiServices/bulkScan/BulkScanApi';
import { slug } from '../../utils/Slug';
import MessageModal from '../../components/modals/MessageModal';
import ModalWithBorder from '../../components/modals/ModalWithBorder';
import Close from 'react-native-vector-icons/Ionicons';
import RNQRGenerator from 'rn-qr-generator';
import { useCashPerPointMutation, useFetchUserPointsHistoryMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import FastImage from 'react-native-fast-image';
import { setFirstScan,setRegistrationBonusFirstScan } from '../../../redux/slices/scanningSlice';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QrCodeScanner = ({navigation}) => {
  const [zoom, setZoom] = useState(0);
  const [zoomText, setZoomText] = useState('1');
  const [flash, setFlash] = useState(false);
  const [addedQrList, setAddedQrList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [savedToken, setSavedToken] = useState();
  const [qr_id, setQr_id] = useState();
  const [registrationBonus, setRegistrationBonus] = useState()
  const [helpModal, setHelpModal] = useState(false);
  const [isFirstScan, setIsFirstScan] = useState(false) 
  const [isReportable, setIsReportable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locationGranted, setLocationGranted] = useState(null)
  const [showProceed, setShowProceed] = useState(false)
  const userId = useSelector(state => state.appusersdata.userId);
  const userData = useSelector(state=>state.appusersdata.userData)
  const userType = useSelector(state => state.appusersdata.userType);
  const userName = useSelector(state => state.appusersdata.name);
  const workflowProgram = useSelector(state => state.appWorkflow.program);
  const location = useSelector(state=>state.userLocation.location)
  
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const gifUri = Image.resolveAssetSource(
      require("../../../assets/gif/loader.gif")
    ).uri;
  const dispatch = useDispatch();
  // console.log('Workflow Program is ',location);
  let addedqr =[]

  const {t} = useTranslation();
  // console.log("Selector state",useSelector((state)=>state.appusersdata.userId))

  // mutations ----------------------------------------
  const [
    verifyQrFunc,
    {
      data: verifyQrData,
      error: verifyQrError,
      isLoading: verifyQrIsLoading,
      isError: verifyQrIsError,
    },
  ] = useVerifyQrMutation();

  const [cashPerPointFunc,{
    data:cashPerPointData,
    error:cashPerPointError,
    isLoading:cashPerPointIsLoading,
    isError:cashPerPointIsError
  }] = useCashPerPointMutation()

  const [
    checkGenuinityFunc,
    {
      data: checkGenuinityData,
      error: checkGenuinityError,
      isLoading: checkGenuinityIsLoading,
      isError: checkGenuinityIsError,
    },
  ] = useCheckGenuinityMutation();

  const [fetchUserPointsHistoryFunc, {
    data: fetchUserPointsHistoryData,
    error: fetchUserPointsHistoryError,
    isLoading: fetchUserPointsHistoryLoading,
    isError: fetchUserPointsHistoryIsError
}] = useFetchUserPointsHistoryMutation()

  const [checkWarrantyFunc,{
    data:checkWarrantyData,
    error:checkWarrantyError,
    isLoading:checkWarrantyIsLoading,
    isError:checkWarrantyIsError
  }] = useCheckWarrantyMutation()

  const [
    productDataFunc,
    {
      data: productDataData,
      error: productDataError,
      isLoading: productDataIsLoading,
      isError: productDataIsError,
    },
  ] = useGetProductDataMutation();
  

  const [addBulkQrFunc ,{
    data:addBulkQrData,
    error:addBulkQrError,
    isLoading:addBulkQrIsLoading,
    isError:addBulkQrIsError
  }]= useAddBulkQrMutation()


  useEffect(()=>{
    if(addBulkQrData){
      // console.log("addBulkQrData",addBulkQrData)
      if(addBulkQrData.success)
      {
        // isFirstScan && checkFirstScan()
        if(checkGenuinityData){
          
          if(checkGenuinityData?.body){
          // console.log("check warranty data",checkWarrantyData)
          if(checkWarrantyError)
          {
          if(checkWarrantyError?.data?.body)
          {
            isFirstScan && setTimeout(() => {
              handleWorkflowNavigation("Genuinity+","Warranty") 
            }, 3000); 
            !isFirstScan && handleWorkflowNavigation("Genuinity+","Warranty")
          }
          else{
            isFirstScan && setTimeout(() => {
              handleWorkflowNavigation("Genuinity+")

            }, 3000); 
            !isFirstScan && handleWorkflowNavigation("Genuinity+")

          }
        }
        else if(checkWarrantyData)
        {
          if(checkWarrantyData?.body)
        {
          isFirstScan && setTimeout(() => {
            handleWorkflowNavigation("Genuinity+","Warranty")
          }, 3000); 
          !isFirstScan && handleWorkflowNavigation("Genuinity+","Warranty")
        }
        else{
          isFirstScan && setTimeout(() => {
            handleWorkflowNavigation("Genuinity+")

          }, 3000); 
          !isFirstScan && handleWorkflowNavigation("Genuinity+")
        }
        }
        }
        else
        {
          if(checkWarrantyError)
          {
          if(checkWarrantyError?.data?.body)
          {
            isFirstScan && setTimeout(() => {
              handleWorkflowNavigation("Warranty")

            }, 3000); 
            !isFirstScan && handleWorkflowNavigation("Warranty")
          }
          else{
            handleWorkflowNavigation()
          }
        }
        else if(checkWarrantyData)
        {
          if(checkWarrantyData?.body)
        {
          isFirstScan && setTimeout(() => {
            handleWorkflowNavigation("Warranty")

          }, 3000); 
          !isFirstScan && handleWorkflowNavigation("Warranty")
        }
        else{
          isFirstScan && 
          setTimeout(() => {
            handleWorkflowNavigation()

          }, 3000); 
          !isFirstScan && handleWorkflowNavigation()
        }
        }
        else{
          isFirstScan && 
          setTimeout(() => {
            handleWorkflowNavigation()

          }, 3000); 
          !isFirstScan && handleWorkflowNavigation()
        }
        }
      }
        else if(checkWarrantyError){
          if(checkWarrantyError?.data?.body){
            if(checkGenuinityData)
          {
          if(checkGenuinityData?.body)
          {
            isFirstScan && setTimeout(() => {
              handleWorkflowNavigation("Genuinity+","Warranty")
            }, 3000); 
            !isFirstScan && handleWorkflowNavigation("Genuinity+","Warranty")
          }
          else{
            isFirstScan && setTimeout(() => {
              handleWorkflowNavigation("Warranty")
  
            }, 3000); 
            !isFirstScan && handleWorkflowNavigation("Warranty")
          }
        }
        
      }
      }
      else{
        // console.log("else")
        isFirstScan && 
        setTimeout(() => {
          handleWorkflowNavigation()

        }, 3000); 
        !isFirstScan && handleWorkflowNavigation()
      }
       
      }
    }

    else if(addBulkQrError){
      // console.log("addBulkQrError",addBulkQrError)
      if(addBulkQrError.data)
      {
        setError(true)
        setMessage(addBulkQrError.data?.message)
      }
    }
  },[addBulkQrData,addBulkQrError])
  useEffect(()=>{
    if(cashPerPointData)
    {
        // console.log("cashPerPointData",cashPerPointData)
        if(cashPerPointData?.success)

        {
         setRegistrationBonus(Number(cashPerPointData?.body.registration_bonus))
         dispatch(setRegistrationBonusFirstScan((Number(cashPerPointData?.body.registration_bonus))))
          
        }
    }
    else if(cashPerPointError){
      setError(true)
      setMessage("Unable to fetch cash per point data.")
        // console.log("cashPerPointError",cashPerPointError)
        
    }
  },[cashPerPointData,cashPerPointError])
  // ----------------------------------------------------
  const height = Dimensions.get('window').height;
  const platform = Platform.OS === 'ios' ? '1' : '2';
  const platformMargin = Platform.OS === 'ios' ? -60 : -160;
  const toDate = undefined
  var fromDate = undefined

  useEffect(() => {
    // handleLocationAccess();
   if(Object.keys(location).length==0)
   {
    setLocationGranted(false)
   }
   else{
    setLocationGranted(true)
   }
  }, [location]);

  // const handleLocationAccess =()=>{
  //   const checkLocationStatus = async () => {
  //     try {
  //       const enabled = await Geolocation.checkDeviceSettings();
  //       setLocationEnabled(enabled);
  //     } catch (error) {
  //       console.error('Error checking location status:', error);
  //     }
  //   };
  
  //   const handleLocationStatusCheck = () => {
  //     if (locationEnabled) {
  //       Alert.alert('Location services are enabled');
  //     } else {
  //       Alert.alert('Location services are disabled');
  //     }
  //   };
  
  //   const checkLocationPermission = async () => {
  //     try {
  //       const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  //       setLocationPermission(result);
  //       console.log("locations result",result)
        
  //     } catch (error) {
  //       setLocationGranted(false)
  //       console.error('Error checking location permission:', error);
  //     }
  //   };

  //   checkLocationStatus()

  // }

 
 

 

  useEffect(()=>{

    
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      (async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
  
  const params ={
      token: token,
     userId : userData.id,
     
    }
        fetchUserPointsHistoryFunc(params);
      })();
      cashPerPointFunc(token)
     
    })();
  },[verifyQrData])

 
  useEffect(() => {
    if (checkGenuinityData) {
      // console.log('genuinity check', checkGenuinityData);
    } else if (checkGenuinityError) {
      if(checkGenuinityError.status == 401)
      {
        const handleLogout = async () => {
          try {
            
            await AsyncStorage.removeItem('loginData');
            navigation.navigate("Splash")
            navigation.reset({ index: 0, routes: [{ name: 'Splash' }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      }
      else{
      setError(true)
      setMessage("Unable to check warranty status of this QR")
      }
      // console.log('Error', checkGenuinityError);
    }
  }, [checkGenuinityData, checkGenuinityError]);

  useEffect(() => {
    if (checkWarrantyData) {
      // console.log('warranty check', checkWarrantyData);
    } else if (checkWarrantyError) {
      if(checkWarrantyError.status == 401)
      {
        const handleLogout = async () => {
          try {
            
            await AsyncStorage.removeItem('loginData');
            navigation.navigate("Splash")
            navigation.reset({ index: 0, routes: [{ name: 'Splash' }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      }
      else{
      setError(true)
      setMessage("Unable to check warranty status of this QR")
      }
      // console.log('warranty Error', checkWarrantyError);
    }
  }, [checkWarrantyData, checkWarrantyError]);


  useEffect(() => {
    if (fetchUserPointsHistoryData) {
        // console.log("fetchUserPointsHistoryData", JSON.stringify(fetchUserPointsHistoryData))
        

        if(fetchUserPointsHistoryData.success)
        {
          if(fetchUserPointsHistoryData?.body?.data?.length===0)
          {
            dispatch(setFirstScan(true))
          }
          else{
            setIsFirstScan(false)
          }
        }
    }
    else if (fetchUserPointsHistoryError) {
      if(fetchUserPointsHistoryError.status == 401)
      {
        const handleLogout = async () => {
          try {
            
            await AsyncStorage.removeItem('loginData');
            navigation.navigate("Splash")
            navigation.reset({ index: 0, routes: [{ name: 'Splash' }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      }
      else{
      setError(true)
      setMessage("Can't fetch scanned QR list")
      }
        // console.log("fetchUserPointsHistoryError", fetchUserPointsHistoryError)
    }

}, [fetchUserPointsHistoryData, fetchUserPointsHistoryError])

  useEffect(() => {
    if (productDataData) {
    const form_type = '2';
    const token =savedToken
    console.log('Product Data is ',  productDataData?.body);

    if(productDataData?.body?.products.length!==0)
    {
      if(productDataData?.body?.products[0].points_active=== "2")
      {
        setError(true)
        setMessage("Reward is not activated for this product")
      }
      else{
        const body = {product_id: productDataData?.body?.products[0].product_id, qr_id: qr_id};
        // console.log("productdata",body)
        dispatch(setProductData(productDataData?.body?.products[0]));
        
        checkWarrantyFunc({form_type, token, body})
        setTimeout(() => {
          setShowProceed(true)
        }, 1000);
      }
     
      }
      else{
        setError(true)
        setMessage("Product data not available.")
       if(addedQrList.length===1)
       {
        setShowProceed(false)
       }
       else{
        setShowProceed(true)
       }
        
      }
   

    } else if (productDataError) {
      if(productDataError.status == 401)
      {
        const handleLogout = async () => {
          try {
            
            await AsyncStorage.removeItem('loginData');
            navigation.navigate("Splash")
            navigation.reset({ index: 0, routes: [{ name: 'Splash' }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      }
      else{
      // console.log('pr Error', productDataError);
      setError(true)
      setMessage(productDataError?.data?.Error?.message)
      }
    }
  }, [productDataData, productDataError]);

  const modalClose = () => {
    setError(false);
    setSuccess(false)
    setIsReportable(false)
  };

 
const onSuccess = async (e) => {
  console.log('Qr data is ------', e?.data);
  
  if (e?.data === undefined) {
    setError(true);
    setMessage("Please scan a valid QR");
  } else {

    const qrData = e?.data?.split('=')[1];
    // console.log("qrData", qrData);

    let requestData = { unique_code: qrData };
    // console.log("qrDataArray", qrData?.split("-"));

    if (qrData?.split("-").length === 1) {
      requestData = { unique_code: "ozone-" + qrData };
    } else if (qrData?.split("-").length === 2) {
      requestData = { unique_code: qrData };
    }

    const verifyQR = async (data) => {
      console.log('qrDataVerifyQR', data);
      if(data?.unique_code != undefined)
      {
        try {
          // Retrieve the credentials
          const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              // console.log(
              //   'Credentials successfully loaded for user ' + credentials?.username, data
              // );
              setSavedToken(credentials?.username);
              const token = credentials?.username;
  
            
            const response = await verifyQrFunc({ token, data })
            // console.log("verifyQrFunc",response)
            if (response?.data) {
              console.log('Verify qr data', JSON.stringify(response));
              if(response?.data?.body==null)
              {
                setError(true)
                setMessage("Can't get product data")
              }
             
              
              
              const qrStatus = response?.data.body?.qr?.qr_status == undefined ?  response?.data.body?.qr_status :  response?.data.body?.qr?.qr_status
              const statusCode = response?.data?.status;
              const verifiedQrData = response?.data.body.qr == undefined ? response?.data.body : response?.data.body.qr
              if (qrStatus === "1") {
                await addQrDataToList(verifiedQrData);
              }
          
              if (qrStatus === "2") {
                if (statusCode === 201) {
                  setError(true);
                  setMessage(response?.data.message);
                } else if (statusCode === 202) {
                  setIsReportable(true);
                  setError(true);
                  setMessage(response?.data.message);
                } else if (statusCode === 200) {
                  setError(true);
                  setMessage(response?.data.message);
                }
              }
            } else if (response.error) {
              if (response.error === undefined) {
                setError(true);
                setMessage("This QR is not activated yet");
              } else {
                setError(true);
                setMessage(response.error.data?.message);
              }
             
            }
          } else {

          }
        } catch (error) {
        }
      }
      else{
        setError(true)
        setMessage("Invalid QR")
      }
      
    };

    try {
      await verifyQR(requestData);
    } catch (error) {
      console.log("Exception in verifying the QR", error);
    }
  }
};


  // add qr to the list of qr--------------------------------------

  const addQrDataToList =async(data) => {
    setIsLoading(false)
    const qrId = data.id;
    setQr_id(qrId);
    
    const productCode = data?.product_code;
    
    
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      // console.log(
      //   'Credentials successfully loaded for user ' + credentials?.username, data
      // );
      const token = credentials?.username;
      checkGenuinityFunc({qrId, token});
    productDataFunc({productCode, userType, token});
    }
    addedqr = addedQrList
    // console.log("addQrDataToList",addedqr,data)

    if (addedqr.length === 0) {
      //  setAddedQrList([...addedqr, data]);
       addedqr.push(data)
    } else {
      const existingObject = addedqr.find(
        obj => obj?.unique_code === data?.unique_code,
      );
      // console.log("existingObject",existingObject,data)
      if (!existingObject) {
        // setAddedQrList([...addedqr, data]);
        addedqr.push(data)
      } else {
        setError(true);
        setMessage('Sorry This QR is already added to the list');
      }
    }
    setAddedQrList(addedqr)
    return addedqr
  };
  // --------------------------------------------------------

  // delete qr from list of qr-------------------------------------
  const deleteQrFromList = code => {
    const removedList = addedQrList.filter((item, index) => {
      return item?.unique_code !== code;
    });
    setAddedQrList(removedList);

  };
  // --------------------------------------------------------

  // function to handle workflow navigation-----------------------
  const handleWorkflowNavigation = (item1, item2, item3) => {
    
    if(addedQrList.length>1)
    {
      dispatch(setScanningType("Bulk"))
    }
    else{
     dispatch(setScanningType("Single"))
    }
    // console.log('success');
    // console.log("Items are",item1, item2, item3);

    const itemsToRemove = [item1, item2, item3];
    const updatedWorkflowProgram = workflowProgram.filter(item => !itemsToRemove.includes(item));

    if (updatedWorkflowProgram[0] === 'Static Coupon') {
        // console.log(updatedWorkflowProgram.slice(1));
        navigation.navigate('CongratulateOnScan', {
            workflowProgram: updatedWorkflowProgram.slice(1),
            rewardType:updatedWorkflowProgram[0]
        });
    } else if (updatedWorkflowProgram[0] === 'Warranty') {
        // console.log(updatedWorkflowProgram.slice(1));
        navigation.navigate('ActivateWarranty', {
            workflowProgram: updatedWorkflowProgram.slice(1),
            rewardType:updatedWorkflowProgram[0]

        });
    } else if (updatedWorkflowProgram[0] === 'Points On Product' || updatedWorkflowProgram[0] === 'Cashback' || updatedWorkflowProgram[0] === 'Wheel') {
        // console.log(updatedWorkflowProgram.slice(1));
        navigation.navigate('CongratulateOnScan', {
            workflowProgram: updatedWorkflowProgram.slice(1),
            rewardType:updatedWorkflowProgram[0]
            
        });
    } else if (updatedWorkflowProgram[0] === 'Genuinity+') {
        // console.log(updatedWorkflowProgram.slice(1));
        navigation.navigate('GenuinityScratch', {
            workflowProgram: updatedWorkflowProgram.slice(1),
            rewardType:updatedWorkflowProgram[0]
        });
    } else if (updatedWorkflowProgram[0] === 'Genuinity'){
        // console.log(updatedWorkflowProgram.slice(1));
        navigation.navigate('Genuinity', {
            workflowProgram: updatedWorkflowProgram.slice(1),
            rewardType:updatedWorkflowProgram[0]
        });
    }
    else{
      // console.log("You have completed the workflow")
    }
};

  // --------------------------------------------------------
  //check if warranty is claimed
  // useEffect(() => {
  //   if (checkWarrantyData) {
  //     console.log("Check Warranty Is Already Claimed",checkWarrantyData.body);

  //   } else {
  //     console.log(checkWarrantyError);
  //   }
  // }, [checkWarrantyData, checkWarrantyError]);
  // --------------------------------------------------------

  // getting verify qr data --------------------------
 
  useEffect(() => {
    if (verifyQrData) {
      console.log('Verify qr data', verifyQrData?.body);
      setIsLoading(false)
      dispatch(setProductMrp(verifyQrData?.body?.qr))
     

      // let qrStatus,statusCode;

      // if(verifyQrData?.body?.qr!==undefined)
      // {
      //   qrStatus = verifyQrData.body?.qr?.qr_status == undefined
      //   statusCode = verifyQrData?.status;
   
      //  if (qrStatus === "1") {
      //    addQrDataToList(verifyQrData.body.qr);
      //  }
      // }
      // else{
      //   dispatch(setProductMrp(verifyQrData?.body))
      //   qrStatus = verifyQrData.body?.qr_status == undefined
      //   statusCode = verifyQrData?.status;
   
      //  if (qrStatus === "1") {
      //    addQrDataToList(verifyQrData.body);
      //  }
      // }
      
  
      // if (qrStatus === "2") {
      //   if (statusCode === 201) {
      //     setError(true);
      //     setMessage(verifyQrData.message);
      //   } else if (statusCode === 202) {
      //     setIsReportable(true);
      //     setError(true);
      //     setMessage(verifyQrData.message);
      //   } else if (statusCode === 200) {
      //     setError(true);
      //     setMessage(verifyQrData.message);
      //   }
      // }
    } else if (verifyQrError) {
      setIsLoading(false)
      if (verifyQrError === undefined) {
        setError(true);
        setMessage("This QR is not activated yet");
      } else {
        setError(true);
        setMessage(verifyQrError.data?.message);
      }
      // console.log('Verify qr error', verifyQrError?.data?.Error);
    }
  }, [verifyQrData, verifyQrError]);
  // --------------------------------------------------------

 

  // handle camera functions --------------------------------------

  const handleFlash = () => {
    setFlash(!flash);
  };

  const handleZoom = () => {
    if (zoom === 0) {
      setZoom(0.5);
      setZoomText('2');
    } else {
      setZoom(0);
      setZoomText('1');
    }
  };

  
  const handleOpenImageGallery = async () => {
    const result = await launchImageLibrary({ selectionLimit: 20 });
    // console.log("result", result);
    setIsLoading(true)
    if (result?.assets) {
      const detectedQRCodes = [];
  
      for (let i = 0; i < result?.assets.length; i++) {
        // console.log("RNQRGenerator", result?.assets[i]?.uri);
  
        try {
          const response = await RNQRGenerator.detect({
            uri: result?.assets[i]?.uri,
          });
  
          const { values } = response;
          const requestData = values.length > 0 ? values[0] : null;
  
          if (requestData) {
            // console.log(requestData);
            detectedQRCodes.push(requestData);
          } else {
            // console.log('No QR code detected in the image');
          }
        } catch (error) {
          // console.log('Error detecting QR code in image', error);
        }
      }
  
      // Process all detected QR codes after the loop completes
      detectedQRCodes.forEach((data) => {
        onSuccess({ data });
      });
    }
  };
  
  

  // --------------------------------------------------------

  // function to call add qr api -------------------------------

  const handleAddQr = () => {

    const token = savedToken;
   

      const addedQrID = addedQrList.map((item,index)=>{
        return item.id
      })
      const params = {
        token:token,
        data:{
          "qrs" : addedQrID,
          "platform_id" : 1,
          "name":userData?.name
      }
      }
      addBulkQrFunc(params)
      dispatch(setQrIdList(addedQrID))
      dispatch(setQrData(addedQrList))
      // console.log(addedQrID,params)
 
  };
  // --------------------------------------------------------
  const helpModalComp = () => {
    return (
      <View style={{ width: 340, height: 320, alignItems: "center", justifyContent: "center" }}>
        <Image style={{ height: 370, width: 390, }} source={(require('../../../assets/images/howToScan.png'))}></Image>
        <TouchableOpacity style={[{
          backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
        }]} onPress={() => setHelpModal(false)} >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>

      </View>
    )
  }
  return (
    <>
    
      <QRCodeScanner
      onRead={onSuccess}
      reactivate={true}
      vibrate={true}
      reactivateTimeout={2000}
      fadeIn={true}
      flashMode={
        !flash
          ? RNCamera.Constants.FlashMode.off
          : RNCamera.Constants.FlashMode.torch
      }
      customMarker={
        <View style={{height: '100%', width: '100%', flexDirection: 'row'}}>
          <View
            style={{
              height: '36%',
              width: '80%',
              position: 'absolute',
              top: 10,
              alignItems: 'center',
              justifyContent: 'center',
              left: 0,
            }}>
            <PoppinsText
              style={{
                fontSize: 20,
                color: 'white',
                position: 'absolute',
                right: 0,
                top: 0,
              }}
              content="Scan Product QR Code"></PoppinsText>
            <View
              style={{
                backgroundColor: 'transparent',
                borderWidth: 4,
                borderColor: '#305CB8',
                height: 200,
                width: 240,
                borderRadius: 20,
                position: 'absolute',
                right: 0,
                top: 40,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
                  height: 40,
                  width: 80,
                  backgroundColor: '#58585A',
                  borderRadius: 20,
                  marginBottom: 8,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setHelpModal(true)
                  }}
                  style={{
                    backgroundColor: 'black',
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    position: 'absolute',
                    left: 5,
                    top: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{height: 16, width: 16, resizeMode: 'contain'}}
                    source={require('../../../assets/images/qrQuestionMark.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleZoom();
                  }}
                  style={{
                    backgroundColor: 'black',
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    position: 'absolute',
                    right: 5,
                    top: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontSize: 14, color: '#FB774F'}}>
                    {zoomText}X
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '20%',
              height: '36%',
              position: 'absolute',
              right: 0,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Dashboard');
              }}
              style={{height: 34, width: 34, margin: 10, left: 20}}>
              <Image
                style={{height: 34, width: 34, resizeMode: 'contain'}}
                source={require('../../../assets/images/qrCancel.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleFlash();
              }}
              style={{height: 44, width: 44, margin: 20}}>
              <Image
                style={{height: 44, width: 44, resizeMode: 'contain'}}
                source={require('../../../assets/images/qrTorch.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleOpenImageGallery();
              }}
              style={{height: 44, width: 44, margin: 20}}>
              <Image
                style={{height: 44, width: 44, resizeMode: 'contain'}}
                source={require('../../../assets/images/qrGallery.png')}></Image>
            </TouchableOpacity>
          </View>
        </View>
      }
      showMarker={true}
      cameraStyle={{height: '100%'}}
      cameraProps={{zoom: zoom}}
      bottomContent={
        <View
          style={{
            height: height - 100,
            backgroundColor: 'white',
            width: '100%',
            top: platformMargin,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          {error && verifyQrData && (
            <ErrorModal
              modalClose={modalClose}
              productData = {verifyQrData?.body?.qr}
              message={message}
              isReportable = {isReportable}
              openModal={error}></ErrorModal>
          )}
          {/* {error  && (
            <ErrorModal
              modalClose={modalClose}
              isReportable = {isReportable}
              message={message}
              
              openModal={error}></ErrorModal>
          )} */}
  {
    success && (
      <MessageModal
              modalClose={modalClose}
              title="Success"
              message={message}
              openModal={success}></MessageModal>
    )
  }
  {
    isLoading && <FastImage
    style={{ width: 60, height: 60, alignSelf: 'center' }}
    source={{
      uri: gifUri, // Update the path to your GIF
      priority: FastImage.priority.normal,
    }}
    resizeMode={FastImage.resizeMode.contain}
  />
  }
          {addedQrList.length === 0 ? (
            <View
              style={{
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <ScrollView contentContainerStyle={{alignItems:"center",justifyContent:'center',width:'80%',marginTop:60}}>
                <Image
                  style={{height: 300, width: 300,resizeMode:'contain'}}
                  source={require('../../../assets/images/qrHowTo.png')}></Image>
                <PoppinsTextMedium
                  style={{color: 'grey', fontWeight: '700', fontSize: 20}}
                  content={t("Please start scanning by pointing the camera towards the QR Code")}></PoppinsTextMedium>
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FlatList
                style={{width: '100%',height:300}}
                data={addedQrList}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {!error && (
                      <ScannedListItem
                        handleDelete={deleteQrFromList}
                        unique_code={item.unique_code}
                        index={index}
                        serialNo={item.batch_running_code}
                        productName={item.name}
                        productCode={item.product_code}
                        batchCode={item.batch_code}></ScannedListItem>
                    )}
                  </View>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          )}
          {
            showProceed &&
             <ButtonProceed
            handleOperation={handleAddQr}
            style={{color: 'white'}}
            content="Proceed"
            navigateTo={'QrCodeScanner'}></ButtonProceed>
          }
          

            {helpModal && <ModalWithBorder
            modalClose={() => { setHelpModal(!helpModal) }}
            // message={message}
            openModal={helpModal}
            // navigateTo="WarrantyClaimDetails"
            // parameters={{ warrantyItemData: data, afterClaimData: warrantyClaimData }}
            comp={helpModalComp}></ModalWithBorder>}
        </View>
      }
    />
    
    </>
    
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'black',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default QrCodeScanner;