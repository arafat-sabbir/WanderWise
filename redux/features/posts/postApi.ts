import { baseApi } from "@/redux/api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    createNewPost: builder.mutation({
      query: ({token, postData}) => ({
        url: "/posts",
        method: "POST",
        body: postData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useCreateNewPostMutation } = postApi;
