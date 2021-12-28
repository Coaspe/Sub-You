import { getUserPropType, postContent2} from "../types"
import Avatar from '@mui/material/Avatar';
import { getDocFirstImage, getUserByEmail, updateLoggedInUserFollowing, updateFollowedUserFollowers } from "../services/firebase";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import UserContext from "../context/user";

const Artist = ({ user }: getUserPropType) => {

    interface firstImageInfo {
        src: string;
        color: string;
    }

    const [firstSrc, setFirstSrc] = useState<Array<firstImageInfo>>([])
    const [expanded, setExpanded] = useState<boolean>(false)
    const [load, setLoad] = useState(false)
    const [screen, setScreen] = useState(false)
    const { user: contextUser } = useContext(UserContext)
    
    const svgVariant = {
        hover: {
            scale: 1.2
        }
    }
    const cacheImages = async (srcArray: string[]) => {
        const promise = srcArray.map((src: string) => {
            
            return new Promise(function (resolve, reject) {
            const img = new Image();

            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject();
            })
        })

        await Promise.all(promise).then(() => {
            setLoad(true)
        })
    }
    
    const handleExpand = () => {
        setExpanded(!expanded)

        if (firstSrc.length > 0) {
            return
        }

        getUserByEmail(user.userEmail).then((res) => {
            getDocFirstImage(res.postDocId).then((re : postContent2[] | undefined) => {
                
                const x : Array<firstImageInfo> = (re as postContent2[]).map((data) => ({
                    src : data.imageSrc[0],
                    color : data.averageColor[0]
                }))
                setFirstSrc(x)
                const y = x.map((data: firstImageInfo) => (data.src))
                cacheImages(y)
            })
            
        })
    }

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
            <motion.div className="border-2 border-black rounded-md w-full flex flex-col items-center px-3 py-5 justify-between mt-3">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="mr-2" alt="user avatar" src={user.profileImg} />
                        <span>{user.username}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="flex flex-col items-center mr-3">
                            <img className="w-7" src="/images/followers.png" alt="followers" />
                            <span>{user.followers.length}</span>
                        </div>
                        <motion.div
                            className="mr-3"
                            variants={svgVariant}
                            whileHover="hover">
                        <motion.svg
                            onClick={() => {
                                updateLoggedInUserFollowing(contextUser.email, user.uid, false)
                                updateFollowedUserFollowers(user.userEmail, contextUser.uid, false)
                                }}
                                className="w-6 cursor-pointer"
                                fill="red"
                                x="0px" y="0px"
                                viewBox="0 0 490.4 490.4" >
                                <g>
                                    <g>
                                        <path d="M222.5,453.7c6.1,6.1,14.3,9.5,22.9,9.5c8.5,0,16.9-3.5,22.9-9.5L448,274c27.3-27.3,42.3-63.6,42.4-102.1
                                            c0-38.6-15-74.9-42.3-102.2S384.6,27.4,346,27.4c-37.9,0-73.6,14.5-100.7,40.9c-27.2-26.5-63-41.1-101-41.1
                                            c-38.5,0-74.7,15-102,42.2C15,96.7,0,133,0,171.6c0,38.5,15.1,74.8,42.4,102.1L222.5,453.7z M59.7,86.8
                                            c22.6-22.6,52.7-35.1,84.7-35.1s62.2,12.5,84.9,35.2l7.4,7.4c2.3,2.3,5.4,3.6,8.7,3.6l0,0c3.2,0,6.4-1.3,8.7-3.6l7.2-7.2
                                            c22.7-22.7,52.8-35.2,84.9-35.2c32,0,62.1,12.5,84.7,35.1c22.7,22.7,35.1,52.8,35.1,84.8s-12.5,62.1-35.2,84.8L251,436.4
                                            c-2.9,2.9-8.2,2.9-11.2,0l-180-180c-22.7-22.7-35.2-52.8-35.2-84.8C24.6,139.6,37.1,109.5,59.7,86.8z"/>
                                    </g>
                                </g>
                            </motion.svg>
                        </motion.div>
                        <img className="w-6 cursor-pointer" src="/images/down-arrow.png" alt="down arrow" onClick={handleExpand} />
                    </div>
                </div>
                <AnimatePresence initial={false}>
                    {expanded && load && firstSrc !== [] ? 
                        (
                            <motion.div
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, height:0 }}
                                className="w-full grid grid-cols-2 gap-2 px-3 grid-col-center justify-items-center ">
                            {firstSrc.map((data) => (
                                <motion.div
                                    style={{backgroundColor : data.color}}
                                    whileHover={{scale : 1.2}}
                                    initial={{opacity : 0, height:0}}
                                    animate={{ opacity: 1, height: screen ? 256 : 128}}
                                    exit={{ opacity: 0, height:0 }}
                                    className="w-full h-full flex items-center justify-center">
                                        <motion.img
                                            className="max-h-full max-w-full" src={data.src} alt="sss" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )
                            : null}
                </AnimatePresence>
            </motion.div>
    )
}

export default Artist