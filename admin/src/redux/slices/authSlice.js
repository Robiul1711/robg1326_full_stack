import { createSlice } from "@reduxjs/toolkit";

const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem("adminUser");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data || parsed;
  } catch (e) {
    return null;
  }
};

const storedUser = getStoredAuth();

const initialState = {
  adminUser: storedUser,
  token: storedUser?.token || null,
  isAuthenticated: !!storedUser?.token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Unpack response whether wrapped in .data or direct
      const userData = action.payload?.data || action.payload;
      state.adminUser = userData;
      state.token = userData?.token || null;
      state.isAuthenticated = !!userData?.token;
      localStorage.setItem("adminUser", JSON.stringify(userData));
    },
    logout: (state) => {
      state.adminUser = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminUser");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
