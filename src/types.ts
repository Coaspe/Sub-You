export type locationType = {
    "ip": string,
    "version": string,
    "city": string,
    "region": string,
    "region_code": string,
    "country": string,
    "country_name": string,
    "country_code": string,
    "country_code_iso3": string,
    "country_capital": string,
    "country_tld": string,
    "continent_code": string,
    "in_eu": boolean,
    "postal": string,
    "latitude": number,
    "longitude": number,
    "timezone": string,
    "utc_offset": string,
    "country_calling_code": string,
    "currency": string,
    "currency_name": string,
    "languages": string,
    "country_area": number,
    "country_population": number,
    "asn": string,
    "org": string
}
export const locationTypeInitial: locationType = {
    "ip": "",
    "version": "",
    "city": "",
    "region": "",
    "region_code": "",
    "country": "",
    "country_name": "",
    "country_code": "",
    "country_code_iso3": "",
    "country_capital": "",
    "country_tld": "",
    "continent_code": "",
    "in_eu": false,
    "postal": "",
    "latitude": 0,
    "longitude": 0,
    "timezone": "",
    "utc_offset": "",
    "country_calling_code": "",
    "currency": "",
    "currency_name": "",
    "languages": "",
    "country_area": 0,
    "country_population": 0,
    "asn": "",
    "org": ""
}
export type errorType = {
    "message" : string
}
export const errorInitial = {
    "message" : ""
}

export type userInfoType = {
    "uid": string,
    "email": string,
    "emailVerified": string,
    "displayName": string,
    "isAnonymous": string,
    "photoURL":string,
    "providerData": [
        {
            "providerId": string,
            "uid": string,
            "displayName": string,
            "email": string,
            "phoneNumber": boolean,
            "photoURL": string
        }
    ],
    "stsTokenManager": {
        "refreshToken": string,
        "accessToken": string,
        "expirationTime": number
    },
    "createdAt": string,
    "lastLoginAt": string,
    "apiKey": string,
    "appName": string
}

export type getUserType = {
    dateCreated: number
    followers: Array<string>
    following: Array<string>
    profileCaption: string
    profileImg: string
    uid: string
    userEmail: string
    username: string
    postDocId: Array<string>
    userEmailEncrypted: string
}

export type getUserPropType = {
    user: {
        dateCreated: number
        followers: Array<string>
        following: Array<string>
        profileCaption: string
        profileImg: string
        uid: string
        userEmail: string
        username: string
        postDocId: Array<string>
    }
}
export type getUserType2 = {
    dateCreated: number
    docId: string
    followers: Array<string>
    following: Array<string>
    profileCaption: string
    profileImg: string
    uid: string
    userEmail: string
    username: string
    postDocId: Array<string>
}

export type postContent = {
    postContentProps: {
        caption: string
        category: string
        comments: Array<string>
        dateCreated: number
        docId: string
        imageSrc: Array<string>
        likes: Array<string>
        postId: Array<string>
        userId: string
        userLikedPhoto: boolean
        username: string
        averageColor: Array<string>
        avatarImgSrc: string
    }
}

export type postContent2 = {
        caption: string
        category: string
        comments: Array<string>
        dateCreated: number
        docId: string
        imageSrc: Array<string>
        likes: Array<string>
        postId: Array<string>
        userId: string
        userLikedPhoto: boolean
        username: string
        averageColor: Array<string>
        avatarImgSrc: string
}
export type userInfoFromFirestore = {
    dateCreated: number
    docId: string
    followers: Array<string>
    following: Array<string>
    profileCaption: string
    profileImg: string
    uid: string
    userEmail: string
    username: string
}

export type artistImageProptype = {
    prop: {
        src : string
    }
}
export type artistImage = {
        src : string
}