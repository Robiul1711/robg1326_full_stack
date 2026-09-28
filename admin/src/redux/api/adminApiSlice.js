import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
  tagTypes: ["Stats", "User", "Order", "CMS", "Profile"],
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
      providesTags: ["Profile"],
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwords,
      }),
    }),

    // Dashboard Stats
    getStats: builder.query({
      query: () => "/auth/admin/stats",
      providesTags: ["Stats"],
    }),

    // Users Management
    getUsers: builder.query({
      query: (params) => ({
        url: "/auth/admin/users",
        params,
      }),
      providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/auth/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User", "Stats"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Stats"],
    }),

    // Orders / Subscriptions Management
    getOrders: builder.query({
      query: () => "/subscription/admin/orders",
      providesTags: ["Order"],
    }),

    // Dynamic CMS Content Management
    getCmsContent: builder.query({
      query: () => "/cms/content",
      providesTags: ["CMS"],
    }),
    updateCmsContent: builder.mutation({
      query: (content) => ({
        url: "/cms/content",
        method: "PUT",
        body: content,
      }),
      invalidatesTags: ["CMS"],
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useGetStatsQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetOrdersQuery,
  useGetCmsContentQuery,
  useUpdateCmsContentMutation,
} = adminApiSlice;
