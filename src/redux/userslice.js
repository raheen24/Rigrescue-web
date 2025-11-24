
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  isLogin: false,
  fcmToken: "",
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || "";
      state.role = action.payload.user?.role || null;
      state.isLogin = true;
    },

    setUser: (state, action) => {
      state.user = action.payload || null;
      state.role = action.payload?.role || null;
      state.isLogin = !!action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload || "";
    },

    setLogout: (state) => {
      state.user = null;
      state.isLogin = false;
      state.token = "";
      state.fcmToken = "";
      state.role = null;
    },

    setDeleteAccount: (state) => {
      state.user = null;
      state.isLogin = false;
      state.token = "";
      state.fcmToken = "";
      state.role = null;
    },

    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },

    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const {
  setLogin,
  setUser,
  setToken,
  setLogout,
  setFcmToken,
  setDeleteAccount,
  setRole,
} = userSlice.actions;

export default userSlice.reducer;
