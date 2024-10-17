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
  }),
});

export const { useCreateNewPaymentMutation } = paymentApi;
