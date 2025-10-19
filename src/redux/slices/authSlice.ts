import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const savedAuth = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: savedAuth,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
