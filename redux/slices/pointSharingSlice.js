import { createSlice } from '@reduxjs/toolkit'

const initialState={
pointSharing:{}
}

export const pointSharingSlice = createSlice({
    name:'pointSharing',
    initialState,
    reducers : {
        setPointSharing : (state, action)=>{
            state.pointSharing = action.payload
        }
    }
})


export const {setPointSharing} = pointSharingSlice.actions

export default pointSharingSlice.reducer