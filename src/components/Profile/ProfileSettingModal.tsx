import { getUserType } from "../../types";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
interface props {
    userInfo: getUserType
    setSettingModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileSettingModal: React.FC<props> = ({ userInfo, setSettingModal }) => {
    const [imageURL, setImageURL] = useState(userInfo.profileImg)
    const [userName, setUserName] = useState(userInfo.username)
    const [profileCaption, setProfileCaption] = useState(userInfo.profileCaption)
    return (
        <AnimatePresence>
            <motion.div
                onClick={()=>setSettingModal(false)}
                animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }}
                className="z-10 fixed flex w-screen h-screen items-center justify-center">
                <motion.div className="w-2/3 bg-red-50">
                     <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity : 1 }}
                                className="flex col-span-5 col-start-2 items-start mt-3 mb-3 ">
                                {/* Profile Image Div */}
                                <div className="flex w-1/3 items-start mr-3">
                                    <img className="w-full max-h-full max-w-full object-cover rounded-md shadow-xl" src="/images/applecircle.png" alt="profile" />
                                    <button>Edit</button>
                                </div>
                                
                                {/* Username, User Intro comment, Nationality, Message Btn, 
                                Setting Btn, Follow Btn, Followers, Photos Div */}
                                <div className="flex flex-col w-2/3 ml-5 justify-around h-full">
                                    <div className="flex flex-col">

                                        {/* Username and Country flag */}
                                        <div className="flex items-center">
                                            <span className="font-noto font-bold text-2xl mr-2">{userInfo.username}</span>
                                            <button>Edit</button>
                                        </div>


                                      
                                    </div>
                            {/* Caption */}
                            <div>
                                <p className="font-noto text-sm text-gray-400">{userInfo.profileCaption}</p>
                                <button>Edit</button>
                            </div>
                            <div>
                                <button onClick={() => {
                                    if (imageURL === userInfo.profileImg && userName === userInfo.username && profileCaption === userInfo.profileCaption) {
                                        return
                                    } else {
                                        
                                    }
                                }}>Submit</button>
                                <button>Cancle</button>
                            </div>
                                </div>
                            </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ProfileSettingModal