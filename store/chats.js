import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chats',
  initialState: {
    value: [],
  },
  reducers: {
    changeChats: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeChats } = chatSlice.actions;

export default chatSlice.reducer;
