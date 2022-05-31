import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const getUjian = createAsyncThunk(
  '/ujian/siswa',
  async (_, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.get(`/ujian/siswa`, {
        headers: {
          Authorization: 'Bearer ' + states.auth.token //the token is a variable which holds the token
        }
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: 'error' } &&
          rejectWithValue({ message: error.message, status: 'error' })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const preTest = createAsyncThunk(
  '/ujian/pre_test',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.get(`/ujian/pre_test/${payload}`, {
        headers: {
          Authorization: 'Bearer ' + states.auth.token //the token is a variable which holds the token
        }
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: 'error' } &&
          rejectWithValue({ message: error.message, status: 'error' })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const mulaiUjian = createAsyncThunk(
  '/ujian/mulai',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post(`/ujian/mulai`, payload, {
        headers: {
          Authorization: 'Bearer ' + states.auth.token //the token is a variable which holds the token
        }
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: 'error' } &&
          rejectWithValue({ message: error.message, status: 'error' })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const lihatJawaban = createAsyncThunk(
  '/ujian/lihat_jawaban',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post(
        `/ujian/lihat_jawaban/` + payload,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + states.auth.token //the token is a variable which holds the token
          }
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: 'error' } &&
          rejectWithValue({ message: error.message, status: 'error' })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const pertanyaan = createAsyncThunk(
  '/ujian/pertanyaan',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post(`/ujian/pertanyaan`, payload, {
        headers: {
          Authorization: 'Bearer ' + states.auth.token //the token is a variable which holds the token
        }
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: 'error' } &&
          rejectWithValue({ message: error.message, status: 'error' })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateJawaban = createAsyncThunk(
  '/ujian/update_jawaban',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.put(`/ujian/update_jawaban`, payload, {
        headers: {
          Authorization: 'Bearer ' + states.auth.token //the token is a variable which holds the token
        }
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: 'error' } &&
          rejectWithValue({ message: error.message, status: 'error' })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const selesaiUjian = createAsyncThunk(
  '/ujian/selesai',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const states = getState();
      const response = await api.post(
        `/ujian/selesai/${payload}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + states.auth.token //the token is a variable which holds the token
          }
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        return (
          { message: error.message, status: 'error' } &&
          rejectWithValue({ message: error.message, status: 'error' })
        );
      }
      return rejectWithValue(error.response.data);
    }
  }
);
