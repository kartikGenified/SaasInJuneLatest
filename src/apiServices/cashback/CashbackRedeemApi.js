import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const CashbackRedeemApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        redeemCashback: builder.mutation({
            query: (params) => {
              return {
                method: "POST",
                url: `/api/app/cashbackRedemptions/add`,
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


export const {useRedeemCashbackMutation} = CashbackRedeemApi

