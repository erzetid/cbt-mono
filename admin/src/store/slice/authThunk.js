import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const login = createAsyncThunk("/auth", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth", payload);
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

export const refreshToken = createAsyncThunk("/auth/token", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/token");
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

export const signOut = createAsyncThunk("auth/signOut", async () => {
  try {
    const response = await api.delete("/auth/");
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
