import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion"
import { memo, useEffect, useState } from "react"
import { getUserType } from "../types"
import '../style/sidebar.css'
import { sidebarData } from "../data/sidebarData"
import { useNavigate } from 'react-router';
import Newpostmodal from "../components/Newpostmodal"
import { CircularProgress } from "@mui/material"
interface sidebarProps {
    userInfo: getUserType

    sideExpanded: boolean
    
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>

    selectedPage: string
    setSelectedPage: React.Dispatch<React.SetStateAction<string>>
}
export const cacheImages = async (src: string) => {
    await new Promise(function (resolve, reject) {
    const img = new Image();

    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = () => reject();
    })
}
const Sidebar: React.FC<sidebarProps> = (
    {
        userInfo,
        sideExpanded,
        isLoading,
        setIsLoading,
        selectedPage,
        setSelectedPage
    }) => {

    const [modalOpen, setModalOpen] = useState(false)
    const [windowInfo, setWindowInfo] = useState(0)
    const navigate = useNavigate()
    
    const handleClickProfile = () => {
        navigate(`/p/${userInfo?.userEmailEncrypted}`)
    }

    const divVariants = {
            initial: {
                x: 0, opacity: 0,
            },
            animate: {
                x: sideExpanded ? 0 : "-100%", opacity: 1,
                transition: {
                    duration : 0.3
                }
            },
    }
    useEffect(() => {
        cacheImages("/images/logo.png")
    }, [])

    window.onresize = function () {
        setWindowInfo(window.innerWidth / window.innerHeight);
    }

    useEffect(() => {
        setWindowInfo(window.innerWidth / window.innerHeight)
    }, [])
    
    return (
      <>
        <AnimatePresence initial={false}>
                <motion.div 
                    key="main div"
                    variants={divVariants}
                    initial="initial"
                    animate="animate"
                    className={`shadow-lg col-span-2 h-full font-noto items-center bg-main bg-opacity-10 flex flex-col sm:hidden z-10`}>
                    {userInfo.postDocId ? (
                        <motion.div
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        className={`flex flex-col items-center left-2 h-full w-full`}>
                                <div className="flex flex-col items-center w-3/5 mt-10 pb-10">
                                    <img className="w-full max-h-full max-w-full object-cover shadow-lg rounded-md mb-5" src={userInfo.profileImg} alt="profile" />
                                    <div className="flex items-center">
                                        {isLoading ? (<CircularProgress size={20} />) : (<img className="w-4" src="/images/check.png" alt="No Problems" />)}
                                        <span onClick={handleClickProfile} className="cursor-pointer font-black text-lg ml-2">{userInfo.username}</span>
                                        <svg x="0px" y="0px"
                                        className="w-5 ml-2"
                                            viewBox="0 0 455 455">
                                            <g>
                                                <path d="M227.5,455c27.922,0,52.019-16.353,63.255-40H164.245C175.481,438.647,199.578,455,227.5,455z"/>
                                                <path d="M415,355v-40l-30-30v-80.366C385,127.909,330.135,64.01,257.5,50V30c0-16.542-13.458-30-30-30s-30,13.458-30,30v20
                                                    C124.865,64.01,70,127.909,70,204.634L70,285l-30,30v40H10v30h30h375h30v-30H415z"/>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Post Followers Followings Div */}
                                <div className="flex items-center justify-between pt-5 w-3/5 border-t-2 pb-5 border-b-2">
                                    <div className="flex flex-col items-center">
                                        <span className="font-black text-sm">
                                            {userInfo.postDocId.length}
                                        </span>
                                        <span className="text-gray-400 text-xxs">
                                            Posts
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center mx-2">
                                        <span className="font-black text-sm">
                                            {userInfo.followers.length}
                                        </span>
                                        <span className="text-gray-400 text-xxs">
                                            Followers
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center mr-2">
                                        <span className="font-black text-sm">
                                            {userInfo.following.length}
                                        </span>
                                        <span className="text-gray-400 text-xxs">
                                            Followings
                                        </span>
                                    </div>                                     
                                    <div className="flex flex-col items-center">
                                        <span className="font-black text-sm">
                                            {userInfo.SUB}
                                        </span>
                                        <span className="text-gray-400 text-xxs">
                                            SUB
                                        </span>
                                    </div>                       
                                </div>
                                
                                {/* Side Navigataion */}
                                <AnimateSharedLayout>
                                    <ol className="w-3/5 flex flex-col items-center mt-14">
                                        {sidebarData.map(({svg, title}) => (
                                            <motion.li
                                                key={title}
                                                onClick={() => {
                                                    setSelectedPage(title)
                                                    if (title === "New Post") {
                                                        setModalOpen(true)
                                                    }
                                                }}
                                                animate
                                                className="relative w-full flex items-center cursor-pointer mb-7">
                                                {title === selectedPage ? (
                                                    <motion.div
                                                        className="underline"
                                                        layoutId="underline"
                                                        style={{ backgroundColor: "#736578" }}
                                                    />
                                                    ) : null}
                                                <svg 
                                                className="w-10 ml-5"
                                                fill={`${title === selectedPage ? "black" : "gray"}`}
                                                x="0px" y="0px"
                                                viewBox={svg.viewBox}>
                                                    <path d={svg.path} />
                                                </svg>
                                                <motion.span
                                                    className={`ml-10 font-bold w-full ease-in duration-300 ${title === selectedPage ? "text-black" : "text-gray-500"} hover:text-black`}>
                                                    {title}
                                                </motion.span>
                                            </motion.li>
                                            ))
                                        }
                                    </ol>
                                </AnimateSharedLayout>
                        </motion.div>
                    ) : (
                        null
                        )
                    }
            </motion.div>
        </AnimatePresence>
            {modalOpen && <Newpostmodal
                setOpen={setModalOpen}
                open={modalOpen}
                setSelectedPage={setSelectedPage}
                setIsLoading={setIsLoading}
            />}
    </>
    )
}

export default memo(Sidebar)