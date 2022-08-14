import { createSlice } from '@reduxjs/toolkit';

export const otherUserSlice = createSlice({
  name: 'otherUser',
  initialState: {
    value: {},
  },
  reducers: {
    changeOtherUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeOtherUser } = otherUserSlice.actions;

export default otherUserSlice.reducer;
