import { createSlice } from "@reduxjs/toolkit";
import { getSiswa, postSiswa, putSiswa } from "./siswaThunk";

const initialState = {
  siswa: [],
  loading: false,
  message: null,
  status: null,
};

export const siswaSlice = createSlice({
  name: "siswa",
  initialState,
  reducers: {},
  extraReducers: {
    [getSiswa.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.siswa = data;
    },
    [getSiswa.rejected]: (state, action) => {
      state.siswa = [];
    },
    [postSiswa.fulfilled]: (state, action) => {
      const { message, status } = action.payload;
      state.loading = false;
      state.message = message;
      state.status = status;
    },
    [postSiswa.pending]: (state, action) => {
      state.loading = true;
    },
    [postSiswa.rejected]: (state, action) => {
      const { message, status } = action.payload;
      state.loading = false;
      state.message = message;
      state.status = status;
    },
    [putSiswa.fulfilled]: (state, action) => {
      const { message, status } = action.payload;
      state.loading = false;
      state.message = message;
      state.status = status;
    },
    [putSiswa.pending]: (state, action) => {
      state.loading = true;
    },
    [putSiswa.rejected]: (state, action) => {
      const { message, status } = action.payload;
      state.loading = false;
      state.message = message;
      state.status = status;
    },
  },
});

export const {} = siswaSlice.actions;
export default siswaSlice.reducer;
