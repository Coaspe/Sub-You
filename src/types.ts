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
export type userInfoType = {
    uid: string,
    email: string,
    emailVerified: string,
    displayName: string,
    isAnonymous: string,
    photoURL:string,
    providerData: [
        {
            providerId: string,
            uid: string,
            displayName: string,
            email: string,
            phoneNumber: boolean,
            photoURL: string
        }
    ],
    stsTokenManager: {
        refreshToken: string,
        accessToken: string,
        expirationTime: number
    },
    createdAt: string,
    lastLoginAt: string,
    apiKey: string,
    appName: string
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
export type postContent = {
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

export type chatRoomInfoType = { dateCreated: number, message: string, user: string, dummy: number };

export type auctionInfoType = {
    buyers: { [key: string]: string }
    done: boolean
    photoURL: string
    seller: string
    transaction: {[dateCreated: number] : { price: number, userUid: string }}
}