import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  qrData:{}
  
}

export const qrDataSlice = createSlice({
  name: 'qrData',
  initialState,
  reducers: {
    
    
    setQrData: (state, action) => {
        state.qrData = action.payload
      },
  },
})

// Action creators are generated for each case reducer function
export const { setQrData} = qrDataSlice.actions

export default qrDataSlice.reducer