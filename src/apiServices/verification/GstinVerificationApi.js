import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GstinVerificationApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        verifyGst: builder.mutation({
            query: (data) => {
              return {
                method: "POST",
                url: `/api/verification/gstin`,
                headers: {
                  "Content-Type": "application/json",
                  
                },
                body:data
              };
            },
          }),
    })
});


export const {useVerifyGstMutation} = GstinVerificationApi

