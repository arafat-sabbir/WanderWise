import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    updateUser: builder.mutation({
      query: ({ token, userData }) => ({
        url: `/users/me`,
        method: "PUT",
        body: userData,
        headers: {
          Authorization: `Bearer ${token}`, // Ensure this header is sent
        },
      }),
    }),

    getUser: builder.query({
      query: (token) => ({
        url: `/users/me`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    followOrUnFollowUser: builder.mutation({
      query: ({ token, userId, status }) => ({
        url: `/users/follow-unfollow/${userId}`,
        method: "PUT",
        body: { status },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getAllUser: builder.query({
      query: (token) => ({
        url: `/users/all`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetUserQuery,
  useFollowOrUnFollowUserMutation,
  useGetAllUserQuery,
} = userApi;
