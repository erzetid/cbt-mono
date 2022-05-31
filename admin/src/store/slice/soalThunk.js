import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const getSoal = createAsyncThunk("/soal", async (_, { getState, rejectWithValue }) => {
  try {
    const states = getState();
    const response = await api.get("/soal", {
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
export const postSoal = createAsyncThunk(
  "/soal",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post("/soal", payload, {
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
export const getSoalById = createAsyncThunk("/soal", async (id, { getState, rejectWithValue }) => {
  try {
    const states = getState();
    const response = await api.get(`/soal/${id}`, {
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
export const deleteSoalById = createAsyncThunk(
  "/soal",
  async (id, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.delete(`/soal/${id}`, {
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
export const getPerSoalById = createAsyncThunk(
  "/soal/per_soal",
  async (id, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.get(`/soal/per_soal/${id}`, {
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
export const editPertanyaan = createAsyncThunk(
  "/soal/pertanyaan",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.put(`/soal/pertanyaan`, payload, {
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
export const setJawaban = createAsyncThunk(
  "/soal/jawaban",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.put(`/soal/jawaban`, payload, {
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
