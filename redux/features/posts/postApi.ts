import { baseApi } from "@/redux/api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      query: ({
        searchTerm = "",
        category = "",
        isPremium = "all",
        page = 1,
        limit = 5,
      }) => {
        const queryString = `/posts?&page=${page}&limit=${limit}`;
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),

    // Login user
    login: builder.mutation({
      query: (loginInfo) => ({
        url: "/users/login",
        method: "POST",
        body: loginInfo,
      }),
    }),
  }),
});

export const { useLoginMutation, useGetAllPostsQuery } = postApi;
