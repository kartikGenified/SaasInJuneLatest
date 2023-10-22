import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const AadharVerificationApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        sendAadharOtp: builder.mutation({
            query: (data) => {
              return {
                method: "POST",
                url: `/api/verification/aadhaar/otp`,
                headers: {
                  "Content-Type": "application/json",
                  
                },
                body:data
              };
            },
          }),
          verifyAadhar: builder.mutation({
            query: (data) => {
              return {
                method: "POST",
                url: `/api/verification/aadhaar/verify`,
                headers: {
                  "Content-Type": "application/json",
                  
                },
                body:data
              };
            },
          }),
    })
});


export const {useSendAadharOtpMutation,useVerifyAadharMutation} = AadharVerificationApi

