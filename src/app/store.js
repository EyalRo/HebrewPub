import { configureStore } from '@reduxjs/toolkit';
import tootReducer from '../features/toots/allTootSlice'

export const store = configureStore({
  reducer: {
    allToots: tootReducer,
  },
});
