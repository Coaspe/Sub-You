import { getUserType, postContent } from "../types";

interface postsState {
    posts: postContent[];
}

interface setPostsAction {
    payload: setPostsPayload
}
interface setPostsPayload {
    posts: postContent[]
}

interface concatPostsPayload {
    posts: postContent[]
}

interface concatPostsAction {
    payload: setPostsPayload
}



interface alertState {
    alert: [boolean, string, string];
}

interface setAlertPayload {
    alert: [boolean, string, string];
}

interface setAlertAction {
    payload: setAlertPayload
}


interface userInfoState {
    userInfo: getUserType;
}

interface setUserInfoPayload {
    userInfo: getUserType;
}

interface setUserInfoAction {
    payload: setUserInfoPayload
}


interface postSetChangedState {
    postSetChanged: (string | boolean)[];
}

interface setPostSetChangedPayload {
    postSetChanged: (string | boolean)[];
}

interface setPostSetChangedAction {
    payload: setPostSetChangedPayload
}


interface previewURLState {
    previewURL: string[];
}

interface setPreviewURLPayload {
    previewURL: string[];
}

interface setPreviewURLAction {
    payload: setPreviewURLPayload
}

interface imageLocationInModalState {
    imageLocationInModal: Array<[number, number]>;
    myLocation: Array<number>
}

interface setImageLocationInModalPayload {
    imageLocationInModal: Array<[number, number]>;
}


interface setMyLocationPayload {
    myLocation: Array<number>
}

interface setImageLocationInModalAction {
    payload: setImageLocationInModalPayload
}

interface setMyLocationAction {
    payload: setMyLocationPayload
}


interface sideBarExpandedState {
    sideBarExpanded: boolean
}

interface setSideBarExpandedPayload {
    sideBarExpanded: boolean
}
interface setSideBarExpandedAction {
    payload: setSideBarExpandedPayload
}

