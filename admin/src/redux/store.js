import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { adminApiSlice } from "./api/adminApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApiSlice.middleware),
});
