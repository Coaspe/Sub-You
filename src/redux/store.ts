import { configureStore } from "@reduxjs/toolkit";
import {setAlertReducer, setImageLocationInModalReducer, setLastCheckedTimeReducer, setPostSetChangedReducer, setPostsReducer, setPreviewURLReducer, setSideBarExpandedReducer, setUserInfoReducer, setWindowRatioReducer} from ".";

export const store = configureStore({
  reducer: {
    setPosts: setPostsReducer,
    setAlert: setAlertReducer,
    setUserInfo: setUserInfoReducer,
    setPostSetChanged: setPostSetChangedReducer,
    setPreviewURL: setPreviewURLReducer,
    setImageLocationInModal: setImageLocationInModalReducer,
    setSidebarExpanded: setSideBarExpandedReducer,
    setLastCheckedTime: setLastCheckedTimeReducer,
    setWindowRatio: setWindowRatioReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
