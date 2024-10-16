import { baseApi } from "@/redux/api/baseApi";


const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Register user
        register: builder.mutation({
            query: (registerInfo) => ({
                url: '/users/register',
                method: 'POST',
                body: registerInfo
            })
        }),

        // Login user
        login: builder.mutation({
            query: (loginInfo) => ({
                url: '/users/login',
                method: 'POST',
                body: loginInfo
            })
        }),
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation
} = authApi;