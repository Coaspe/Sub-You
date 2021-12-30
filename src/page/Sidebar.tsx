import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion"
import { memo, useEffect, useState } from "react"
import { getUserType } from "../types"
import '../style/sidebar.css'
import { sidebarData } from "../data/sidebarData"
import { useNavigate } from 'react-router';
import Newpostmodal from "../components/Newpostmodal"

interface sidebarProps {
    userInfo: getUserType
    sideExpanded: boolean
    setSideExpanded : React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<sidebarProps> = ({ userInfo, sideExpanded, setSideExpanded }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(0);
    const [contextUserInfo, setContextUserInfo] = useState<getUserType>({} as getUserType)
    const navigate = useNavigate()

    const handleExpand = () => {
        setSideExpanded(!sideExpanded)
    }
    const handleClickProfile = () => {
        navigate(`/p/${userInfo?.userEmailEncrypted}`)
    }

    const divVariants = {
        initial: {
          x : 0, opacity : 0
        },
        animate: {
            x: sideExpanded ? 0 : "-90%", opacity: 1,
            transition: {
                duration:0.3
            }
        }
    }
    useEffect(() => {
        setContextUserInfo(userInfo)
    }, [userInfo])
    useEffect(() => {
        const cacheImages = async () => {
        await new Promise(function (resolve, reject) {
          const img = new Image();

          img.src = "/images/logo.png";
          img.onload = () => resolve("/images/logo.png");
          img.onerror = () => reject();
        })
        }
        cacheImages()
    }, [])
    const bounceTransition = {
        x: {
            duration: 0.4,
            yoyo: Infinity,
            ease: "easeOut",
        }
    }

    return (
    <>
        <AnimatePresence>
        <motion.div 
        key="main div"
        variants={divVariants}
        initial="initial"
        animate="animate"
        className="h-full font-noto items-center col-span-1 bg-main bg-opacity-10 flex flex-col sm:hidden">
        {contextUserInfo.postDocId ? (
                <motion.div 
                className={`flex flex-col items-center ${sideExpanded ? null : "absolute left-2 top-2"}`}>
                    <div className="w-full relative">
                        <motion.svg 
                        animate={{
                            rotate: sideExpanded ? 0 : 180,
                            x: !sideExpanded ? ["0%", "20%"] : ["0%", "0%"],
                        }}
                        transition={bounceTransition}
                        onClick={handleExpand}
                        className={`bg-main bg-opacity-30 rounded-full p-1 cursor-pointer w-8 absolute right-2 top-2`} viewBox="0 0 24 24">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5696 7.35351C13.2692 7.0531 12.7821 7.0531 12.4817 7.35351L9.10439 10.7308C8.40344 11.4318 8.40345 12.5682 9.10439 13.2692L12.4817 16.6465C12.7821 16.9469 13.2692 16.9469 13.5696 16.6465C13.87 16.3461 13.87 15.859 13.5696 15.5586L10.1922 12.1813C10.0921 12.0812 10.0921 11.9188 10.1922 11.8187L13.5696 8.44136C13.87 8.14096 13.87 7.65391 13.5696 7.35351Z" fill="#030D45"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.53846C9.83082 3.53846 6.86615 3.73753 5.01495 3.88095C4.40616 3.92811 3.92811 4.40616 3.88095 5.01495C3.73753 6.86615 3.53846 9.83082 3.53846 12C3.53846 14.1692 3.73753 17.1338 3.88095 18.985C3.92811 19.5938 4.40616 20.0719 5.01495 20.1191C6.86615 20.2625 9.83082 20.4615 12 20.4615C14.1692 20.4615 17.1338 20.2625 18.985 20.1191C19.5938 20.0719 20.0719 19.5938 20.1191 18.985C20.2625 17.1338 20.4615 14.1692 20.4615 12C20.4615 9.83082 20.2625 6.86615 20.1191 5.01495C20.0719 4.40616 19.5938 3.92811 18.985 3.88095C17.1338 3.73753 14.1692 3.53846 12 3.53846ZM4.89612 2.34708C6.74819 2.2036 9.76547 2 12 2C14.2345 2 17.2518 2.2036 19.1039 2.34708C20.4686 2.45281 21.5472 3.53141 21.6529 4.89612C21.7964 6.74819 22 9.76547 22 12C22 14.2345 21.7964 17.2518 21.6529 19.1039C21.5472 20.4686 20.4686 21.5472 19.1039 21.6529C17.2518 21.7964 14.2345 22 12 22C9.76547 22 6.74819 21.7964 4.89612 21.6529C3.53141 21.5472 2.45281 20.4686 2.34708 19.1039C2.2036 17.2518 2 14.2345 2 12C2 9.76547 2.2036 6.74819 2.34708 4.89612C2.45281 3.53141 3.53141 2.45281 4.89612 2.34708Z" fill="#030D45"/>
                        </motion.svg>
             
                    </div>

                        <div className="flex flex-col items-center w-3/5 mt-10 pb-10">
                            <img className="w-full max-h-full max-w-full object-cover rounded-md shadow-2xl mb-5" src="/images/7.jpg" alt="profile" />
                            <div className="flex items-center">
                            <span onClick={handleClickProfile} className="cursor-pointer font-black text-lg">{contextUserInfo.username}</span>
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
                        
                        {/* Post Follosers Followings Div */}
                        <div className="flex items-center justify-between pt-5 w-3/5 border-t-2 pb-5 border-b-2">
                            <div className="flex flex-col items-center">
                                <span className="font-black">
                                    {contextUserInfo.postDocId.length}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    Posts
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black">
                                    {contextUserInfo.followers.length}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    Followers
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black">
                                    {contextUserInfo.following.length}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    Followings
                                </span>
                            </div>                   
                        </div>
                        
                        {/* Side Navigataion */}
                        <AnimateSharedLayout>
                        <ol className="w-3/5 flex flex-col items-center mt-14">
                            {sidebarData.map(({svg, title}, i) => (
                                <motion.li 
                                    onClick={() => {
                                        setSelected(i)
                                        if (title === "New Post") {
                                            setModalOpen(true)
                                        }
                                    }}
                                animate
                                className="relative w-full flex items-center cursor-pointer mb-7">
                                    {i === selected ? (
                                        <motion.div
                                            className="underline"
                                            layoutId="underline"
                                            style={{ backgroundColor: "#736578" }}
                                        />
                                        ) : null}
                                    <svg 
                                    className="w-10 ml-5"
                                    fill={`${i === selected ? "black" : "gray"}`}
                                    x="0px" y="0px"
                                    viewBox={svg.viewBox}>
                                        <path d={svg.path} />
                                    </svg>

                                    <motion.span
                                        className={`ml-10 font-bold w-full ease-in duration-300 ${i === selected ? "text-black" : "text-gray-500"} hover:text-black`}>
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
            {modalOpen && <Newpostmodal setOpen={setModalOpen} open={modalOpen} setSelected={setSelected}/>}
    </>
    )
}

export default memo(Sidebar)