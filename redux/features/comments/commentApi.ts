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
    updateComment: builder.mutation({
      query: ({ token, id, comment }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: { comment },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteComment: builder.mutation({
      query: ({ token, id }) => ({
        url: `/comments/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    })
  }),
});

export const { useCreateNewCommentMutation,useUpdateCommentMutation,useDeleteCommentMutation } = commentApi;
