import { getUserType } from "../../types";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Compressor from "compressorjs";
import axios from "axios";

interface props {
    userInfo: getUserType
    setSettingModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileSettingModal: React.FC<props> = ({ userInfo, setSettingModal }) => {


    const [imageURL, setImageURL] = useState(userInfo.profileImg)
    const [userName, setUserName] = useState(userInfo.username)
    const [profileCaption, setProfileCaption] = useState(userInfo.profileCaption)
    const [file, setFile] = useState<Blob>({} as Blob)

    const handleFileOnChange = (event: any) => {
        const element = event.target.files[0]
        
        let qual = 0.45;

        if (element.size >= 4000000) {
            qual = 0.1
        } else if (element.size >= 2000000) {
            qual = 0.2
        } else if (element.size >= 1000000) {
            qual = 0.4
        }

        new Compressor(element, {
            quality: qual,
            width: 800,
            height: 800,
            success(result: any) {
                setFile(result)
                const url = URL.createObjectURL(result)
                // Get Photo's average color for space
                setImageURL(url)
            },
            error(err) {
                console.log(err.message);
                return;
            },
        });
    };
    
    return (
        <AnimatePresence>
            <motion.div
                onClick={()=>setSettingModal(false)}
                animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }}
                className="z-10 fixed flex w-screen h-screen items-center justify-center">
                <motion.div onClick={(event)=>{event.stopPropagation()}}className="w-2/3 h-1/3 bg-red-50 z-20 flex px-2">
                        {/* Profile Image Div */}
                        <div className="flex w-1/3 h-full flex-col items-center justify-center mr-2">
                            <img className="w-full max-h-full max-w-full object-cover rounded-md shadow-xl" src={imageURL} alt="profile" />
                            <label
                                className="font-noto px-2 py-1 text-center bg-main rounded-md cursor-pointer"
                                htmlFor="input-file"
                            >
                                Find
                            </label>
                            <form encType='multipart/form-data' name="files">
                                <input
                                    type="file"
                                    name="files"
                                    id="input-file"
                                    multiple
                                    style={{ display: "none" }}
                                    onChange={(event : any) => {
                                        handleFileOnChange(event);
                                    }}
                                    />
                            </form>
                        </div>
                        
                        {/* Username, User Intro comment, Nationality, Message Btn, 
                        Setting Btn, Follow Btn, Followers, Photos Div */}
                        <div className="flex flex-col w-2/3 h-full justify-between">
                            <div className="flex flex-col h-3/4 justify-around">
                                {/* Username and Country flag */}
                                <div className="flex items-center">
                                    <input value={userName} onChange={(e)=>{setUserName(e.target.value)}} className="font-noto font-bold text-2xl mr-2 bg-transparent" />
                                </div>
                                <div className="flex flex-col items-end w-full">
                                    <textarea spellCheck="false" onChange={(e)=>{setProfileCaption(e.target.value)}} value={profileCaption} className="w-full h-20 font-noto text-sm text-gray-400" />
                                </div>
                            </div>
                            {/* Caption */}
                            <div className="w-full h-1/4 flex items-end justify-end">
                                <button className="mr-2" onClick={() => {
                                    if (imageURL === userInfo.profileImg && userName === userInfo.username && profileCaption === userInfo.profileCaption) {
                                        return
                                    } else {
                                        if (imageURL === userInfo.profileImg) {
                                            
                                        } else {
                                            let param = new window.FormData()
                                            param.append("file", file); 
                                            param.append("userUID", userInfo.uid as string)
                                            param.append("userEmail", userInfo.userEmail)
                                            param.append("profileCaption", profileCaption)
                                            param.append("username", userName)

                                            axios.post('http://localhost:3001/updateProfile', param)
                                        }
                                        setSettingModal(false)
                                    }
                                }}>Submit</button>
                                <button>Cancle</button>
                            </div>
                        </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ProfileSettingModal