import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const getKelas = createAsyncThunk("/kelas", async (_, { getState, rejectWithValue }) => {
  try {
    const states = getState();
    const response = await api.get("/kelas", {
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

export const postKelas = createAsyncThunk(
  "/kelas",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post("/kelas", payload, {
        headers: {
          Authorization: "Bearer " + states.auth.token, //the token is a variable which holds the token
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
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

export const putKelas = createAsyncThunk(
  "/kelas",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.put("/kelas", payload, {
        headers: {
          Authorization: "Bearer " + states.auth.token, //the token is a variable which holds the token
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
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
