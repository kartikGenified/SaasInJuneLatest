import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const RedeemGiftsApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        redeemGifts: builder.mutation({
            query: (params) => {
              console.log("params",params)
              return {
                method: "POST",
                url: `/api/app/giftRedemptions/add`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                  "Authorization": `Bearer ${params.token}`,
                },
                body:params.data
              };
            },
          }),
    })
});


export const {useRedeemGiftsMutation} = RedeemGiftsApi

