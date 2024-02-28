import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import CongratulationActionBox from "../../components/atoms/CongratulationActionBox";
import Win from "../../components/molecules/Win";
import ButtonSquare from "../../components/atoms/buttons/ButtonSquare";
import { useGetCouponOnCategoryMutation } from "../../apiServices/workflow/rewards/GetCouponApi";
import {
  useCheckUserPointMutation,
  useUserPointsEntryMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import {
  useGetallWheelsByUserIdMutation,
  useCreateWheelHistoryMutation,
} from "../../apiServices/workflow/rewards/GetWheelApi";
import {
  useCheckQrCodeAlreadyRedeemedMutation,
  useAddCashbackEnteriesMutation,
} from "../../apiServices/workflow/rewards/GetCashbackApi";
import * as Keychain from "react-native-keychain";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import { slug } from "../../utils/Slug";
import { useExtraPointEnteriesMutation } from "../../apiServices/pointSharing/pointSharingApi";
import { useAddBulkPointOnProductMutation } from "../../apiServices/bulkScan/BulkScanApi";
import { setQrIdList } from "../../../redux/slices/qrCodeDataSlice";
import  Celebrate  from "react-native-vector-icons/MaterialIcons";
import Error from "react-native-vector-icons/MaterialIcons"
import { useGetActiveMembershipMutation, useGetMembershipMutation, useGetOzoneActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import ErrorModal from "../../components/modals/ErrorModal";
import FastImage from "react-native-fast-image";

const CongratulateOnScan = ({ navigation, route }) => {
  const [showPoints, setShowPoints] = useState();
  const [showBulkScanPoints, setShowBulkScanPoints] = useState();
  const [membershipPercent, setMembershipPercent] = useState()
  const [totalPoints, setTotalPoints] = useState(0)
  const [error,setError] = useState(false)
  const [message, setMessage] = useState('')
  const buttonThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "#ef6110";

  //  data from scanning qr code
  const dispatch = useDispatch();
  const qrData = useSelector((state) => state.qrData.qrData);
  // product data recieved from scanned product
  const productMrp = useSelector((state)=> state.productData.productMrp)
  const productData = useSelector((state) => state.productData.productData);
  const pointSharingData = useSelector(
    (state) => state.pointSharing.pointSharing
  );
  const qrIdList = useSelector((state) => state.qrData.qrIdList);
  const userData = useSelector((state) => state.appusersdata.userData);
  console.log("userData", `${userData.user_type}_points`, JSON.stringify(pointSharingData));
  const pointPercentage = useSelector(
    (state) => state.pointSharing.percentagePoints
  );
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const shouldSharePoints = useSelector(
    (state) => state.pointSharing.shouldSharePoints
  );
  // getting location from redux state
  const location = useSelector((state) => state.userLocation.location);
  console.log("shouldSharePoints", shouldSharePoints, JSON.stringify(productData));
  console.log("location", location);
  // console.log('Location', location, userData, productData, qrData);
  const height = Dimensions.get("window").height;
  // workflow for the given user
  const workflowProgram = route.params.workflowProgram;
  const rewardType = route.params.rewardType;
  console.log("rewardType", rewardType, workflowProgram, productData);
  const platform = Platform.OS === "ios" ? "1" : "2";

  const [getMemberShipFunc,
    {
      data:getMembershipData,
      error:getMembershipError,
      isLoading:getMembershipIsLoading,
      isError:getMembershipIsError
    }] = useGetMembershipMutation()

  const [
    getCouponOnCategoryFunc,
    {
      data: getCouponOnCategoryData,
      error: getCouponOnCategoryError,
      isLoading: getCouponOnCategoryIsLoading,
      isError: getCouponOnCategoryIsError,
    },
  ] = useGetCouponOnCategoryMutation();
  const [
    addBulkPointOnProductFunc,
    {
      data: addBulkPointOnProductData,
      error: addBulkPointOnProductError,
      isLoading: addBulkPointOnProductIsLoading,
      isError: addBulkPointOnProductIsError,
    },
  ] = useAddBulkPointOnProductMutation();

  const [
    checkUserPointFunc,
    {
      data: checkUserPointData,
      error: checkUserPointError,
      isLoading: checkUserPointIsLoading,
      isError: checkUserPointIsError,
    },
  ] = useCheckUserPointMutation();

  const [
    userPointEntryFunc,
    {
      data: userPointEntryData,
      error: userPointEntryError,
      isLoading: userPointEntryIsLoading,
      isError: userPointEntryIsError,
    },
  ] = useUserPointsEntryMutation();
  const [
    extraPointEntryFunc,
    {
      data: extraPointEntryData,
      error: extraPointEntryError,
      isLoading: extraPointEntryIsLoading,
      isError: extraPointEntryIsError,
    },
  ] = useExtraPointEnteriesMutation();

  const [
    getAllWheelsByUserIdFunc,
    {
      data: getAllWheelsByUserIdData,
      error: getAllWheelsByUserIdError,
      isLoading: getAllWheelsByUserIdIsLoading,
      isError: getAllWheelsByUserIdIsError,
    },
  ] = useGetallWheelsByUserIdMutation();

  const [
    createWheelHistoryFunc,
    {
      data: createWheelHistoryData,
      error: createWheelHistoryError,
      isLoading: createWheelHistoryIsLoading,
      isError: createWheelHistoryIsError,
    },
  ] = useCreateWheelHistoryMutation();

  const [getActiveMembershipFunc, {
    data: getActiveMembershipData,
    error: getActiveMembershipError,
    isLoading: getActiveMembershipIsLoading,
    isError: getActiveMembershipIsError
}] = useGetOzoneActiveMembershipMutation();

  const [
    checkQrCodeAlreadyRedeemedFunc,
    {
      data: checkQrCodeAlreadyRedeemedData,
      error: checkQrCodeAlreadyRedeemedError,
      isLoading: checkQrCodeAlreadyRedeemedIsLoading,
      isError: checkQrCodeAlreadyRedeemedIsError,
    },
  ] = useCheckQrCodeAlreadyRedeemedMutation();

  const [
    addCashbackEnteriesFunc,
    {
      data: addCashbackEnteriesData,
      error: addCashbackEnteriesError,
      isLoading: addCashbackEnteriesIsLoading,
      isError: addCashbackEnteriesIsError,
    },
  ] = useAddCashbackEnteriesMutation();
  useEffect(()=>{
    getMembership()
  },[rewardType])

  useEffect(() => {
    if (getMembershipData) {
        console.log("getMembershipData", JSON.stringify(getMembershipData))
        const getActiveMembership = async () => {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
              console.log(
                  'Credentials successfully loaded for user ' + credentials.username
              );
              const token = credentials.username
              getActiveMembershipFunc(token)

          }
        }
        getActiveMembership()
    }
    else if (getMembershipError) {
        console.log("getMembershipError", getMembershipError)
    }
}, [getMembershipData, getMembershipError])

  useEffect(() => {
    if (getActiveMembershipData) {
        console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
        console.log("getMembershipData", JSON.stringify(getMembershipData))
        if(getActiveMembershipData.success)
        {
          const stats = Number(getActiveMembershipData.body?.stats?.total) + Number(productMrp["mrp"])
          const membershiparr = getMembershipData.body

          for(var i=0; i<membershiparr.length;i++)
          {
            const range = membershiparr[i]
            if((Number(range.range_start)<stats) && (stats<Number(range.range_end)))
            {
              setMembershipPercent(Number(range.points))
              console.log("setMembershipPercent",range.points,stats)
            }
          }

        }
    }
    else if (getActiveMembershipError) {
        console.log("getActiveMembershipError", getActiveMembershipError)
    }
}, [getActiveMembershipData, getActiveMembershipError])

const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;

const getMembership = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
      console.log(
          'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username
      getMemberShipFunc(token)
  }
}
  const fetchRewardsAccToWorkflow = async () => {
    console.log("fetchRewardsAccToWorkflow")
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );

      const token = credentials.username;

      if (rewardType === "Static Coupon") {
        const params = {
          token: token,
          catId: productData.category_id,
          qr_code: qrData.unique_code,
        };
        getCouponOnCategoryFunc(params);
      } else if (rewardType === "Points On Product") {
        if (qrIdList.length === 0) {
          const params = {
            token: token,
            qr_code: qrData.id,
          };

          console.log("shouldSharePoints", shouldSharePoints);
          if(membershipPercent)
          {
            if (pointSharingData.flat_points === true) {
              if (shouldSharePoints) {
                const points =
                  Number(productData[`${userData.user_type}_points`]) *
                  (Number(pointPercentage) / 100) 
                  const memberShipBonus = (points * Number(membershipPercent !==undefined ? membershipPercent : 0))/100
                  const totalPoints = points + memberShipBonus
                 
                console.log("extra flat points", points,pointPercentage);
                const body = {
                  data: {
                    // app_user_id: userData.id.toString(),
                    // user_type_id: userData.user_type_id,
                    // user_type: userData.user_type,
                    product_id: productData.product_id,
                    product_code: productData.product_code,
                    platform_id: Number(platform),
                    pincode:
                      location.postcode === undefined ? "N/A" : location.postcode,
                    platform: "mobile",
                    state: location.state === undefined ? "N/A" : location.state,
                    district:
                      location.district === undefined ? "N/A" : location.district,
                    city: location.city === undefined ? "N/A" : location.city,
                    area:
                      location.district === undefined ? "N/A" : location.district,
                    known_name:
                      location.city === undefined ? "N/A" : location.city,
                    lat:
                      location.lat === undefined ? "N/A" : String(location.lat),
                    log:
                      location.lon === undefined ? "N/A" : String(location.lon),
                    method_id: 1,
                    method: "point on product",
                    points: totalPoints,
                    type: "points_sharing",
                    point_earned_through_type: "points_sharing",
                  },
                  qrId: Number(qrData.id),
                  tenant_id: slug,
                  token: token,
                };
                extraPointEntryFunc(body);
              } else if (!shouldSharePoints) {
                alert("Points can't be shared for this tenant");
              }
            } else if (pointSharingData.percentage_points === true) {
              let point; 
              let totalPoints;
              let memberShipBonus
              if(membershipPercent)
              {
                if(Number(pointSharingData["percentage_points_value"])===0)
              {
                 point =
                productMrp["mrp"]
                 memberShipBonus = (point * Number(membershipPercent!==undefined ? membershipPercent : 0))/100
                totalPoints = memberShipBonus
                console.log("memberShipBonus recieved",membershipPercent)
              }
              else{
                 point =
                productMrp["mrp"] *
                (pointSharingData["percentage_points_value"] / 100);
                 memberShipBonus = (point * Number(membershipPercent !==undefined ? membershipPercent : 0))/100
                 totalPoints = point + memberShipBonus
              }
              }
             
              const points =
                totalPoints *
                (Number(pointPercentage) / 100);
                
              console.log("mrp points", points,point,memberShipBonus);
              if (shouldSharePoints) {
                const body = {
                  data: {
                    // app_user_id: userData.id.toString(),
                    // user_type_id: userData.user_type_id,
                    // user_type: userData.user_type,
                    product_id: productData.product_id,
                    product_code: productData.product_code,
                    platform_id: Number(platform),
                    pincode:
                      location.postcode === undefined ? "N/A" : location.postcode,
                    platform: "mobile",
                    state: location.state === undefined ? "N/A" : location.state,
                    district:
                      location.district === undefined ? "N/A" : location.district,
                    city: location.city === undefined ? "N/A" : location.city,
                    area:
                      location.district === undefined ? "N/A" : location.district,
                    known_name:
                      location.city === undefined ? "N/A" : location.city,
                    lat:
                      location.lat === undefined ? "N/A" : String(location.lat),
                    log:
                      location.lon === undefined ? "N/A" : String(location.lon),
                    method_id: 1,
                    method: "point on product",
                    points: points,
                    type: "points_sharing",
                    point_earned_through_type: "points_sharing",
                  },
                  qrId: Number(qrData.id),
                  tenant_id: slug,
                  token: token,
                };
                extraPointEntryFunc(body);
              } else if (!shouldSharePoints) {
                alert("Points can't be shared for this tenant");
              }
            }
          }
          

          checkUserPointFunc(params);
        } else {
          const params = {
            data: {
              qrs: qrIdList,
              point_sharing: pointSharingData,
              platform_id: Number(platform),
              pincode:
                location.postcode === undefined ? "N/A" : location.postcode,
              platform: "mobile",
              state: location.state === undefined ? "N/A" : location.state,
              district:
                location.district === undefined ? "N/A" : location.district,
              city: location.city === undefined ? "N/A" : location.city,
              area: location.district === undefined ? "N/A" : location.district,
              known_name: location.city === undefined ? "N/A" : location.city,
              lat: location.lat === undefined ? "N/A" : String(location.lat),
              log: location.lon === undefined ? "N/A" : String(location.lon),
              method_id: 1,
              method: "Bulk Scan",
              token: token,
            },
            token: token,
          };
          console.log("addBulkPointOnProductFunc",JSON.stringify(params))
          addBulkPointOnProductFunc(params);
        }
      } else if (rewardType === "Wheel") {
        const params = {
          token: token,
          id: userData.id.toString(),
        };
        getAllWheelsByUserIdFunc(params);
      } else if (rewardType === "Cashback") {
        const params = {
          token: token,
          qrId: qrData.id,
        };
        checkQrCodeAlreadyRedeemedFunc(params);
      }
    } else {
      console.log("No credentials stored");
    }
  };

  useEffect(() => {
    fetchRewardsAccToWorkflow();
  }, [membershipPercent]);

  useEffect(() => {
    if (addBulkPointOnProductData) {
      console.log(
        "addBulkPointOnProductData",
        JSON.stringify(addBulkPointOnProductData)
      );
      if (addBulkPointOnProductData.success) {
        let tp =0
        dispatch(setQrIdList([]));
        const bulkPoints = addBulkPointOnProductData.body.body.map((item, index) => {
          return item["points_on_product"];

        });
       
        setTotalPoints(addBulkPointOnProductData.body.total_points)
        setShowBulkScanPoints(bulkPoints);
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
    } else if (addBulkPointOnProductError) {
      console.log("addBulkPointOnProductError", addBulkPointOnProductError);
    }
  }, [addBulkPointOnProductData, addBulkPointOnProductError]);
  useEffect(() => {
    if (addCashbackEnteriesData) {
      console.log("addCashbackEnteriesData", addCashbackEnteriesData);
      if (addCashbackEnteriesData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 1000);
      }
    } else if (addCashbackEnteriesError) {
      console.log("addCashbackEnteriesError", addCashbackEnteriesError);
    }
  }, [addCashbackEnteriesData, addCashbackEnteriesError]);

  useEffect(() => {
    if (getAllWheelsByUserIdData) {
      console.log(
        "getAllWheelsByUserIdData",
        getAllWheelsByUserIdData.body.data
      );
      createWheelHistory(getAllWheelsByUserIdData.body.data);
    } else if (getAllWheelsByUserIdError) {
      console.log("getAllWheelsByUserIdError", getAllWheelsByUserIdError);
    }
  }, [getAllWheelsByUserIdData, getAllWheelsByUserIdError]);

  useEffect(() => {
    if (extraPointEntryData) {
      console.log("extraPointEntryData", extraPointEntryData);
    } else if (extraPointEntryError) {
      console.log("extraPointEntryError", extraPointEntryError);
    }
  }, [extraPointEntryError, extraPointEntryData]);
  const createWheelHistory = async (data) => {
    console.log("wheel history data", data);
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      body: {
        wc_id: data[0].wc_id,
        w_id: data[0].id,
        qr_id: qrData.id,
      },
    };
    createWheelHistoryFunc(params);
  };

  useEffect(() => {
    if (createWheelHistoryData) {
      console.log("createWheelHistoryData", createWheelHistoryData);
      // if(createWheelHistoryData.success)
      // {
      //   setTimeout(() => {
      //     handleWorkflowNavigation();
      //   }, 1000);
      // }
    } else if (createWheelHistoryError) {
      console.log("createWheelHistoryError", createWheelHistoryError);
      // if(createWheelHistoryError.status===409)
      // {
      //   setTimeout(() => {
      //     handleWorkflowNavigation();
      //   }, 1000);
      // }
    }
  }, [createWheelHistoryData, createWheelHistoryError]);

  useEffect(() => {
    if (checkQrCodeAlreadyRedeemedData) {
      console.log(
        "checkQrCodeAlreadyRedeemedData",
        checkQrCodeAlreadyRedeemedData
      );
      if (!checkQrCodeAlreadyRedeemedData.body) {
        addCashbackEnteries();
      } else if (checkQrCodeAlreadyRedeemedError) {
        console.log(checkQrCodeAlreadyRedeemedError);
      }
    }
  }, [checkQrCodeAlreadyRedeemedData, checkQrCodeAlreadyRedeemedError]);

  const addCashbackEnteries = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      body: {
        app_user_id: userData.id.toString(),
        user_type_id: userData.user_type_id,
        user_type: userData.user_type,
        product_id: productData.product_id,
        product_code: productData.product_code,
        platform_id: Number(platform),
        pincode: location.postcode,
        platform: "mobile",
        state: location.state,
        district: location.district,
        city: location.city,
        area: location.state,
        known_name: location.city,
        lat: String(location.lat),
        log: String(location.lon),
        method_id: 1,
        method: "Cashback",
        cashback: "10",
      },

      token: token,
      qrId: qrData.id,
    };
    addCashbackEnteriesFunc(params);
  };

  useEffect(() => {
    if (getCouponOnCategoryData) {
      console.log("getCouponOnCategoryData", getCouponOnCategoryData);
      if (getCouponOnCategoryData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 3000);
      }
    } else if (getCouponOnCategoryError) {
      console.log("getCouponOnCategoryError", getCouponOnCategoryError);
      if (getCouponOnCategoryError.status === 409) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 3000);
      } else if (
        getCouponOnCategoryError.data.message === "No Active Coupons Exist"
      ) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 3000);
      }
    }
  }, [getCouponOnCategoryData, getCouponOnCategoryError]);

  useEffect(() => {
    if (checkUserPointData) {
      console.log("checkUserPointData", checkUserPointData);

      if (!checkUserPointData.body) {
        console.log("check user point data is false")
      if(membershipPercent)
          {
        if (pointSharingData.flat_points) {
          const points = productData[`${userData.user_type}_points`]
          
          const memberShipBonus = (points * Number(membershipPercent !==undefined ? membershipPercent : 0))/100
          
          const totalPoints = points + memberShipBonus
          setShowPoints(totalPoints);
          const submitPoints = async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const body = {
              data: {
                app_user_id: userData.id.toString(),
                user_type_id: userData.user_type_id,
                user_type: userData.user_type,
                product_id: productData.product_id,
                product_code: productData.product_code,
                platform_id: Number(platform),
                pincode:
                  location.postcode === undefined ? "N/A" : location.postcode,
                platform: "mobile",
                state: location.state === undefined ? "N/A" : location.state,
                district:
                  location.district === undefined ? "N/A" : location.district,
                city: location.city === undefined ? "N/A" : location.city,
                area:
                  location.district === undefined ? "N/A" : location.district,
                known_name: location.city === undefined ? "N/A" : location.city,
                lat: location.lat === undefined ? "N/A" : String(location.lat),
                log: location.lon === undefined ? "N/A" : String(location.lon),
                method_id: 1,
                method: "point on product",
                points: totalPoints,
                type: "point on product",
              },
              qrId: Number(qrData.id),
              tenant_id: slug,
              token: token,
            };
            console.log("userPointEntryFunc", body);
            userPointEntryFunc(body);
          };
          submitPoints();
        } else if (pointSharingData.percentage_points) {
          console.log("using percentage points for this")
          const submitPoints = async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            let totalPoints ;
            let points;
            let memberShipBonus;
            if(Number(pointSharingData["percentage_points_value"])==0)
            {
               points =
              productMrp["mrp"]
               memberShipBonus = (points * Number(membershipPercent !==undefined ? membershipPercent : 0))/100
              totalPoints = memberShipBonus

            }
            else{
              points =
              productMrp["mrp"] *
              (pointSharingData["percentage_points_value"] / 100);
               memberShipBonus = (points * Number(membershipPercent !==undefined ? membershipPercent : 0))/100
          
           totalPoints = points + memberShipBonus
            }
            
          setShowPoints(totalPoints);
          console.log("Simple points Recieved",totalPoints,points,memberShipBonus,membershipPercent)
           
            const body = {
              data: {
                app_user_id: userData.id.toString(),
                user_type_id: userData.user_type_id,
                user_type: userData.user_type,
                product_id: productData.product_id,
                product_code: productData.product_code,
                platform_id: Number(platform),
                pincode:
                  location.postcode === undefined ? "N/A" : location.postcode,
                platform: "mobile",
                state: location.state === undefined ? "N/A" : location.state,
                district:
                  location.district === undefined ? "N/A" : location.district,
                city: location.city === undefined ? "N/A" : location.city,
                area:
                  location.district === undefined ? "N/A" : location.district,
                known_name: location.city === undefined ? "N/A" : location.city,
                lat: location.lat === undefined ? "N/A" : String(location.lat),
                log: location.lon === undefined ? "N/A" : String(location.lon),
                method_id: 1,
                method: "point on product",
                points: totalPoints,
                type: "point on product",
              },
              qrId: Number(qrData.id),
              tenant_id: slug,
              token: token,
            };
            console.log("userPointEntryFunc", body);
            userPointEntryFunc(body);
          };
          submitPoints();
        }
      }
      }
    } else if (checkUserPointError) {
      console.log("checkUserPointError", checkUserPointError);
    }
  }, [checkUserPointData, checkUserPointError]);

  useEffect(() => {
    if (userPointEntryData) {
      console.log("userPointEntryData", userPointEntryData);
      if (userPointEntryData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
    } else if (userPointEntryError) {
      if (userPointEntryError.status === 409) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
      else if(userPointEntryError.status === 400)
      {
        setError(true)
        setMessage(userPointEntryError.data.message)
      }
      console.log("userPointEntryError", userPointEntryError);
    }
  }, [userPointEntryData, userPointEntryError]);

  console.log("workflowProgram", workflowProgram);
  const handleWorkflowNavigation = () => {
    console.log("WorkflowProgram Left", workflowProgram);
    console.log("scccess");

    if (workflowProgram[0] === "Static Coupon") {
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Warranty") {
      navigation.navigate("ActivateWarranty", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Points On Product") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Cashback") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Wheel") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Genuinity") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("Genuinity", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Genuinity+") {
      console.log(workflowProgram.slice(1));
      navigation.navigate("GenuinityScratch", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram.length === 0) {
      setTimeout(() => {
        navigation.navigate("Dashboard");
      }, 3000);
    }
  };
  const navigateDashboard = () => {
    navigation.navigate("Dashboard");
  };
  const navigateQrScanner = () => {
    // navigation.navigate('QrCodeScanner')
    handleWorkflowNavigation();
  };
  const modalClose = () => {
    setError(false);
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: buttonThemeColor,
      }}
    >
      <View
        style={{
          height: "8%",
          flexDirection: "row",
          position: "absolute",
          top: 0,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "20%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              position: "absolute",
              left: 20,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          style={{ color: "white", fontSize: 18, right: 10 }}
          content="Congratulations"
        ></PoppinsTextMedium>
      </View>

      {/* main view */}

      <View
        style={{
          height: "92%",
          width: "100%",
          backgroundColor: "white",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <ScrollView
          style={{
            width: "100%",
            height: "100%",
            marginTop: 10,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <View
            style={{
              width: "100%",
              height: height - 100,
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: 10,
              backgroundColor: "white",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            }}
          >
            {/* actions pperformed container----------------------------------- */}
            <View
              style={{
                padding: 20,
                width: "90%",
                backgroundColor: "white",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#DDDDDD",
                marginTop: 50,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
              }}
            >
              <Image
                style={{
                  height: 70,
                  width: 70,
                  resizeMode: "contain",
                  margin: 10,
                }}
                source={require("../../../assets/images/gold.png")}
              ></Image>
              <PoppinsTextMedium
                style={{ color: "#7BC143", fontSize: 24, fontWeight: "700" }}
                content="Congratulations"
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{
                  color: "#333333",
                  fontSize: 20,
                  fontWeight: "500",
                  width: "60%",
                  marginTop: 6,
                }}
                content="You have successfully performed the action"
              ></PoppinsTextMedium>
              {/* action box ---------------------------------------------- */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {getCouponOnCategoryData && (
                  <CongratulationActionBox
                    title="Product Scanned"
                    data={[qrData].length}
                    primaryColor={buttonThemeColor}
                    secondaryColor={buttonThemeColor}
                  ></CongratulationActionBox>
                )}
                {/* {getCouponOnCategoryData &&<CongratulationActionBox title="Points Earned" data={productData.consumer_points} primaryColor={buttonThemeColor} secondaryColor={buttonThemeColor}></CongratulationActionBox>} */}
              </View>
              {/* -------------------------------------------------------- */}
            </View>
            {/* -------------------------------------------------------- */}
            {/* rewards container---------------------------------------------- */}
           {error &&  <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>}
            <View
              style={{
                padding: 10,
                width: "90%",
                backgroundColor: "#DDDDDD",
                borderRadius: 4,
                marginTop: 50,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  height: 48,
                  width: 160,
                  backgroundColor: buttonThemeColor,
                  borderWidth: 1,
                  borderStyle: "dotted",
                  borderColor: "white",
                  borderRadius: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  bottom: 30,
                }}
              >
                <PoppinsTextMedium
                  style={{ fontSize: 16, fontWeight: "800", color: "white" }}
                  content="You Have Won"
                ></PoppinsTextMedium>
              </View>

              {/* reward user according to the workflow ------------------------*/}
              {showBulkScanPoints && (
                <Win data="Number of items scanned" title={showBulkScanPoints.length}></Win>

              )}
              {showBulkScanPoints && (
                <Win data="Total Points Earned" title={Math.floor(Number(totalPoints))}></Win>

                // <View
                //   style={{
                //     height: "90%",
                //     width: "90%",
                //     alignItems: "center",
                //     justifyContent: "center",
                //   }}
                // >
                //   <ScrollView
                //     style={{ height: "100%", width: "100%" }}
                //     horizontal={true}
                //   >
                //     {showBulkScanPoints.map((item, index) => {
                //       return (
                //         <View
                //           key={index}
                //           style={{
                //             height: 200,
                //             width: "30%",
                //             alignItems: "center",
                //             justifyContent: "center",
                //             borderWidth:1,
                //             borderRadius:8,
                //             marginRight:30,
                //             backgroundColor:"white",
                //             padding:10
                //           }}
                //         >
                //           {item !== null ? (
                //             <View
                //               style={{
                //                 alignItems: "center",
                //                 justifyContent: "flex-start",
                //                 height:'80%'

                //               }}
                //             >
                //               <Celebrate name="celebration" size={40} color={ternaryThemeColor}></Celebrate>
                //               <PoppinsTextMedium
                //                 content={`${String(item.points).substring(0,6)} Points have been added `}
                //                 style={{ color: "black", fontSize: 14,marginTop:20}}
                //               ></PoppinsTextMedium>
                //             </View>
                //           ) : (
                //             <View
                //               style={{
                //                 alignItems: "center",
                //                 justifyContent: "flex-start",
                //                 height:'80%'
                //               }}
                //             >
                //               <Error name="error" size={40} color={ternaryThemeColor}></Error>
                               
                //             <PoppinsTextMedium
                //               content="There was some problem with this scanned QR"
                //               style={{ color: "black", fontSize: 16,marginTop:20 }}
                //             ></PoppinsTextMedium>
                //             </View>

                //           )}
                //         </View>
                //       );
                //     })}
                //   </ScrollView>
                // </View>
              )}
              {getCouponOnCategoryData && (
                <Win
                  data="Coupons Earned"
                  title={getCouponOnCategoryData.body.brand}
                ></Win>
              )}
              {userPointEntryData && (
                <Win data="Points Earned" title={String(showPoints).substring(0,5)}></Win>
              )}
              {createWheelHistoryData && (
                <Win data="Wheel" title="You have got a spin wheel"></Win>
              )}
              {addCashbackEnteriesData && (
                <Win
                  data="Cashback"
                  title={addCashbackEnteriesData.body.cashback}
                ></Win>
              )}
             {(userPointEntryIsLoading || addBulkPointOnProductIsLoading) && checkUserPointIsLoading && extraPointEntryIsLoading || <FastImage
                   style={{ width: 40, height: 40, alignSelf: 'center',justifyContent:'center' }}
                   source={{
                       uri: gifUri, // Update the path to your GIF
                       priority: FastImage.priority.normal,
                   }}
                   resizeMode={FastImage.resizeMode.contain}
               />}
              {/* {getCouponOnCategoryError && (
                <PoppinsText
                  content={`Coupons For This ${getCouponOnCategoryError.data.message}`}
                ></PoppinsText>
              )}
              {userPointEntryError && (
                <PoppinsText
                  content={`Points For This ${userPointEntryError.data.message}`}
                ></PoppinsText>
              )} */}
            </View>
          </View>
        </ScrollView>
        <View style={{ width: "100%", height: 80, backgroundColor: "white" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ButtonSquare
              style={{ color: "white" }}
              content="Cancel"
              handleOperation={navigateDashboard}
            ></ButtonSquare>
            <ButtonSquare
              style={{ color: "white" }}
              content="Okay"
              handleOperation={navigateQrScanner}
            ></ButtonSquare>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CongratulateOnScan;
