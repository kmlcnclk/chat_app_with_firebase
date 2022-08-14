import { configureStore } from '@reduxjs/toolkit';
import otherUserReducer from './otherUserSlice';
import chatsReducer from './chats';
import otherUsersReducer from './otherUsersSlice';

export default configureStore({
  reducer: {
    otherUser: otherUserReducer,
    chats: chatsReducer,
    otherUsers: otherUsersReducer,
  },
});
