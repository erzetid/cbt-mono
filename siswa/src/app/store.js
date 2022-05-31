import { configureStore } from '@reduxjs/toolkit';
import auth from './slice/auth';
import ujian from './slice/ujian';

export const store = configureStore({
  reducer: { auth, ujian }
});
