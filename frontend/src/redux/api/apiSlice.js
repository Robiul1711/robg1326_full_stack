import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "CMS", "Subscription"],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // CMS dynamic content
    getCmsContent: builder.query({
      query: () => "/cms/content",
      providesTags: ["CMS"],
    }),

    // Stripe Subscriptions
    createCheckout: builder.mutation({
      query: (data) => ({
        url: "/subscription/checkout",
        method: "POST",
        body: typeof data === "string" ? { plan: data } : data,
      }),
      invalidatesTags: ["Subscription", "User"],
    }),
    verifySession: builder.mutation({
      query: ({ sessionId }) => ({
        url: "/subscription/verify",
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: ["Subscription", "User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useGetCmsContentQuery,
  useCreateCheckoutMutation,
  useVerifySessionMutation,
} = apiSlice;
