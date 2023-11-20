import React, { useEffect,useState } from 'react';
import {View, StyleSheet,TouchableOpacity,Image, ScrollView,FlatList} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useGetProductCategoryMutation,useGetProductSubCategoryByIdMutation } from '../../apiServices/productCategory/ProductCategoryApi';
import * as Keychain from 'react-native-keychain';
import ProductCategoryDropDown from '../../components/atoms/dropdown/ProductCategoryDropDown';

const ProductCategory = ({navigation}) => {
    const [productCategory, setProductCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [token, setToken] = useState()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const [getProductCategoryFunc,{
        data:getProductCategoryData,
        error:getProductCategoryError,
        isLoading:getProductCategoryIsLoading,
        isError:getProductCategoryIsError
    }] = useGetProductCategoryMutation()


    const [getProductSubCategoryByIdFunc,{
        data:getProductSubCategoryByIdData,
        error:getProductSubCategoryByIdError,
        isLoading:getProductSubCategoryByIdIsLoading,
        isError:getProductSubCategoryByIdIsError
    }] = useGetProductSubCategoryByIdMutation()

    useEffect(()=>{
        getToken()
    },[])

    const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    setToken(token)
    getProductCategoryFunc(token)
    }
}
   useEffect(()=>{
    if(getProductCategoryData){
        console.log("getProductCategoryData",getProductCategoryData)
        if(getProductCategoryData.success)
        {
            const productNameArray = getProductCategoryData.body.map((item,index)=>{
            return {
                name:item.name,
                id:item.id
            }
            })
            const set = new Set(productNameArray)
            console.log(set)

            setProductCategory(Array.from(set))
        }
    }
    else if(getProductCategoryError){
        console.log("getProductCategoryError",getProductCategoryError)
    }
   },[getProductCategoryData,getProductCategoryError])

   useEffect(()=>{
    if(getProductSubCategoryByIdData){
        console.log("getProductSubCategoryByIdData",getProductSubCategoryByIdData)
        setSubCategory(getProductSubCategoryByIdData.body.data)
    }
    else if(getProductSubCategoryByIdError){
        console.log("getProductSubCategoryByIdError",getProductSubCategoryByIdError)
    }
   },[getProductSubCategoryByIdData,getProductSubCategoryByIdError])


   const getProduct=(data,id)=>{

    console.log(data,id)
    const params = {
        token:token,
        subCategoryId:String(id)
    }

    getProductSubCategoryByIdFunc(params)
   }

   const DisplaySubCategoryDetails=(props)=>{
    const name = props.name
    const category = props.category
    const mrp = props.mrp
    const productCode = props.productCode
    const index = props.index
    return(
        <View style={{alignItems:"center",justifyContent:"center",padding:4,marginLeft:10,borderWidth:1,borderColor:'#DDDDDD',borderRadius:4,flexDirection:'row',width:'100%',marginTop:10}}>
            <View style={{width:'10%',alignItems:"flex-start",justifyContent:'center'}}>
                <View style={{height:30,width:30,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:'#DDDDDD',borderRadius:15}}>
                    <PoppinsTextMedium content={index} style={{colo:'black'}}></PoppinsTextMedium>
                </View>
            </View>
            <View style={{width:'80%',alignItems:"flex-start",justifyContent:"center"}}>
            <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Product Name : ${name}`}></PoppinsTextMedium>
            <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Category Name : ${category}`}></PoppinsTextMedium>
            <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Mrp : ₹${mrp}`}></PoppinsTextMedium>
            <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Product Code: ${productCode}`}></PoppinsTextMedium>
            </View>

        </View>
    )
   }

    return (
        <View style={{alignItems:"center",justifyContent:'flex-start',height:'100%',width:'100%',backgroundColor:ternaryThemeColor,flex:1}}>
        <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: '10%',
          marginLeft: 20,
        }}>
        <TouchableOpacity
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
        <PoppinsTextMedium
          content="Category Wise Product Info"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>       

      <View style={{height:'90%',width:'100%',alignItems:"center",justifyContent:'flex-start',backgroundColor:"white",paddingTop:30}}>
        <View style={{width:"100%",alignItems:"flex-start",justifyContent:'center'}}>
        <PoppinsTextMedium style={{color:'black',marginLeft:30,fontSize:16,fontWeight:'700'}}  content="Please Select The Product"></PoppinsTextMedium>
        </View>
      {productCategory && <ProductCategoryDropDown header="Select Product" data={productCategory} handleData={getProduct}></ProductCategoryDropDown>}
        
        {subCategory && <FlatList
        
        style={{width:'100%',marginBottom:20}}
        contentContainerStyle={{alignItems:"center",justifyContent:'center'}}
        data={subCategory}
        renderItem={({item,index}) => <DisplaySubCategoryDetails index ={index+1} name={item.name} category = {item.category_name} mrp ={item.mrp} productCode={item.product_code} />}
        keyExtractor={(item,index) => index}
      />}
       
        </View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default ProductCategory;
