import { createSlice } from '@reduxjs/toolkit';

export const tootSlice = createSlice({
  name: 'allToots',
  initialState: {
    value: [],
    newest: [],
    oldest: [],
    loading: false,
    emojis: [],
  },
  reducers: {
    addToots: (state, action) => {
      state.value = [
        ...new Map(
          state.value
            .concat(action.payload)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((t) => [t[`id`], t])
        ).values(),
      ];
    },
    updateNewest: (state, action) => {
      state.newest = { ...state.newest, ...action.payload };
    },
    updateOldest: (state, action) => {
      state.oldest.push(action.payload);
    },
    cleanOldest: (state, action) => {
      state.oldest = state.oldest.filter((e) => e !== action.payload);
    },
    seeToot: (state, action) => {
      state.seenToots.push(action.payload);
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    addEmoji: (state, action) => {
      state.emojis = action.payload;
    },
  },
});
export const { addToots, updateNewest, updateOldest, seeToot, cleanOldest, startLoading, stopLoading, addEmoji } =
  tootSlice.actions;
export default tootSlice.reducer;
