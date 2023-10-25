import { configureStore } from '@reduxjs/toolkit'
import appUserSlice from './slices/appUserSlice'
import appThemeSlice from './slices/appThemeSlice'
import appUserDataSlice from './slices/appUserDataSlice'
import appWorkflowSlice from './slices/appWorkflowSlice'
import formSlice from './slices/formSlice'
import qrCodeDataSlice from './slices/qrCodeDataSlice'
import getProductSlice from './slices/getProductSlice'
import { baseApi } from '../src/apiServices/baseApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import userLocationSlice from './slices/userLocationSlice'
import rewardCartSlice from './slices/rewardCartSlice'
import userKycStatusSlice from './slices/userKycStatusSlice'
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    appusers:appUserSlice,
    apptheme:appThemeSlice,
    appusersdata:appUserDataSlice,
    appWorkflow:appWorkflowSlice,
    form:formSlice,
    qrData: qrCodeDataSlice,
    productData:getProductSlice,
    userLocation:userLocationSlice,
    cart:rewardCartSlice,
    kycDataSlice:userKycStatusSlice

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})
setupListeners(store.dispatch)