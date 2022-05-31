import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const getSekolah = createAsyncThunk("/sekolah", async (_, { getState, rejectWithValue }) => {
  try {
    const states = getState();
    const response = await api.get("/sekolah", {
      headers: {
        Authorization: "Bearer " + states.auth.token, //the token is a variable which holds the token
      },
    });
    return response.data;
  } catch (error) {
    if (!error.response) {
      return (
        { message: error.message, status: "error" } &&
        rejectWithValue({ message: error.message, status: "error" })
      );
    }
    return rejectWithValue(error.response.data);
  }
});

export const putSekolah = createAsyncThunk(
  "/sekolah",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.put("/sekolah", payload, {
        headers: {
          Authorization: "Bearer " + states.auth.token, //the token is a variable which holds the token
        },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: "error" } &&
          rejectWithValue({ message: error.message, status: "error" })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);
