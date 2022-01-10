import { configureStore } from "@reduxjs/toolkit";
import {setAlertReducer, setImageLocationInModalReducer, setPostSetChangedReducer, setPostsReducer, setPreviewURLReducer, setSideBarExpandedReducer, setUserInfoReducer} from ".";

export const store = configureStore({
  reducer: {
    setPosts: setPostsReducer,
    setAlert: setAlertReducer,
    setUserInfo: setUserInfoReducer,
    setPostSetChanged: setPostSetChangedReducer,
    setPreviewURL: setPreviewURLReducer,
    setImageLocationInModal: setImageLocationInModalReducer,
    setSidebarExpanded: setSideBarExpandedReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
