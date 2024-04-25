import React, { useEffect, useId, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Plus from "react-native-vector-icons/Entypo";
import Minus from "react-native-vector-icons/Entypo";
import Check from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import { useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation } from "../../apiServices/gifts/GiftApi";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import SuccessModal from "../../components/modals/SuccessModal";
import MessageModal from "../../components/modals/MessageModal";
import PointHistory from "../historyPages/PointHistory";
import { useGetAllCouponsMutation } from "../../apiServices/coupons/getAllCouponsApi";
import Expand from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";

const RedeemCoupons = ({ navigation, route }) => {
  const [search, setSearch] = useState();
  const [cart, setCart] = useState([]);
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [displayContent, setDisplayContent] = useState([]);
  const [pointBalance, setPointBalance] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const action = route.params?.action;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )
    ? useSelector((state) => state.apptheme.secondaryThemeColor)
    : "#FFB533";
  const userId = useSelector((state) => state.appusersdata.id);
  let tempPoints = 0;
  const [
    fetchAllCouponsFunc,
    { data: fetchAllCouponsData, error: fetchAllCouponsError },
  ] = useGetAllCouponsMutation();

  const {t} = useTranslation()

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = { userId: userId, token: token };
        userPointFunc(params);
        fetchAllCouponsFunc(token);
      }
    };
    getData();
    setCart([]);
  }, []);

  useEffect(() => {
    if (fetchAllCouponsData) {
      console.log("fetchAllCouponsData", fetchAllCouponsData);
      getDistinctCategories(fetchAllCouponsData.body);
      setDisplayContent(fetchAllCouponsData.body);
    } else if (fetchAllCouponsError) {
      console.log("fetchAllCouponsError", fetchAllCouponsError);
    }
  }, [fetchAllCouponsData, fetchAllCouponsError]);

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
      if (userPointData.success) {
        setPointBalance(userPointData.body.point_balance);
      }
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  const getDistinctCategories = (data) => {
    let allCategories = [];

    for (var i = 0; i < data.length; i++) {
      allCategories.push(fetchAllCouponsData.body[i].brand_name);
    }
    const set = new Set(allCategories);
    const arr = Array.from(set);
    setDistinctCategories(arr);
    console.log("setDistinctCategories", arr);
  };

  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };

  const handleSearch = (data) => {
    const searchOutput = fetchAllCouponsData.body.filter((item, index) => {
      return item.brand_name.toLowerCase().includes(data.toLowerCase());
    });
    setDisplayContent(searchOutput);
  };

  const Categories = (props) => {
    const image = props.image;
    const data = props.data;
    return (
      <TouchableOpacity
        onPress={() => {
          const filteredData = fetchAllCouponsData.body.filter(
            (item, index) => {
              return item.brand_name == data;
            }
          );
          setDisplayContent(filteredData);
          setCart([]);
        }}
        style={{
          marginLeft: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 35,
            marginLeft: 0,
            backgroundColor: secondaryThemeColor,
          }}
        >
          <Image
            style={{ height: 30, width: 30, resizeMode: "contain" }}
            source={image}
          ></Image>
        </View>
        <PoppinsTextMedium
          style={{
            color: "black",
            fontSize: 14,
            fontWeight: "600",
            marginTop: 2,
          }}
          content={data}
        ></PoppinsTextMedium>
      </TouchableOpacity>
    );
  };
  const addItemToCart = (data, operation, count, points) => {
    let tempCount = 0;
    let temp = cart;
    console.log("data", data);

    if (operation === "plus") {
      temp.push(data);
      setCart(temp);
    } else {
      // setPointBalance(pointBalance+Number(data.points))
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].id === data.id) {
          tempCount++;
          if (tempCount === 1) {
            temp.splice(i, 1);
          }
        }
      }

      setCart(temp);
    }

    console.log(temp);
  };

  const RewardsBox = (props) => {
    const [count, setCount] = useState(0);
    const [pointsSelected, setPointsSelected] = useState();
    const [showDropdown, setShowDropDown] = useState(false);
    const image = props.image;
    const points = props.points;
    const product = props.product;
    const category = props.category;
    const data = props.data;
    console.log("data", data);
    const cleanCategory = category.replace(/-API/g, "");

    const changeCounter = (operation) => {
      // console.log(pointBalance, "tempPoints", tempPoints, data.value,pointsSelected);
      if (operation === "plus") {
        if (pointsSelected) {
          if (tempPoints + Number(pointsSelected) <= pointBalance) {
            console.log(
              "Plus",
              Number(pointBalance),
              data.value,
              pointsSelected
            );

            if (Number(pointBalance) >= pointsSelected) {
              if (cart.length < 1) {
                tempPoints = tempPoints + pointsSelected;
                let temp = count;
                temp++;
                setCount(temp);
                const selectedValueData = data;
                selectedValueData["value"] = pointsSelected;
                props.handleOperation(selectedValueData, operation, temp);
              } else {
                alert("Kindly redeem one coupon at a time");
              }
            } else {
              setError(true);
              setMessage("Sorry you don't have enough points.");
            }
          }
        } else {
          setError(true);
          setMessage("Kindly select a value");
        }
      } else {
        let temp = count;
        temp--;
        setCount(temp);
        const selectedValueData = data;
        selectedValueData["value"] = pointsSelected;
        props.handleOperation(selectedValueData, operation, temp);
        tempPoints = tempPoints - pointsSelected;

        if (cart.length == 0) {
          tempPoints = 0;
        }

        // setPointBalance(pointBalance+data.points)
      }
    };

    return (
      <TouchableOpacity
        onPress={() => {
          console.log("Pressed");
        }}
        style={{
          height: 170,
          width: "90%",
          alignItems: "center",
          justifyContent: "flex-start",
          borderWidth: 0.6,
          borderColor: "#EEEEEE",
          backgroundColor: "#FFFFFF",
          margin: 10,
          marginLeft: 20,
          elevation: 4,
        }}
      >
        <View
          style={{
            height: "40%",
            width: "100%",
            backgroundColor: secondaryThemeColor,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              height: 50,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0.4,
              borderColor: "#DDDDDD",
              backgroundColor: "white",
              marginLeft: 20,
              top: 0,
            }}
          >
            <Image
              style={{ height: 50, width: 50, resizeMode: "contain" }}
              source={{ uri: image }}
            ></Image>
          </View>
          <View
            style={{
              marginLeft: 40,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 100,
              top: 20,
              zIndex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                height: 30,
                borderRadius: 4,
              }}
              onPress={() => {
                setShowDropDown(!showDropdown);
              }}
            >
              <LinearGradient
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  padding: 4,
                }}
                colors={["#FF9100", "#E4C52B"]}
              >
                <Image
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                  source={require("../../../assets/images/coin.png")}
                ></Image>
                {pointsSelected ? (
                  <PoppinsTextMedium
                    style={{
                      fontSize: 12,
                      color: "white",
                      fontWeight: "700",
                      marginLeft: 10,
                    }}
                    content={`Select value: ${pointsSelected}`}
                  ></PoppinsTextMedium>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <PoppinsTextMedium
                      style={{
                        fontSize: 12,
                        color: "white",
                        fontWeight: "700",
                        marginLeft: 10,
                      }}
                      content={"Select value"}
                    ></PoppinsTextMedium>
                    <Expand name="expand-more" size={20}></Expand>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
            {showDropdown && (
              <View
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  zIndex: 1,
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                }}
              >
                <FlatList
                  data={points}
                  renderItem={({ item }) =>
                    item.value != 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setPointsSelected(item.value);
                          setShowDropDown(false);
                        }}
                        style={{
                          height: 20,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "white",
                          borderBottomWidth: 1,
                          borderColor: "#DDDDDD",
                          width: "100%",
                        }}
                      >
                        <PoppinsTextMedium
                          style={{ color: "black" }}
                          content={item.value}
                        ></PoppinsTextMedium>
                      </TouchableOpacity>
                    )
                  }
                  keyExtractor={(item) => item.id}
                />
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              position: "absolute",
              right: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (count > 0) {
                  changeCounter("minus");
                }
              }}
            >
              <Minus name="minus" color="black" size={24}></Minus>
            </TouchableOpacity>

            <View
              style={{
                height: 24,
                width: 20,
                backgroundColor: "white",

                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PoppinsTextMedium
                style={{ color: "black", fontSize: 14, fontWeight: "700" }}
                content={count}
              ></PoppinsTextMedium>
            </View>
            <TouchableOpacity
              onPress={() => {
                changeCounter("plus");
              }}
            >
              <Plus name="plus" color="black" size={20}></Plus>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: "62%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
            width: "100%",
            zIndex: -1,
          }}
        >
          <PoppinsTextMedium
            style={{
              color: "black",
              fontSize: 13,
              width: "90%",
              marginLeft: 4,
            }}
            content={product}
          ></PoppinsTextMedium>

          <PoppinsTextMedium
            style={{ color: "#919191", fontSize: 12, width: "100%" }}
            content={cleanCategory}
          ></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: ternaryThemeColor,
        height: "100%",
      }}
    >
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}
        ></MessageModal>
      )}
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: "10%",
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <PoppinsTextMedium
            content={t("Redeem Points")}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "700",
              color: "white",
            }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={`${pointBalance} ${t("pts available")}`}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "700",
              color: "white",
            }}
          ></PoppinsTextMedium>
        </View>
      </View>
      <View
        style={{
          height: "90%",
          width: "100%",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          alignItems: "center",
          justifyContent: "flexx-start",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: "#EFF6FC",
            width: "100%",
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            paddingBottom: 20,
          }}
        >
          {fetchAllCouponsData && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  height: 40,
                  width: "80%",
                  backgroundColor: "white",
                  borderRadius: 20,
                }}
              >
                <Icon
                  style={{ position: "absolute", left: 10 }}
                  name="magnifying-glass"
                  size={30}
                  color={ternaryThemeColor}
                ></Icon>
                <TextInput
                  style={{ marginLeft: 20, width: "70%", color: "black" }}
                  placeholder="Type Product Name"
                  value={search}
                  onChangeText={(text) => {
                    handleSearch(text);
                  }}
                ></TextInput>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  style={{ height: 26, width: 26, resizeMode: "contain" }}
                  source={require("../../../assets/images/settings.png")}
                ></Image>
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setDisplayContent(fetchAllCouponsData.body);
              setCart([]);
            }}
            style={{
              height: 70,
              width: 70,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 40, width: 40, resizeMode: "contain" }}
              source={require("../../../assets/images/categories.png")}
            ></Image>
            <PoppinsTextMedium
              style={{
                color: "black",
                fontSize: 14,
                fontWeight: "600",
                marginTop: 2,
              }}
              content="All"
            ></PoppinsTextMedium>
          </TouchableOpacity>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            {distinctCategories &&
              distinctCategories.map((item, index) => {
                return (
                  <Categories
                    key={index}
                    data={item}
                    image={require("../../../assets/images/box.png")}
                  ></Categories>
                );
              })}
          </ScrollView>
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 300,
          }}
        >
          <PoppinsTextMedium
            style={{
              color: "#171717",
              fontSize: 14,
              fontWeight: "700",
              marginTop: 10,
              marginBottom: 10,
            }}
            content={t("rewards")}
          ></PoppinsTextMedium>
          {displayContent && (
            <FlatList
              data={
                [
                {
                    "id": 2173,
                    "brand_product_code": "AmazonRIhSTVp1rf8PWOZJ",
                    "brand_name": "Amazon",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "1",
                    "online_redemption_url": "https://www.amazon.in/?&tag=1195330-21",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1669891154334_1canbt2f4olb4y2t26.png",
                    "denomination_list": "1000",
                    "stock_available": true,
                    "category": "Apparels & Accessories,electronic,Gifting,Grocery & Home Needs,Online",
                    "descriptions": "",
                    "tnc": "1.Amazon Gift Cards (\"GCs\") are issued by the Qwikcilver Solutions Private limited (\"Qwikcilver\"). Credit and Debit Cards issued outside India cannot be used to purchase Amazon.in Gift Cards.<br/>2.To add your GC to your Amazon Pay balance, visit www.amazon.in/addgiftcard<br/>3.Beneficiary can apply the 14 digit code (under scratch card) on amazon.in/addgiftcard and add the gift card balance in his/her Amazon.in account. This balance gets automatically applied at the time of next purchase. There is no cap on number of gift cards that can be added to an account.<br/>4.Amazon Pay balance is a sum of all balances associated with the GCs in your Amazon.in account.<br/>5.Amazon Pay balance are redeemable across all products on Amazon.in except apps, certain global store products and other Amazon.in gift cards.<br/>6.Amazon Pay balance must be used only towards the purchase of eligible products on amazon.in<br/>7.The GCs, including any unused Amazon Pay balance, expire one year from the date of issuance of the GC<br/>8.GCs cannot be transferred for value or redeemed for the cash.<br/>9.Qwikcilver, Amazon Seller Service Private Limited (\"Amazon\") or their affiliates are not responsible if a GC is lost, stolen, destroyed or used without permission.<br/>10.For Complete terms and conditions, see www.amazon.in/giftcardtnc<br/>11.Amazon.in logo/trademark is an IP of Amazon or its affiliates and the Qwikcilver trademark/logo is an IP of Qwikcilver.<br/>12.To redeem your GC, visit www.amazon.in/addgiftcard<br/>Note:- For any help on how to use the voucher please call on 1800 3000 9009.",
                    "important_instruction": "<ul>\r\n<li>Amazon Pay Gift Cards are valid for 365 days from the date of purchase and carry no fees</li>\r\n<li>Receiver can apply the 14 digit alpha-numeric code (for e.g. 8U95-Y3E8CQ-29MPQ) on <a href=\"http://www.amazon.in/add\">amazon.in/addgiftcard</a> and add the Amazon Pay balance in their account</li>\r\n<li>Amazon Pay Gift Cards cannot be refunded or returned</li>\r\n<li>Amazon Pay Gift cards are redeemable across all products on Amazon except apps, certain global store products and other Amazon Pay gift cards</li>\r\n<li>Visit <a href='https://gftr.it/amzvid'>https://gftr.it/amzvid</a> to watch the video for redemption process.</li>\r\n</ul>",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 1000
                        }
                    ]
                },
                {
                    "id": 2174,
                    "brand_product_code": "Archies_GallaryvXiA6XEtTqS5n5jX",
                    "brand_name": "Archies Gallary",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "3",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593453120537_3yzv488m3kc0sugpl.jpeg",
                    "denomination_list": "200",
                    "stock_available": true,
                    "category": "Gifting,Online",
                    "descriptions": "Wish your loved ones with Archies. This is India?s most preferred destination for gifts and greeting cards that let you express your feelings. Let?s make it easier for you with Archies gift vouchers. Buy and redeem these gift vouchers instantly on your next purchase from this magical place.",
                    "tnc": "1.The holder of the Instant Gift Voucher is deemed to be the beneficiary <br/>2.Beneficiary should announce the intent of using the Instant Gift Voucher before placing the order <br/>3.Only valid Instant Gift Vouchers at the sole discretion of Archies shall be accepted for redemption <br/>4.Multiple Instant Gift Vouchers can be used against one bill <br/>5.Partial redemption is allowed but no refund or credit note would be issued against a unused or partially used Instant Gift Voucher<br/>6.Instant Gift Voucher cannot be revalidated once expired <br/>7.Archies or its affiliates are not responsible on account of the beneficiary sharing the Instant Gift Voucher number and the Instant Gift Voucher getting redeemed on that account.<br/>8.Instant Gift Vouchers will be accepted across all outlets mentioned,  but Archies at its sole discretion may add or remove an outlet from the list without giving any prior notice <br/>9.Archies makes full efforts to accept all Instant Gift Vouchers but on account of technical /administrative reasons, an outlet may refuse to accept Instant Gift Vouchers<br/>10.This Instant Gift Voucher cannot be redeemed on specific block out dates. Archies may add or delete any date on its sole discretion <br/>11.Archies or any of it partners would not be liable for any form of  compensation etc. on account of an outlet not being able to accept Instant Gift Voucher.  The customer would be liable to settle the bill  <br/>12.If an Instant Gift Voucher gets blocked on account of technical issue, it would get activated in 72 hours<br/>13.Any dispute should be referred to the company from where the Instant Gift Voucher has been received, decision of the company shall be final <br/>14.Please contact Shop Manager for any acceptance issue and if issue is still not resolved, you can write in to help@gyftr.com or call 18001033314 for immediate help",
                    "important_instruction": "",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 200
                        }
                    ]
                },
                {
                    "id": 1962,
                    "brand_product_code": "Baskin_Robins3wlnz4npjdrUFMgr",
                    "brand_name": "Baskin Robins",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/stag/images/brands/1593576216465_u3qtc4mikc2u4u4x.png",
                    "denomination_list": "100,250",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": "Get extra 5X Reward Points on Select Credit Cards & 5% Cashback instantly on Baskin Robbins Gift Vouchers & Gift Cards with HDFC Credit & Debit Cards. Grab the Offers Now!!\r\nUse Baskin Robbins to indulge in the flavor of ice creams, shakes, cakes, sundaes, and more. With its 700 stores across India, the world's biggest ice cream specialty chain pampers your taste buds. Use gift cards and gift vouchers from Baskin Robbins and pamper your buds with delicious flavors.",
                    "tnc": "1.The HOLDER  of the Voucher Code   is deemed to be the beneficiary <br/>2.Beneficiary should announce the intent of using the voucher before placing the order <br/>3.Only valid vouchers at the sole discretion of Baskin Robbins restaurants shall be accepted for redemption<br/>4.Multiple vouchers can be used against one bill <br/>5.Partial redemption is not allowed<br/>6.No refund or credit note would be issued against a unused or partially used voucher <br/>7.Voucher cannot be revalidated once expired <br/>8.Baskin Robbins/ affiliates are not responsible on account of the beneficiary sharing the voucher number and the voucher getting redeemed on that account.<br/>9.Baskin Robbins may ask for a valid govt. identity proof at the time of redeeming the voucher  <br/>10.Vouchers will be accepted across all outlets mentioned,  but Baskin Robbins at its sole discretion may add or remove an outlet from the list without giving any prior notice <br/>11.Baskin Robbins makes full efforts to accept voucher, but on account of any  technical / administrative reasons an outlet may refuse to accept a voucher <br/>12. This voucher cannot be redeemed on specific block out dates which Baskin Robbins may add or delete any date on its sole discretion <br/>13.Baskin Robbins  or any of it partners would not be liable for any form of  compensation etc  on account of an outlet not being able to accept  voucher.  The customer would be liable to settle the bill  <br/>14.If a voucher gets blocked on account of technical issue the voucher would be usable only post  72 hours <br/>15.Please Contact Restaurant manager for any acceptance issue.<br/>16.Any dispute should be referred to the company from where the voucher has been received , decision of the company shall be final",
                    "important_instruction": "<ul>\r\n<li>Multiple Gift Vouchers <strong>CAN</strong> be used in one bill.</li>\r\n<li>Visit <a href=\"https://gftr.it/olthd\">https://gftr.it/olthd</a> to watch the video for offline redemption process</li>\r\n<li>Gift Vouchers <strong>CANNOT</strong> be clubbed with any other Offer.</li>\r\n<li>Gift Vouchers <strong>ACCEPTED</strong> at all Listed Outlets.</li>\r\n<li>Gift Vouchers <strong>CANNOT</strong> be used Online.</li>\r\n</ul>",
                    "redeem_steps": "{\"1\":{\"text\":\"Visit the restaurant as per your Gift Voucher!! Inform the cashier about the Gift Voucher before ordering food.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475911045_8lmh4nky30dj0l.png\",\"old_image\":\"\"},\"2\":{\"text\":\"Order food & enjoy your meal!\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475911152_8lmh4nky30dj3k.png\",\"old_image\":\"\"},\"3\":{\"text\":\"Provide the Gift Voucher to the cashier at the time of billing & pay remaining amount by card or cash if any.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475911221_8lmh4nky30dj5h.png\",\"old_image\":\"\"}}",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 100
                        },
                        {
                            "value": 0,
                            "denomination": 250
                        }
                    ]
                },
                {
                    "id": 2176,
                    "brand_product_code": "Bata4xfRrUnT46Uv4iol",
                    "brand_name": "Bata",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "2",
                    "online_redemption_url": "https://www.bata.in/",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/stag/images/brands/1593693691875_u3qtc3vzkc4s2qqr.png",
                    "denomination_list": "100,500",
                    "stock_available": true,
                    "category": "BATA-API,Food & Beverages,Lifestyle",
                    "descriptions": "If you?re looking for the best-in-class affordable footwear that does not compromise on style, Bata is the brand for you. They began as a small business in 1931, but have now evolved into India?s largest retailer and a leading manufacturer of footwear in India. Being market leaders in the formal shoe domain, they are beginning to dominate the ladies shoe segment. GyFTR has made buying Bata shoes online effortless and economical. Bata Gift Vouchers and Gift Cards can be redeemed across all Bata s",
                    "tnc": "1.This is a Bata Insta Gift Voucher (GV) / Gift Card (GC) and would be accepted at listed outlets. For Outlet List, please visit www.gyftr.com/bata  <br/>2.The person who has the Bata GV / GC Code is deemed to be the beneficiary.<br/>3.Do inform the cashier that you plan to use the GV / GC for making payments before billing.<br/>4.Only the listed Bata outlets at its sole discretion accept the GV / GC.  Bata may add or remove an outlet without giving any prior notice.<br/>5.A maximum of 7 GV / GC can be used in one bill.<br/>6.This is a ONE time use GV / GC.<br/>7.No Credit note / Refund for the unused amount of the GV / GC will be given.<br/>8.Bata GV / GC CANNOT be revalidated once expired.<br/>9.Bata GV / GC can be used during sale.<br/>10.Bata GV / GC cannot be redeemed on specific block out dates. Bata may add or delete any date on its sole discretion <br/>11.Any dispute related to the GV / GC should be referred to the issuing company and the decision of the issuing company shall be final.<br/>12.Bata makes full efforts to accept Insta Gift Vouchers (GV) / Gift Card (GC), but on account of any technical / administrative reasons an outlet may refuse to accept the same.<br/>13.If an Insta Gift Voucher (GV) /Gift Card (GC) gets blocked on account of technical issue, it would get enabled in 72 hours.<br/>14.Please contact Shop manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help",
                    "important_instruction": "A maximum of 7 Gift Vouchers CAN be used in one bill.<br>\r\nGift Vouchers CAN be used during Sale.<br>\r\nGift Vouchers are ACCEPTED at all Listed Outlets.<br>\r\nGift Vouchers CANNOT be used Online....<br>",
                    "redeem_steps": "{\"1\":{\"text\":\"[1] Use the outlet locator to locate the nearest outlet that accepts this Gift Voucher.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475064406_8lmh4nky2zvdqv.jpeg\",\"old_image\":\"\"},\"2\":{\"text\":\"[2] Select your choice of product.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475065664_8lmh4nky2zveps.jpeg\",\"old_image\":\"\"},\"3\":{\"text\":\"[3] Share your Gift Voucher with the cashier at the time of billing & pay the remaining amount by cash or card if required.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475065949_8lmh4nky2zvexp.jpeg\",\"old_image\":\"\"}}",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 100
                        },
                        {
                            "value": 0,
                            "denomination": 500
                        }
                    ]
                },
                {
                    "id": 2177,
                    "brand_product_code": "BenettonRwJ6cqVWqPPMLlBH",
                    "brand_name": "Benetton",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593453403563_3yzv488m3kc0t0j3f.png",
                    "denomination_list": "5000",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": "Celebrate diversity and youth with a colorful Benetton collection. Shop for a range of high-quality clothing and accessories for women and men. Use United Colors of Benetton gift vouchers and gift cards to get discounts on your next shopping spree.",
                    "tnc": "1.The holder of the Instant Gift Voucher number is deemed to be the beneficiary <br/>2.Multiple Gift Vouchers can be used in a single bill <br/>3.Beneficiary should announce the intent of using the Instant Gift Voucher before making a purchase <br/>4.Partial redemption is allowed but no refund or credit note would be issued against a unused or partially used Instant Gift Voucher<br/>6.Instant Gift Voucher cannot be revalidated once expired <br/>7.UCB or its affiliates are not responsible on account of the beneficiary sharing the Instant Gift Voucher number and the voucher getting redeemed on that account <br/>8.The Brand may ask for a valid Government identity proof at the time of redeeming the Instant Gift Voucher  <br/>9.Instant Gift Vouchers will be accepted across all the mentioned list of outlets, but UCB at its sole discretion may add or remove an outlet from the list without giving any prior notice <br/>10.UCB  makes full efforts to accept all Instant Gift Voucher but on account of technical / administrative reasons, an outlet may refuse to accept vouchers<br/>11.This Instant Gift Voucher cannot be redeemed on specific block out dates. UCB may add or delete any date at its sole discretion <br/>12.UCB  or any of its partners would not be liable for any form of compensation etc. on account of an outlet not being able to accept Instant Gift Voucher.  The customer would be liable to settle the bill<br/>13.If an Instant Gift Voucher gets blocked on account of technical issue, it would get activated in 72 hours<br/>14.Any dispute should be referred to the company from where the Instant Gift Voucher has been received, decision of the company shall be final <br/>15.Please contact Shop Manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help",
                    "important_instruction": "",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 5000
                        }
                    ]
                },
                {
                    "id": 2178,
                    "brand_product_code": "Cafe_Coffee_Day_Online0ZbORkZDJ0lrKq8t",
                    "brand_name": "Cafe Coffee Day Online",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593576962072_1yeeckzpkc2uktg8.png",
                    "denomination_list": "50,500",
                    "stock_available": true,
                    "category": "Food & Beverages,Gifting,Online",
                    "descriptions": "Get a chance to order collectibles and merchandise from India?s favourite coffee place: Cafe Coffee Day. You can also order the finest coffee beans and green tea from its online store. Use Cafe Coffee Day Online gift vouchers for a seamless experience. These vouchers are available under different denominations. bh",
                    "tnc": "1.The holder of the Gift Code number is deemed to be the beneficiary <br/>2.This Gift Code Can  be used only for Café Coffee Day s Online Ordering. Please note that this Gift Code will not be accepted for payments at the outlets.<br/>3.You can use this Gift Code by visiting www.cafecoffeeday.com and choosing the Order Online Option<br/>4.Multiple Gift Codes can be used against one bill <br/>5.The Gift Code can be used only once. No refund or credit note will be issued against an unused or  partially used Gift Code.<br/>6.Gift Code cannot be revalidated once expired <br/>7.Any dispute should be referred to the issuing company and the decision of the issuing company shall be final<br/>8.The Gift Code has been issued subject to terms of the company<br/>9.If a Gift Code gets blocked on account of any technical issue and is not consumed, would be reusable after 72 Hrs <br/>10.This Gift Code cannot be clubbed with any other on-going promotion or offer<br/>11.You  can write in to help@mygyftr.com or call 0 851000  4444 for immediate help",
                    "important_instruction": "",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 50
                        },
                        {
                            "value": 0,
                            "denomination": 500
                        }
                    ]
                },
                {
                    "id": 2179,
                    "brand_product_code": "Cromal06iVDqb5Yv79W20",
                    "brand_name": "Croma",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "1",
                    "online_redemption_url": "https://www.croma.com",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/stag/images/brands/1592031701585_u3qtc9fxkbdakitt.png",
                    "denomination_list": "100,250,500,1000,2000,5000",
                    "stock_available": true,
                    "category": "electronic,Gifting",
                    "descriptions": "Get a discount on Croma Gift Voucher using HDFC Credit & Debit Card. Get 5x Reward Points on Select Credit cards & 5% cashback on Credit & Debit Cards\r\nCroma was India's first multi-brand retail store for electronics to open. Owned by Tata, under one roof you'll get every electronic product. Customers get every item at the best rates from professional DSLRs to recent smartphones. Buy Croma Gift Cards and Cashless Shopping Gift Vouchers",
                    "tnc": "1.The holder of the Instant Gift Voucher is deemed to be the beneficiary<br/>2.Beneficiary should announce the intent of using the Instant Gift Voucher before making a purchase<br/>3.Only valid Instant Gift Vouchers at the sole discretion of CROMA shall be accepted for redemption<br/>4.Multiple vouchers can be used against one bill.<br/>6.Partial redemption is allowed but no refund or credit note would be issued against an unused or partially used Instant Gift Voucher<br/>7.Instant Gift Voucher cannot be revalidated once expired<br/>8.CROMA or its affiliates are not responsible on account of the beneficiary sharing the Instant Gift Voucher number and the voucher getting redeemed on that account<br/>9.The Brand may ask for a valid Government identity proof at the time of redeeming the voucher<br/>10.Instant Gift Vouchers will be accepted across all mentioned outlets at its sole discretion may add or remove an outlet from the list without giving any prior notice<br/>11.CROMA makes full efforts to accept all Instant Gift Vouchers but on account of technical / administrative reasons, an outlet may refuse to accept vouchers<br/>12.This Instant Gift Voucher cannot be redeemed on specific block out dates. CROMA may add or delete any date on its sole discretion<br/>13.CROMA or any of its partners would not be liable to pay any form of compensation etc on account of an outlet not being able to accept Instant Gift Voucher. The customer would be liable to settle the bill<br/>14.If an Instant Gift Voucher gets blocked on account of technical issue, it would get activated in 72 hours<br/>15.Any dispute should be referred to the company from where the Instant Gift Voucher has been received , decision of the company shall be final<br/>16.Please contact Shop Manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help.",
                    "important_instruction": "Multiple Gift Vouchers CAN be used in one bill.\r\nGift Vouchers CAN be used to buy discounted products.\r\nGift Vouchers are ACCEPTED at all Listed Outlets",
                    "redeem_steps": "{\"1\":{\"text\":\"Use the outlet locator to locate the nearest outlet that accepts this Gift Voucher.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475564974_8lmh4nky3063zi.png\",\"old_image\":\"\"},\"2\":{\"text\":\"Select your product.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475565054_8lmh4nky30641q.png\",\"old_image\":\"\"},\"3\":{\"text\":\"Share your Gift Voucher with the cashier at the time of billing & pay the remaining amount by cash or card if required.\",\"image\":\"https:\/\/cdn.gyftr.com\/comm_engine\/stag\/images\/brands\/caption\/1641475565138_8lmh4nky306443.png\",\"old_image\":\"\"}}",
                    "value": [
                        {
                            "value": 100,
                            "denomination": 100
                        },
                        {
                            "value": 250,
                            "denomination": 250
                        },
                        {
                            "value": 500,
                            "denomination": 500
                        },
                        {
                            "value": 0,
                            "denomination": 1000
                        },
                        {
                            "value": 0,
                            "denomination": 2000
                        },
                        {
                            "value": 100,
                            "denomination": 5000
                        }
                    ]
                },
                {
                    "id": 2180,
                    "brand_product_code": "Hidesign2lu371C7Vepik0k5",
                    "brand_name": "Hidesign",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "2",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593580333569_mp92eskc2wl2wx.png",
                    "denomination_list": "1000",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": "Update your leather collection with the best quality leather handbags and shoes. Hidesign offers a diverse range of premium handbags, tote bags, wallets, side bags, shoes, and more. Get high-quality leather products at discounts using Hidesign gift vouchers and gift cards.",
                    "tnc": "Terms & Conditions :<br/>1.The holder of the Hidesign Instant E- Gift Voucher (GV) / Gift Card number  is deemed to be the beneficiary <br/>2.Beneficiary should announce the intent of using the Hidesign Instant E- Gift Voucher (GV) / Gift Card  before making a purchase<br/>3.Only valid Hidesign Instant E- Gift Voucher (GV) / Gift Card number along with the PIN shall at the sole discretion of Hidesign shall be accepted for redemption<br/>4.This Hidesign Instant E- Gift Voucher (GV) / Gift Card can be redeemed across all exclusive Hidesign boutiques in India<br/>5.Multiple Hidesign Instant E- Gift Voucher (GV) / Gift Card can be used against one bill <br/>6.Partial redemption of the Hidesign Instant E- Gift Voucher (GV) / Gift Card number is allowed but no refund or credit note would be issued against a unused or partially used Hidesign Instant E- Gift Voucher (GV) / Gift Card <br/>7.Hidesign Instant E- Gift Voucher (GV) / Gift Card  cannot be revalidated once expired <br/>8.Hidesign affiliates are not responsible on account of the beneficiary sharing the Hidesign Instant E- Gift Voucher (GV) / Gift Card number and the    same getting redeemed on that account <br/>9.Any dispute related to the Hidesign Instant E- Gift Voucher (GV) / Gift Card number should be referred to the issuing company and the decision of the issuing company shall be final<br/>10.All terms and conditions of the Hidesign Instant E- Gift Voucher (GV) / Gift Card  are subject to change at Hidesign's discretion<br/>11.Hidesign Instant E- Gift Voucher (GV) / Gift Card can be redeemed for the face value as mentioned<br/>12.Store Staff may ask for a valid govt. identity proof at the time of redeeming the Hidesign Instant E- Gift Voucher (GV) / Gift Card<br/>13.Hidesign  at its sole discretion may add or remove an outlet from the list without giving any prior notice <br/>14.Hidesign makes full efforts to accept Hidesign Instant E- Gift Voucher (GV) / Gift Card, but on account of any  technical / administrative reasons an outlet may refuse to accept the same<br/>15.If an Hidesign Instant E- Gift Voucher (GV) / Gift Card gets blocked on account of technical issue, it would get enabled in 72 hours<br/>16.Please Contact Hidesign Shop manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help",
                    "important_instruction": "",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 1000
                        }
                    ]
                },
                {
                    "id": 2181,
                    "brand_product_code": "Hush_PuppiesY5262fAv0azSGTmn",
                    "brand_name": "Hush Puppies",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593636164652_mp930gkc3ttqgc.png",
                    "denomination_list": "9999",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": "Hush Puppies is a footwear and accessory brand that gives you timeless style and dependable comfort with high quality. This American brand manufactures contemporary, and casual footwear for men, women, and children. Their classics suede shoes are a popular choice among its customers which have been made more affordable for you with Hush Puppies Gift Cards and Gift Vouchers.",
                    "tnc": "1.This is a Hush Puppies Insta Gift Voucher (GV) / Gift Card (GC) and would be accepted at listed outlets. For Outlet List, please visit www.gyftr.com/hushpuppies <br/>2.The person who has the Hush Puppies GV / GC Code is deemed to be the beneficiary.<br/>3.Do inform the cashier that you plan to use the GV / GC for making payments before billing.<br/>4.Only the listed Hush Puppies outlets at its sole discretion accept the GV / GC. Hush Puppies may add or remove an outlet without giving any prior notice.<br/>5.A maximum of 7 GV / GC can be used in one bill.<br/>6.This is a ONE time use GV / GC.<br/>7.No Credit note / Refund for the unused amount of the GV / GC will be given.<br/>8.Hush Puppies GV / GC CANNOT be revalidated once expired.<br/>9.Hush Puppies GV / GC can be used during sale.<br/>10.Hush Puppies GV / GC cannot be redeemed on specific block out dates. Hush Puppies may add or delete any date on its sole discretion.<br/>11.Any dispute related to the GV / GC should be referred to the issuing company and the decision of the issuing company shall be final.<br/>12.Hush Puppies makes full efforts to accept Insta Gift Vouchers (GV) / Gift Card (GC), but on account of any technical / administrative reasons an outlet may refuse to accept the same.<br/>13.If an Insta Gift Voucher (GV) /Gift Card (GC) get blocked on account of technical issue, it would get enabled in 72 hours.<br/>14.Please contact Shop manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help.",
                    "important_instruction": "",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 9999
                        }
                    ]
                },
                {
                    "id": 2182,
                    "brand_product_code": "JackJones4KViGCuoQefnSXaY",
                    "brand_name": "Jack & Jones",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": null,
                    "online_redemption_url": null,
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593453480043_3yzv488m3kc0t263v.png",
                    "denomination_list": "1000,2500",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": null,
                    "tnc": "1.The holder of the Instant Gift Voucher number  is deemed to be the beneficiary <br/>2.Beneficiary should announce the intent of using the Instant Gift Voucher before making a purchase<br/>3.Only valid Instant Gift Vouchers at the sole discretion of Jack & Jones shall be accepted for redemption<br/>4.This Instant Gift Voucher can be redeemed at listed 86 plus Jack & Jone premium stores across India. <br/>5.Multiple Instant Gift Vouchers can be used against one bill <br/>6.Partial redemption is allowed but no refund or credit note would be issued against an unused or partially used Instant Gift Voucher<br/>7.Instant Gift Voucher cannot be revalidated once expired <br/>8.Jack & Jones affiliates are not responsible on account of the beneficiary sharing the Instant Gift Voucher and the  Voucher getting redeemed on that account <br/>9.Any dispute should be referred to the issuing company and the decision of the issuing company shall be final<br/>10.The Instant Gift Voucher has been issued subject to terms of the company<br/>11.Jack & Jones Store Staff may ask for a valid Government identity proof at the time of redeeming the Instant Gift Voucher<br/>12.Vouchers will be accepted across all outlets mentioned,  but Jack & Jones at its sole discretion may add or remove an outlet from the list without giving any prior notice <br/>13. Jack & Jones make full efforts to accept all Instant Gift Vouchers but on account of technical / administrative reasons, an outlet may refuse to accept vouchers<br/>14.If an Instant Gift Voucher gets blocked on account of technical issue, it would get activated in 72 hours<br/>15.Any dispute should be referred to the company from where the Instant Gift Voucher has been received, decision of the company shall be final <br/>16.Please contact Shop Manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help",
                    "important_instruction": "hello2",
                    "redeem_steps": "[{\"caption\":\"\"}]",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 1000
                        },
                        {
                            "value": 0,
                            "denomination": 2500
                        }
                    ]
                },
                {
                    "id": 2183,
                    "brand_product_code": "PantaloonsWCTHZ2lLyjMz2Xki",
                    "brand_name": "Pantaloons",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "3",
                    "online_redemption_url": "https://clk.omgt5.com/?PID=36418&AID=1195330",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1673950589596_1mqjr64i2ld02ylcs.jpeg",
                    "denomination_list": "100",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": "Pantaloons is India?s preferred clothing retail brand. The brand offers a multitude of options across the casual, ethnic, party, and sports segments. You can bring the entire family along. Because Pantaloons has something for everyone. Pantaloons gift cards and gift vouchers give a cashless shopping experience",
                    "tnc": "TEST",
                    "important_instruction": "<ul>\r\n<li>This is a Pantaloons Insta Gift Voucher (GV) / Gift Card (GC) and can be redeemed for any product at participating pantaloons stores across India.</li>\r\n<li>More than one GV / GC can be used in one bill.</li>\r\n<li>Pantaloons GV / GC can be used during sale.</li>\r\n<li>Pantaloons E-Gift voucher is not valid at shop-in-shops & on jewellery.</li>\r\n</ul>",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 100
                        }
                    ]
                },
                {
                    "id": 2184,
                    "brand_product_code": "PizzaHutb0REyWnQJmcJozoM",
                    "brand_name": "Pizza Hut",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": null,
                    "online_redemption_url": null,
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593577589894_1yeeckzpkc2uy9vq.png",
                    "denomination_list": "100",
                    "stock_available": true,
                    "category": "Amazon-API,Bars,BATA-API,electronic,Entertainment,Food & Beverages,Generic,Gifting,Holiday,Hotel,Lifestyle,Luggage,Online,Online Vouchers,Qual API,SHOES,Test,Yepme-Online",
                    "descriptions": null,
                    "tnc": "1.This is a Yum! Restaurants Insta Gift Voucher (GV) / Gift Card (GC) and would be accepted at listed outlets. (For Outlet List, please visit www.gyftr.com/pizzahut. \r\n2.The person who has the Yum! Restaurants GV / GC Code is deemed to be the beneficiary. \r\n3.Do inform the cashier that you plan to use the GV / GC for making payments before billing. \r\n4.Only the listed Yum! Restaurants outlets at its sole discretion accept the GV / GC. Yum! Restaurants may add or remove an outlet without giving any prior notice. \r\n5.More than one GV / GC can be used in one bill. \r\n6.This is a ONE time use GV / GC. \r\n7.No Credit note / Refund for the unused amount of the GV / GC will be given. \r\n8.Yum! Restaurants GV / GC CANNOT be revalidated once expired. \r\n10.Yum! Restaurants GV / GC cannot be redeemed on specific block out dates. Yum! Restaurants may add or delete any date on its sole discretion. \r\n11.Any dispute related to the GV / GC should be referred to the issuing company and the decision of the issuing company shall be final. \r\n12.Yum! Restaurants make full efforts to accept Insta Gift Vouchers (GV) / Gift Card (GC), but on account of any technical / administrative reasons an outlet may refuse to accept the same. \r\n13.If an Insta Gift Voucher (GV) /Gift Card (GC) gets blocked on account of technical issue, it would get enabled in 72 hours. \r\n14.Please contact Shop manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help.",
                    "important_instruction": null,
                    "redeem_steps": null,
                    "value": [
                        {
                            "value": 0,
                            "denomination": 100
                        }
                    ]
                },
                {
                    "id": 2185,
                    "brand_product_code": "TitaniRMbHZ1ZrPgOgtPj",
                    "brand_name": "Titan",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "2",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593583662478_mp92eskc2ykfim.png",
                    "denomination_list": "500",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": "Pantaloons is India?s preferred clothing retail brand. The brand offers a multitude of options across the casual, ethnic, party, and sports segments. You can bring the entire family along. Because Pantaloons has something for everyone. Pantaloons gift cards and gift vouchers give a cashless shopping experience",
                    "tnc": "1.The holder of the voucher is deemed to be the beneficiary.<br/>2.Beneficiary should announce the intent of using the voucher before making a purchase.<br/>3.Only valid vouchers at the sole discretion of TITAN shall be accepted for redemption.<br/>4.A Maximum of 5 Gift vouchers can be clubbed for a single purchase.<br/>5.Partial redemption is not allowed, single time usage only.<br/>6.No refund or credit note would be issued against unused or partially used voucher.<br/>7.Not valid for in-store offers.<br/>8.Not valid on Zoop & Nebula.<br/>9.This Instant Gift Voucher can be redeemed at listed Titan stores across India.<br/>10.Voucher cannot be revalidated once expired.<br/>11.TITAN/ affiliates are not responsible on account of the beneficiary sharing the voucher number and the voucher getting redeemed on that account.<br/>12.The Brand may ask for a valid Government identity proof at the time of redeeming the voucher.<br/>13.Vouchers will be accepted across all outlets mentioned, but TITAN at its sole discretion may add or remove an outlet from the list without giving any prior notice.<br/>14.TITAN makes full efforts to accept voucher, but on account of any technical / administrative reasons an outlet may refuse to accept a voucher.<br/>15.This voucher cannot be redeemed on specific block out dates TITAN may add or delete any date on its sole discretion.<br/>16.TITAN or any of its partners would not be liable for any form of compensation etc on account of an outlet not being able to accept the voucher. The customer would be liable to settle the Invoice.<br/>17.If a voucher gets blocked on account of technical issue the voucher would be usable only post 72 hours.<br/>18.Please Contact Shop manager for any acceptance issue and if issue is still not resolved you can write in to bit.ly/2CsY6BX / 18001033314 for immediate help.<br/>19.Any dispute should be referred to the company from where the voucher has been received; decision of the TITAN shall be final.",
                    "important_instruction": "",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 500
                        }
                    ]
                },
                {
                    "id": 2186,
                    "brand_product_code": "VeromodaqYlt5uBccuj1jy5e",
                    "brand_name": "Veromoda",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": "2",
                    "online_redemption_url": "",
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593636116976_mp930gkc3tspo0.png",
                    "denomination_list": "7500",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": "Pantaloons is India?s preferred clothing retail brand. The brand offers a multitude of options across the casual, ethnic, party, and sports segments. You can bring the entire family along. Because Pantaloons has something for everyone. Pantaloons gift cards and gift vouchers give a cashless shopping experience",
                    "tnc": "1.The holder of the Instant Gift Voucher number  is deemed to be the beneficiary <br/>2.Beneficiary should announce the intent of using the Instant Gift Voucher before making a purchase<br/>3.Only valid Instant Gift Vouchers at the sole discretion of Vero Moda shall be accepted for redemption<br/>4.This Instant Gift Voucher can be redeemed at listed 86 plus Vero Moda premium stores across India. <br/>5.Multiple Instant Gift Vouchers can be used against one bill <br/>6.Partial redemption is allowed but no refund or credit note would be issued against an unused or partially used Instant Gift Voucher<br/>7.Instant Gift Voucher cannot be revalidated once expired <br/>8.Vero Moda affiliates are not responsible on account of the beneficiary sharing the Instant Gift Voucher and the  Voucher getting redeemed on that account <br/>9.Any dispute should be referred to the issuing company and the decision of the issuing company shall be final<br/>10.The Instant Gift Voucher has been issued subject to terms of the company<br/>11.Vero Moda Store Staff may ask for a valid Government identity proof at the time of redeeming the Instant Gift Voucher<br/>12.Vouchers will be accepted across all outlets mentioned,  but Vero Moda at its sole discretion may add or remove an outlet from the list without giving any prior notice <br/>13. Vero Moda make full efforts to accept all Instant Gift Vouchers but on account of technical / administrative reasons, an outlet may refuse to accept vouchers<br/>14.If an Instant Gift Voucher gets blocked on account of technical issue, it would get activated in 72 hours<br/>15.Any dispute should be referred to the company from where the Instant Gift Voucher has been received, decision of the company shall be final <br/>16.Please contact Shop Manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help",
                    "important_instruction": "",
                    "redeem_steps": "",
                    "value": [
                        {
                            "value": 0,
                            "denomination": 7500
                        }
                    ]
                },
                {
                    "id": 2187,
                    "brand_product_code": "WestsidemFqa2lBrMlsl87jO",
                    "brand_name": "Westside",
                    "brand_type": "VOUCHER",
                    "status": "1",
                    "created_at": "2024-04-12T07:18:00.024Z",
                    "redemption_type": null,
                    "online_redemption_url": null,
                    "brand_image": "https://cdn.gyftr.com/comm_engine/prod/images/brands/1593583810685_mp92eskc2ynlvh.png",
                    "denomination_list": "1000",
                    "stock_available": true,
                    "category": "Apparels & Accessories,Gifting",
                    "descriptions": null,
                    "tnc": "1.Accepted in all Westside stores in India. <br/>2.Period of Validity:6 months from date of issue. <br/>3.Valid on all merchandise. <br/>4.The E-Gift cards are Non-reloadable <br/>5.This E-Gift card needs to be used in full. In case the value of the merchandise exceeds the value of eGC,the difference shall be paid by the bearer. <br/>7.No refunds / credit note shall be issued for unused part of the E-Gift card. <br/>8.Redeemable during End of Season Sales, Promotions & Offers. <br/>9.Accepted at Gourmet West(Food Section) <br/>10.This E-Gift card cannot be exchanged for Cash/Gift Cards/Credit Notes <br/>11.Protect the E-Gift card number and PIN to avoid misuse. Trent shall not assume any liability in case the <br/>12.eGC PIN gets stolen/compromised, Trent shall neither replace the eGC nor refund cash. <br/>13.Only valid E-gift cards would be accepted. <br/>14.Any disputes/s shall be subject to the jurisdiction of the courts in Mumbai <br/>15.Trent Limited reserves the right to amend the Terms & Conditions at its discretion without prior notice. <br/>16.This card is the property of TRENT LIMITED<br/>17. Please contact Westside Shop manager for any acceptance issue and if issue is still not resolved, you can write in to bit.ly/2CsY6BX or call 18001033314 for immediate help",
                    "important_instruction": null,
                    "redeem_steps": null,
                    "value": [
                        {
                            "value": 0,
                            "denomination": 1000
                        }
                    ]
                }
            ]
               }
              style={{ width: "100%" }}
              contentContainerStyle={{ width: "100%" }}
              renderItem={({ item, index }) => {
                return (
                  <RewardsBox
                    handleOperation={addItemToCart}
                    data={item}
                    key={index}
                    product={item.brand_name}
                    category={item.category}
                    points={item.value}
                    image={item.brand_image}
                  ></RewardsBox>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (cart.length !== 0) {
              navigation.navigate("CouponCartList", { cart: cart });
            } else setError(true), setMessage("Cart cannot be empty");
          }}
          style={{
            alignItems: "center",
            borderRadius: 10,
            justifyContent: "center",
            height: 50,
            width: "60%",
            backgroundColor: ternaryThemeColor,
            position: "absolute",
            bottom: 20,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 16, fontWeight: "700" }}
            content={t("continue")}
          ></PoppinsTextMedium>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RedeemCoupons;
