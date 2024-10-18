import { baseApi } from "@/redux/api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    createNewPost: builder.mutation({
      query: ({ token, postData }) => ({
        url: "/posts",
        method: "POST",
        body: postData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // get all post
    getAllPosts: builder.query({
      query: ({
        page = 1,
        limit = 5,
        searchTerm,
      }: {
        page: number;
        limit: number;
        searchTerm?: string;
      }) => {
        return {
          url: `/posts?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
          method: "GET",
        };
      },
    }),
    getAllPostsForUser: builder.query({
      query: ({
        token,
        page = 1,
        limit = 5,
        searchTerm,
      }: {
        token: string|null;
        page: number;
        limit: number;
        searchTerm?: string;
      }) => {
        return {
          url: `/posts/get-post/me?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    getSinglePost: builder.query({
      query: (postId) => {
        return {
          url: `/posts/${postId}`,
          method: "GET",
        };
      },
    }),
    votePost: builder.mutation({
      query: ({ token, postId, status }) => ({
        url: `/posts/vote/${postId}`,
        method: "PATCH",
        body: { status },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
    })
  }),
});

export const {
  useCreateNewPostMutation,
  useVotePostMutation,
  useGetAllPostsQuery,
  useGetSinglePostQuery,
  useGetAllPostsForUserQuery,
  useDeletePostMutation
} = postApi;
