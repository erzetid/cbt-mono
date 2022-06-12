import { createSlice } from '@reduxjs/toolkit';
import {
  getUjian,
  lihatJawaban,
  mulaiUjian,
  pertanyaan,
  preTest,
  selesaiUjian
} from './ujianThunk';

const initialState = {
  nama: '',
  dataUjian: [],
  dataPreTest: {
    ujian: '',
    nama: '',
    kelas: '',
    durasi: 0,
    jadwal: new Date(),
    soal: '',
    jumlah: 0
  },
  idScore: '',
  message: '',
  dataJawaban: null,
  soal: {
    soal: '',
    pilihan: [],
    _id: ''
  },
  isSelesai: false
};

export const ujianSlice = createSlice({
  name: 'ujian',
  initialState,
  reducers: {
    setSelesai: (state, action) => {
      state.isSelesai = action.payload;
    }
  },
  extraReducers: {
    [getUjian.fulfilled]: (state, action) => {
      const { data, nama } = action.payload;
      state.dataUjian = data;
      state.nama = nama;
      state.message = '';
    },
    [getUjian.rejected]: (state, action) => {
      state.dataUjian = [];
    },
    [preTest.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.dataPreTest = data;
      state.message = '';
    },
    [preTest.rejected]: (state, action) => {
      state.message = 'Data ujian tidak ditemukan';
      state.dataPreTest = initialState.dataPreTest;
    },
    [mulaiUjian.fulfilled]: (state, action) => {
      state.message = '';
      state.idScore = action.payload.data.idScore;
    },
    [mulaiUjian.rejected]: (state, action) => {
      const { message } = action.payload;
      state.message = message;
    },
    [lihatJawaban.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.dataJawaban = data;
      state.message = '';
    },
    [lihatJawaban.rejected]: (state, action) => {
      state.dataJawaban = initialState.dataJawaban;
    },
    [pertanyaan.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.soal = data;
      state.message = '';
    },
    [pertanyaan.rejected]: (state, action) => {
      state.soal = initialState.soal;
    },
    [selesaiUjian.fulfilled]: (state, action) => {
      state.isSelesai = true;
    }
  }
});

export const { setSelesai } = ujianSlice.actions;
export default ujianSlice.reducer;
