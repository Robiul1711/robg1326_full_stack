import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    let token = getState()?.auth?.token;
    if (!token) {
      try {
        const raw = localStorage.getItem("adminUser");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.token || parsed?.data?.token;
        }
      } catch (e) {}
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const adminApiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["Stats", "User", "Product", "Order", "Setting"],
  endpoints: (builder) => ({
    // Auth
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
    }),

    // Dashboard Stats
    getStats: builder.query({
      query: () => "/stats/overview",
      providesTags: ["Stats"],
    }),

    // Users Management
    getUsers: builder.query({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["User"],
    }),

    // Products Management
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),

    // Orders Management
    getOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        params,
      }),
      providesTags: ["Order"],
    }),

    // File Upload
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useGetMeQuery,
  useGetStatsQuery,
  useGetUsersQuery,
  useGetProductsQuery,
  useGetOrdersQuery,
  useUploadImageMutation,
} = adminApiSlice;
