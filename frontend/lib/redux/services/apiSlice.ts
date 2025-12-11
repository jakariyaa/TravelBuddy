import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
        return headers;
    },
});

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let adjustedArgs = args;
    if (typeof args === 'string') {
        adjustedArgs = { url: args, credentials: 'include' };
    } else {
        // We cast to FetchArgs to modify it safely, assuming args matches FetchArgs structure if object
        adjustedArgs = { ...args as FetchArgs, credentials: 'include' };
    }

    const result = await baseQuery(adjustedArgs, api, extraOptions);

    if (result.error) {
        let errorMessage = "An error occurred";

        if (result.error.status === 'FETCH_ERROR') {
            errorMessage = "Network error. Please check your connection.";
        } else if (result.error.data && typeof result.error.data === 'object' && 'message' in result.error.data) {
            errorMessage = (result.error.data as { message: string }).message;
        } else if (typeof result.error.data === 'string') {
            errorMessage = result.error.data;
        }

        toast.error(errorMessage);
    }

    return result;
};

// Basic User Type - expand as needed
export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    tagTypes: ['User', 'TravelPlan', 'Review', 'JoinRequest'],
    endpoints: (builder) => ({
        getProfile: builder.query<User, void>({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
    }),
});

export const { useGetProfileQuery } = apiSlice;
