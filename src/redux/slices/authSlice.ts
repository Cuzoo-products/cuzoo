import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const savedAuth = JSON.parse(localStorage.getItem("authState") as string) || {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: savedAuth,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("authState", JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authState");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
