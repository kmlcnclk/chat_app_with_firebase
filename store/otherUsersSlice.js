import { createSlice } from '@reduxjs/toolkit';

export const otherUsersSlice = createSlice({
  name: 'otherUsers',
  initialState: {
    value: {},
  },
  reducers: {
    changeOtherUsers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeOtherUsers } = otherUsersSlice.actions;

export default otherUsersSlice.reducer;
