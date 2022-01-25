import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Header from "../components/Header";
import { getUserByEmailEncrypted, getDocFirstImage } from "../services/firebase";
import { getUserType } from "../types";
import { ReactCountryFlag } from "react-country-flag"
import axios from 'axios'
import { locationType } from '../types';
import {AnimateSharedLayout, motion} from 'framer-motion'
import ProfileDetailImage from "../components/Profile/ProfileDetailImage";
import ProfileSettingModal from "../components/Profile/ProfileSettingModal";

const Profile = () => {
    
    interface firstImageInfo {
        src: string;
        color: string;
        docId: string;
    }

    const { userEmailEncrypted } = useParams();
    const [userInfo, setUserInfo] = useState<getUserType>({} as getUserType)
    const [docId, setDocId] = useState<string>("")
    const [firstImageSrc, setFirstImageSrc] = useState<string>("")
    const [imageInfo, setImageInfo] = useState<firstImageInfo[]>([]);
    const [location, setLocation] = useState<locationType>({} as locationType);
    const [screen, setScreen] = useState(false)
    const [settingModal, setSettingModal] = useState(false)

    useEffect(() => { 

        // Get profile owner's firestore information from params(encrypted email)
        getUserByEmailEncrypted(userEmailEncrypted).then((res:any) => {
            setUserInfo(res)
        })
        
    }, [userEmailEncrypted])

    useEffect(() => {
        
        // Get location information.
        axios.get('https://ipapi.co/json/')
            .then((response: any) => {
                let data = response.data;
                setLocation(data)
            });
        
    }, [])

    useEffect(() => { 
        // Get Each Posts's first image src, avearage color and Firestore docId 
        // And set those values to variable imageInfo
        if (userInfo.postDocId) {
            getDocFirstImage(userInfo.postDocId).then((re: any) => {
                if (re === undefined) {
                    return;
                }
                
                const x : firstImageInfo[] = re.map((data : any) => ({
                    src : data.data().imageSrc[0],
                    color: data.data().averageColor[0],
                    docId : data.id
                }))

                setImageInfo(x.reverse())
                
            })
        }
    }, [userInfo])
    
    // For responsive web UI, detect window size.
    window.onresize = function () {
        
        if (window.innerWidth >= 1400 && !screen) {
            setScreen(true)
        }
        if (window.innerWidth < 1400 && screen) {
            setScreen(false)
        }
        
    }

    useEffect(() => {
        if (window.innerWidth >= 1400) {
            setScreen(true)
        }
    }, [])

    return (
        <div className="z-0 w-full flex flex-col items-center">
            {settingModal && <ProfileSettingModal userInfo={userInfo} setSettingModal={setSettingModal} />}
            <AnimateSharedLayout type="crossfade">
                {docId && <ProfileDetailImage docId={docId} setDocId={setDocId} firstImageSrc={firstImageSrc} />}
                <div className="w-full">
                    <Header userInfo={userInfo} />
                </div>
                <div className="grid grid-cols-7 w-2/3 justify-items-center">
                    {userInfo.postDocId ?
                        (<>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity : 1 }}
                                className="flex col-span-5 col-start-2 items-start mt-6 ">
                                {/* Profile Image Div */}
                                <div className="flex w-1/3 mr-3 h-full items-center justify-center">
                                    <img className="w-full max-h-full max-w-full object-cover rounded-xl shadow-xl" src={userInfo.profileImg} alt="profile" />
                                </div>
                                
                                {/* Username, User Intro comment, Nationality, Message Btn, 
                                Setting Btn, Follow Btn, Followers, Photos Div */}
                                <div className="flex flex-col w-2/3 ml-5 justify-around h-full">
                                    <div className="flex flex-col">

                                        {/* Username and Country flag */}
                                        <div className="flex items-center">
                                            <span className="font-noto font-bold text-2xl mr-2">{userInfo.username}</span>
                                            <ReactCountryFlag countryCode={location.country} svg />
                                        </div>
                                        
                                        {/* The Numbers of posts and The numbers of Followers */}
                                        <div className="font-noto flex text-gray-500 my-2">
                                            <div className="mr-3">
                                                <span className="text-xs mr-1">{userInfo.postDocId.length}</span>
                                                <span className="text-xs">Photos</span>
                                            </div>
                                            <div>
                                                <span className="text-xs mr-1">{userInfo.followers.length}</span>
                                                <span className="text-xs">Followers</span>
                                            </div>
                                        </div>

                                        {/* Message Btn, Follow Btn, Setting Btn */}
                                        <div className="w-full flex">
                                            <svg
                                                fill="gray"
                                                className="w-6 mr-5 cursor-pointer"
                                                viewBox="0 0 1024 1024">
                                            <path className="" d="M924.3 338.4a447.57 447.57 0 0 0-96.1-143.3 443.09 443.09 0 0 0-143-96.3A443.91 443.91 0 0 0 512 64h-2c-60.5.3-119 12.3-174.1 35.9a444.08 444.08 0 0 0-141.7 96.5 445 445 0 0 0-95 142.8A449.89 449.89 0 0 0 65 514.1c.3 69.4 16.9 138.3 47.9 199.9v152c0 25.4 20.6 46 45.9 46h151.8a447.72 447.72 0 0 0 199.5 48h2.1c59.8 0 117.7-11.6 172.3-34.3A443.2 443.2 0 0 0 827 830.5c41.2-40.9 73.6-88.7 96.3-142 23.5-55.2 35.5-113.9 35.8-174.5.2-60.9-11.6-120-34.8-175.6zM312.4 560c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.4 48-47.9 48zm199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.5 48-47.9 48zm199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.5 48-47.9 48z"/>
                                            </svg>

                                            <svg
                                                fill="gray"
                                                className="w-6 mr-5 cursor-pointer"
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
                                            <svg
                                                onClick={()=>setSettingModal(true)}
                                                fill="gray"
                                                className="w-6 cursor-pointer"
                                                viewBox="0 0 1024 1024">
                                                <path d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8-21.1 21.2-32.8 49.2-32.8 79.1 0 29.9 11.7 57.9 32.8 79.1 21.2 21.1 49.2 32.8 79.1 32.8 29.9 0 57.9-11.7 79.1-32.8 21.1-21.2 32.8-49.2 32.8-79.1 0-29.9-11.7-57.9-32.8-79.1a110.96 110.96 0 0 0-79.1-32.8zm412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a442.5 442.5 0 0 0-79.6-137.7l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.3a353.44 353.44 0 0 0-98.9 57.3l-81.8-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a445.93 445.93 0 0 0-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57 0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0 0 25.8 25.7l2.7.5a448.27 448.27 0 0 0 158.8 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35zm-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8 175.8 78.7 175.8 175.8-78.7 175.8-175.8 175.8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Caption */}
                                    <p className="font-noto text-sm text-gray-400">{userInfo.profileCaption}</p>
                                </div>
                            </motion.div>
                            
                            {/* Recent Auctions list */}
                                <div className="flex justify-center w-2/3 col-span-3 col-start-3 py-12 border-b-2">
                                    <span className="text-4xl font-noto">Auctions</span>
                                </div>
                            {/* Posts list */}
                            <div className="flex justify-center w-2/3 col-span-3 col-start-3 py-12 border-b-2">
                                <span className="text-4xl font-noto">Posts</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 col-span-5 col-start-2 items-start mt-6">
                                {imageInfo.length > 0 && imageInfo[0].docId ? (
                                    imageInfo.map((data: firstImageInfo) => (
                                        <motion.div
                                            layoutId={`container-${data.docId}`}
                                            onClick={() => {
                                                setDocId(data.docId)
                                                setFirstImageSrc(data.src)
                                            }}
                                            style={{backgroundColor : data.color}}
                                            whileHover={{scale : 1.1}}
                                            initial={{opacity : 0,}}
                                            animate={{ opacity: 1, }}
                                            exit={{ opacity: 0,  }}
                                            className="cursor-pointer w-full h-full flex items-center justify-center">
                                            <motion.img layoutId={`image-${data.docId}`} className="max-h-full max-w-full" src={data.src} alt="sss" />
                                        </motion.div>
                                    ))
                                    ): (
                                        null 
                                    )}
                            </div>
                        </>)
                    : null}
                </div>
            </AnimateSharedLayout>
        </div>
    )
}

export default Profile