import { createSlice } from "@reduxjs/toolkit";
import { login, signOut, refreshToken } from "./authThunk";

const initialState = {
  token: null,
  loading: false,
  message: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [signOut.fulfilled]: (state, action) => {
      const { message } = action.payload;
      state.message = message;
      state.loading = false;
      state.token = null;
    },
    [login.pending]: (state, action) => {
      state.loading = true;
      state.message = null;
    },
    [login.fulfilled]: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      state.loading = false;
      state.message = null;
    },
    [login.rejected]: (state, action) => {
      const { message } = action.payload;
      state.message = message;
      state.loading = false;
    },
    [refreshToken.fulfilled]: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      state.message = null;
    },
    [refreshToken.rejected]: (state, action) => {
      const { message, token } = action.payload;
      state.token = token;
      state.message = message;
    },
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
