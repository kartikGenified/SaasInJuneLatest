// internetSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const internetSlice = createSlice({
  name: 'internet',
  initialState: {
    isConnected: true, // Assuming initially connected
  },
  reducers: {
    setInternetConnection: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setInternetConnection } = internetSlice.actions;

export default internetSlice.reducer;
