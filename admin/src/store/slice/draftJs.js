import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "<br />",
};

export const draftJsSlice = createSlice({
  name: "draftJs",
  initialState,
  reducers: {
    change: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { change } = draftJsSlice.actions;

export default draftJsSlice.reducer;
