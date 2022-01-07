import { configureStore } from "@reduxjs/toolkit";
import {setAlertReducer, setPostSetChangedReducer, setPostsReducer, setUserInfoReducer} from ".";

export const store = configureStore({
  reducer: {
    setPosts: setPostsReducer,
    setAlert: setAlertReducer,
    setUserInfo: setUserInfoReducer,
    setPostSetChanged: setPostSetChangedReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
