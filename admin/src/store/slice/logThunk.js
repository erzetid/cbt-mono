import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const getAktifitasLogs = createAsyncThunk(
  "/ujian/logs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.get("/ujian/logs", {
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
export const deleteLogs = createAsyncThunk(
  "/ujian/logs",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.delete("/ujian/logs/" + payload, {
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
