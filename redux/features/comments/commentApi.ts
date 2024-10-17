import { baseApi } from "@/redux/api/baseApi";

const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    createNewComment: builder.mutation({
      query: ({ token, postId, comment }) => ({
        url: `/comments/${postId}`,
        method: "POST",
        body: { comment:comment },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useCreateNewCommentMutation } = commentApi;
