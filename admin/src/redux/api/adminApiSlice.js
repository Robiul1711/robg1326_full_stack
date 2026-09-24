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
  tagTypes: ["Category", "Model", "Service", "Product", "CMS", "Contact", "Stats"],
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

    // Categories
    getCategories: builder.query({
      query: () => "/categories/admin",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category", "Stats"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Stats"],
    }),

    // Device Models
    getModels: builder.query({
      query: (params) => ({
        url: "/models/admin",
        params,
      }),
      providesTags: ["Model"],
    }),
    createModel: builder.mutation({
      query: (data) => ({
        url: "/models",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Model", "Category", "Stats"],
    }),
    updateModel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/models/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Model", "Category"],
    }),
    deleteModel: builder.mutation({
      query: (id) => ({
        url: `/models/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Model", "Category", "Stats"],
    }),

    // Repair Services
    getServices: builder.query({
      query: (params) => ({
        url: "/services",
        params,
      }),
      providesTags: ["Service"],
    }),
    createService: builder.mutation({
      query: (data) => ({
        url: "/services",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service", "Model", "Stats"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Service", "Model"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service", "Model", "Stats"],
    }),

    // Marketplace Products
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product", "Stats"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product", "Stats"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "Stats"],
    }),

    // CMS & Policies
    getAllCMS: builder.query({
      query: () => "/cms",
      providesTags: ["CMS"],
    }),
    getCMSByKey: builder.query({
      query: (key) => `/cms/${key}`,
      providesTags: (result, error, key) => [{ type: "CMS", id: key }],
    }),
    updateCMSByKey: builder.mutation({
      query: ({ key, data }) => ({
        url: `/cms/${key}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: (result, error, { key }) => ["CMS", { type: "CMS", id: key }],
    }),

    // Contact Leads
    getContacts: builder.query({
      query: (params) => ({
        url: "/contact",
        params,
      }),
      providesTags: ["Contact"],
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/contact/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Contact", "Stats"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact", "Stats"],
    }),

    // File Upload
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
    uploadMultipleImages: builder.mutation({
      query: (formData) => ({
        url: "/upload/multiple",
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
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetModelsQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllCMSQuery,
  useGetCMSByKeyQuery,
  useUpdateCMSByKeyMutation,
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  useUploadImageMutation,
  useUploadMultipleImagesMutation,
} = adminApiSlice;
