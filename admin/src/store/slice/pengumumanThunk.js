import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const getPengumuman = createAsyncThunk(
  "/pengumuman",
  async (_, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.get("/pengumuman", {
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

export const postPengumuman = createAsyncThunk(
  "/pengumuman",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post("/pengumuman", payload, {
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
export const deletePengumuman = createAsyncThunk(
  "/pengumuman",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.delete("/pengumuman/" + payload, {
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
