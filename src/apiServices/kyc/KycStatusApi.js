import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const KycStatusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getkycStatus: builder.mutation({
    query: (token) => {
    return {
    method: "GET",
    url: `/api/app/kyc`,
    headers: {
    Authorization: "Bearer " + token,
    slug: slug,
    },
    };
    },
    }),
    }),
   });
   
   export const { useGetkycStatusMutation} = KycStatusApi;