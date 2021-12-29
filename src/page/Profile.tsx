import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Header from "../components/Header";
import { getUserByEmailEncrypted, getPhotos } from "../services/firebase";
import { getUserType } from "../types";
import { ReactCountryFlag } from "react-country-flag"
import axios from 'axios'
import { locationType, userInfoFromFirestore, postContent } from '../types';
import firebase from "firebase/compat";
import UserContext from "../context/user";
import Post from "../components/post/Post";

const Profile = () => {

    const { userEmailEncrypted } = useParams();
    const [userInfo, setUserInfo] = useState<getUserType>({} as getUserType)
    const [posts, setPosts] = useState<postContent[]>([]);
    const [location, setLocation] = useState<locationType>({} as locationType);
    const { user: contextUser } = useContext(UserContext)
    
    useEffect(() => { 
        getUserByEmailEncrypted(userEmailEncrypted).then((res:any) => {
            setUserInfo(res)
        })
        
    }, [userEmailEncrypted])

    useEffect(() => {
        axios.get('https://ipapi.co/json/')
            .then((response: any) => {
                let data = response.data;
                setLocation(data)
            });
    }, [])

    useEffect(() => {
        
        async function getTimelinePhotos() {
        const result = await firebase
            .firestore()
            .collection("users")
            .where("uid", "==", contextUser.uid)
            .get();
        
        const user = result.docs.map((item) => ({
            ...item.data(),
            docId: item.id,
        }));
        
        const userTemp = user as userInfoFromFirestore[]
        const { following } = userTemp[0]
        
        return getPhotos(contextUser.uid, following)
        }

        getTimelinePhotos().then((res: any) => {
        const tmp = res.map((r: any) => ({
            postContentProps: {
            ...r
            }
        }))
            
        setPosts(tmp)
            
        })
    }, [contextUser])
    return (
        <>
            <Header userInfo={userInfo} />
            <div className="grid grid-cols-7 w-full">
                {userInfo.postDocId ?
                    (
                    <div className="flex col-span-5 col-start-2 items-start mt-6">
                        <div className="flex w-1/3 items-start">
                            <img className="w-full max-h-full max-w-full object-cover rounded-md" src="/images/7.jpg" alt="profile" />
                        </div>
                        <div className="flex flex-col w-2/3 ml-5 justify-around h-full">
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <span className="font-noto font-bold text-2xl mr-2">{userInfo.username}</span>
                                    <ReactCountryFlag countryCode={location.country} svg />
                                </div>
                                <div className="font-noto flex text-gray-500 mb-2">
                                    <div className="mr-3">
                                        <span className="text-xs mr-1">{userInfo.postDocId.length}</span>
                                        <span className="text-xs">Photos</span>
                                    </div>
                                    <div>
                                        <span className="text-xs mr-1">{userInfo.followers.length}</span>
                                        <span className="text-xs">Followers</span>
                                    </div>
                                </div>
                                <div className="w-full flex">
                                    <svg
                                        className="w-6 mr-5"
                                        viewBox="0 0 1024 1024">
                                    <path d="M924.3 338.4a447.57 447.57 0 0 0-96.1-143.3 443.09 443.09 0 0 0-143-96.3A443.91 443.91 0 0 0 512 64h-2c-60.5.3-119 12.3-174.1 35.9a444.08 444.08 0 0 0-141.7 96.5 445 445 0 0 0-95 142.8A449.89 449.89 0 0 0 65 514.1c.3 69.4 16.9 138.3 47.9 199.9v152c0 25.4 20.6 46 45.9 46h151.8a447.72 447.72 0 0 0 199.5 48h2.1c59.8 0 117.7-11.6 172.3-34.3A443.2 443.2 0 0 0 827 830.5c41.2-40.9 73.6-88.7 96.3-142 23.5-55.2 35.5-113.9 35.8-174.5.2-60.9-11.6-120-34.8-175.6zM312.4 560c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.4 48-47.9 48zm199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.5 48-47.9 48zm199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.5 48-47.9 48z"/>
                                    </svg>

                                    <svg
                                    className="w-6"
                                    x="0px" y="0px"
                                    viewBox="0 0 13.066 13.066">
                                        <g>
                                            <path style={{fill: ""}} d="M6.555,12.558c-0.098,0-0.195-0.034-0.273-0.103c-0.233-0.2-5.718-4.954-6.199-7.885
                                                C-0.133,3.243,0.071,2.201,0.69,1.474C1.22,0.85,2.034,0.507,2.982,0.507c0.082,0,0.165,0.002,0.247,0.008
                                                c0.058-0.003,0.115-0.004,0.172-0.004c1.048,0,2.343,0.461,3.109,2.421c0.43-1.196,1.311-2.417,3.328-2.417
                                                c1.135,0,2.023,0.342,2.571,0.987c0.597,0.701,0.787,1.733,0.569,3.068c-0.479,2.929-5.918,7.684-6.149,7.884
                                                C6.751,12.524,6.653,12.558,6.555,12.558z"/>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <p className="font-noto text-sm text-gray-400">{userInfo.profileCaption}</p>
                        </div>
   
                    </div>
                    ) : null}
                <hr
                    className="col-span-3 col-start-3 opacity-50 my-12 "
                    style={{
                    color: "gray",
                    backgroundColor: "gray",
                    height: .5,
                    borderColor: "gray",
                    borderTop: 0,
                    }} />
                <div className="grid grid-cols-3 col-span-5 col-start-2 items-start mt-6">
                    {posts.length > 0 ? (
                        posts.map(({ postContentProps }: postContent) => (
                            <Post postContentProps={postContentProps} />
                        ))
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default Profile