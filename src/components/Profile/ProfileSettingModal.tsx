import { getUserType } from "../../types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Compressor from "compressorjs";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface props {
    userInfo: getUserType
    setSettingModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileSettingModal: React.FC<props> = ({ userInfo, setSettingModal }) => {


    const [imageURL, setImageURL] = useState(userInfo.profileImg)
    const [userName, setUserName] = useState(userInfo.username)
    const [profileCaption, setProfileCaption] = useState(userInfo.profileCaption)
    const [file, setFile] = useState<Blob>({} as Blob)
    const windowRatio: number = useSelector((state: RootState) => state.setWindowRatio.windowRatio)

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
    useEffect(() => {
        console.log(profileCaption.replace(/\\n/g, "\\n"));
    },[profileCaption])
    return (
        <AnimatePresence>
            <motion.div
                onClick={()=>setSettingModal(false)}
                animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }}
                transition={{ duration : 0.1 }}
                className="z-10 fixed flex w-screen h-screen items-center justify-center font-noto">
                <motion.div onClick={(event) => { event.stopPropagation() }} className={`${windowRatio < 1 ? "w-2/3 h-1/3" : "w-1/2 h-2/3"} bg-white z-20 flex px-2 flex-col items-center justify-around `}>
                    {/* Title */}
                    <span className="font-black text-2xl">Profile</span>

                    {/* Middle */}
                    <div className="w-full flex items-center px-3">
                        <div className="flex w-1/3 h-full flex-col items-center justify-center mr-2">
                            <label
                                className="relative font-noto h-full rounded-md cursor-pointer items-center justify-center flex"
                                htmlFor="input-file"
                            >
                                <div className="absolute w-full h-full hover:bg-slate-300 hover:bg-opacity-50"></div>
                                <img className="max-h-full max-w-full rounded-md shadow-xl" src={imageURL} alt="profile" />
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

                        <div className="flex flex-col w-2/3 h-full items-center justify-center">
                            <div className="flex flex-col justify-around">
                                <div className="flex items-center mb-5">
                                    <input value={userName} onChange={(e)=>{setUserName(e.target.value)}} className="px-2 py-2 w-2/3 text-center border-2 font-noto font-bold text-2xl bg-transparent rounded-lg" />
                                </div>
                                <div className="flex flex-col items-end w-full">
                                    <textarea  className="rounded-lg px-2 py-2 border-2 resize-none w-full h-48 font-noto text-sm text-gray-400 bg-transparent" placeholder={`${profileCaption === "" && "Type Bio..."}`} spellCheck="false" onChange={(e)=>{setProfileCaption(e.target.value)}} value={profileCaption} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-center">
                        {/* Comfirm button */}
                        <button className="mr-2" onClick={() => {
                            if (imageURL === userInfo.profileImg && userName === userInfo.username && profileCaption === userInfo.profileCaption) {
                                return
                            } else {
                                if (imageURL === userInfo.profileImg) {
                                    axios.post('http://localhost:3001/updateProfileWithoutImage', {
                                        userEmail: userInfo.userEmail,
                                        profileCaption,
                                        username: userName
                                    })
                                } else {
                                    let param = new window.FormData()
                                    param.append("file", file); 
                                    param.append("userEmail", userInfo.userEmail)
                                    param.append("profileCaption", profileCaption.replace(/\n/g, "\\n"))
                                    param.append("username", userName)

                                    axios.post('http://localhost:3001/updateProfileWithImage', param)
                                }
                                setSettingModal(false)
                            }
                        }}>
                            <svg x="0px" y="0px"
                                className="w-7"
                                fill="#3bc472"
                                viewBox="0 0 493.464 493.464">
                                <g>
                                    <g>
                                        <path d="M246.736,0C110.692,0,0.004,110.68,0.004,246.732c0,136.06,110.688,246.732,246.732,246.732
                                            c136.048,0,246.724-110.672,246.724-246.732C493.456,110.68,382.78,0,246.736,0z M360.524,208.716L230.98,338.268
                                            c-2.82,2.824-7.816,2.824-10.64,0l-86.908-86.912c-1.412-1.416-2.192-3.3-2.192-5.324c0.004-2.016,0.784-3.912,2.192-5.336
                                            l11.108-11.104c1.412-1.408,3.3-2.18,5.328-2.18c2.016,0,3.908,0.772,5.316,2.18l67.752,67.752c1.5,1.516,3.94,1.516,5.444,0
                                            l110.392-110.392c2.824-2.824,7.828-2.824,10.644,0l11.108,11.124c1.412,1.4,2.208,3.304,2.208,5.308
                                            C362.732,205.412,361.936,207.3,360.524,208.716z"/>
                                    </g>
                                </g>
                            </svg>
                        </button>

                        {/* Cancel button */}
                        <button onClick={()=>{setSettingModal(false)}}>
                            <svg x="0px" y="0px"
                                fill="#ff3f5b"
                                className="w-7"
                                viewBox="0 0 300.003 300.003">
                                <g>
                                    <g>
                                        <path d="M150,0C67.159,0,0.001,67.159,0.001,150c0,82.838,67.157,150.003,149.997,150.003S300.002,232.838,300.002,150
                                            C300.002,67.159,232.839,0,150,0z M206.584,207.171c-5.989,5.984-15.691,5.984-21.675,0l-34.132-34.132l-35.686,35.686
                                            c-5.986,5.984-15.689,5.984-21.672,0c-5.989-5.991-5.989-15.691,0-21.68l35.683-35.683L95.878,118.14
                                            c-5.984-5.991-5.984-15.691,0-21.678c5.986-5.986,15.691-5.986,21.678,0l33.222,33.222l31.671-31.673
                                            c5.986-5.984,15.694-5.986,21.675,0c5.989,5.991,5.989,15.697,0,21.678l-31.668,31.671l34.13,34.132
                                            C212.57,191.475,212.573,201.183,206.584,207.171z"/>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ProfileSettingModal