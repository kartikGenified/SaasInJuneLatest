import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  productData:{},
  productMrp:null
}

export const productDataSlice = createSlice({
  name: 'productData',
  initialState,
  reducers: {
    
    
    setProductData: (state, action) => {
        state.productData = action.payload
      },
    setProductMrp: (state, action) => {
        state.productMrp = action.payload
      }
  },
})

// Action creators are generated for each case reducer function
export const { setProductData,setProductMrp} = productDataSlice.actions

export default productDataSlice.reducer