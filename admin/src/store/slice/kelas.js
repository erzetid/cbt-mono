import { createSlice } from "@reduxjs/toolkit";
import { getKelas, postKelas } from "./kelasThunk";

const initialState = {
  kelas: [],
  loading: false,
  message: null,
  status: null,
};

export const kelasSlice = createSlice({
  initialState,
  name: "kelas",
  reducers: {},
  extraReducers: {
    [getKelas.fulfilled]: (state, action) => {
      const { data } = action.payload;
      console.log(data);
      state.kelas = data;
    },
    [getKelas.rejected]: (state, action) => {
      state.kelas = [];
    },
    [postKelas.fulfilled]: (state, action) => {
      const { message, status } = action.payload;
      state.loading = false;
      state.message = message;
      state.status = status;
    },
    [postKelas.rejected]: (state, action) => {
      const { message, status } = action.payload;
      state.loading = false;
      state.message = message;
      state.status = status;
    },
  },
});

export const {} = kelasSlice.actions;
export default kelasSlice.reducer;
