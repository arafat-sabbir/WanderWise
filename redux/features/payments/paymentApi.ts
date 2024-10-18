import { baseApi } from "@/redux/api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    createNewPayment: builder.mutation({
      query: (token) => ({
        url: `/payments/create-payment`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getAllPayment: builder.query({
      query: (token: string) => {
        return {
          url: `/payments/all`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const { useCreateNewPaymentMutation, useGetAllPaymentQuery } =
  paymentApi;
