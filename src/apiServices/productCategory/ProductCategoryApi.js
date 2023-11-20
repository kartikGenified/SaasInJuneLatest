import { baseApi } from '../baseApi';
import {slug} from '../../utils/Slug';

export const ProductCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProductSubCategoryById: builder.mutation({
            query: (params) => {
                console.log("getProductSubCategoryById",params)
              return {
                method: "GET",
                url: `/api/app/product/${params.subCategoryId}?limit=10&offset=0`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                
              };
            },
          }),
          getProductCategory: builder.mutation({
            query: (token) => {
              return {
                method: "GET",
                url: `/api/app/subcategory`,
                headers: {
                  Authorization: "Bearer " + token,
                  slug: slug,
                },
                
              };
            },
          }),
          
        }),
        
   });
   
   export const {useGetProductCategoryMutation,useGetProductSubCategoryByIdMutation} = ProductCategoryApi;