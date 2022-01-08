import { createAction, createReducer } from "@reduxjs/toolkit";
import { getUserType } from "../types";
import { alertState, concatPostsAction, concatPostsPayload, postSetChangedState, postsState, previewURLState, setAlertAction, setAlertPayload, setPostsAction, setPostSetChangedAction, setPostSetChangedPayload, setPostsPayload, setPreviewURLAction, setPreviewURLPayload, setUserInfoAction, setUserInfoPayload, userInfoState } from "./type";

export const postsAction = {
    setPosts: createAction<setPostsPayload>("SETPOSTS"),
    concatPosts: createAction<concatPostsPayload>("CONCATPOSTS")
}

const postsInitialState: postsState = {
    posts: [],
}

export const postsReducer = {
    setPosts: (state: postsState, action: setPostsAction) => {
        state.posts = action.payload.posts
    },
    concatPosts: (state: postsState, action: concatPostsAction) => {
        state.posts = state.posts.concat(action.payload.posts)
    }
}
export const setPostsReducer = createReducer(postsInitialState, builder => {
    builder
        .addCase(postsAction.setPosts, postsReducer.setPosts)
        .addCase(postsAction.concatPosts, postsReducer.concatPosts)
})
/////////////////////////////////////////////////////////////////////////////////////
export const alertAction = {
    setAlert: createAction<setAlertPayload>("SETALERT"),
}

const alertInitialState: alertState = {
    alert: [false, "", ""],
}

export const alertReducer = {
    setAlert: (state: alertState, action: setAlertAction) => {
        state.alert = action.payload.alert
    },
}

export const setAlertReducer = createReducer(alertInitialState, builder => {
    builder
        .addCase(alertAction.setAlert, alertReducer.setAlert)
})
/////////////////////////////////////////////////////////////////////////////////////
export const userInfoAction = {
    setUserInfo: createAction<setUserInfoPayload>("SETUSERINFO"),
}

const userInfoInitialState: userInfoState = {
    userInfo: {} as getUserType,
}

export const userInfoReducer = {
    setUserInfo: (state: userInfoState, action: setUserInfoAction) => {
        state.userInfo = action.payload.userInfo
    },
}

export const setUserInfoReducer = createReducer(userInfoInitialState, builder => {
    builder
        .addCase(userInfoAction.setUserInfo, userInfoReducer.setUserInfo)
})


export const postSetChangedAction = {
    setPostSetChanged: createAction<setPostSetChangedPayload>("SETPOSTSETCHANGED"),
}

const postSetChangedInitialState: postSetChangedState = {
    postSetChanged: ["", false] as (string | boolean)[],
}

export const postSetChangedReducer = {
    setPostSetChanged: (state: postSetChangedState, action: setPostSetChangedAction) => {
        state.postSetChanged = action.payload.postSetChanged
    },
}

export const setPostSetChangedReducer = createReducer(postSetChangedInitialState, builder => {
    builder
        .addCase(postSetChangedAction.setPostSetChanged, postSetChangedReducer.setPostSetChanged)
})


export const previewURLAction = {
    setPreviewURL: createAction<setPreviewURLPayload>("SETPREVIEWURL"),
}

const previewURLInitialState: previewURLState = {
    previewURL: ["/images/logo.png"] as string[]
}

export const previewURLReducer = {
    setPreviewURL: (state: previewURLState, action: setPreviewURLAction) => {
        state.previewURL = action.payload.previewURL
    },
}

export const setPreviewURLReducer = createReducer(previewURLInitialState, builder => {
    builder
        .addCase(previewURLAction.setPreviewURL, previewURLReducer.setPreviewURL)
})