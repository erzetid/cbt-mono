import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const getSiswa = createAsyncThunk("/siswa", async (_, { getState, rejectWithValue }) => {
  try {
    const states = getState();
    const response = await api.get("/siswa", {
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

export const postSiswa = createAsyncThunk(
  "/siswa",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post("/siswa", payload, {
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

export const putSiswa = createAsyncThunk(
  "/siswa",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.put("/siswa", payload, {
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

export const deleteSiswa = createAsyncThunk(
  "/siswa",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.delete("/siswa/" + payload, {
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
