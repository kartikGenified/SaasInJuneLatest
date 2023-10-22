import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const VideoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getAppVideo: builder.mutation({
    query: (token) => {
    return {
    method: "GET",
    url: `/api/tenant/appVideo`,
    headers: {
    Authorization: "Bearer " + token,
    slug: slug,
    },
    };
    },
    }),
    }),
   });
   
   export const { useGetAppVideoMutation} = VideoApi;

