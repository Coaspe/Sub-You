import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Alert from '@mui/material/Alert';

import Header from "../components/Header";
import Timeline from "./Timeline";
import Sidebar from "./Sidebar";
import {useContext, useEffect, useState} from 'react'
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/user";
import { getUserByUserId, getPhotos } from "../services/firebase";
import { getUserType, postContent, userInfoFromFirestore } from "../types";
import ProfileSetting from '../components/Profile/ProfileSetting';
import firebase from 'firebase/compat';
import Artists from '../page/Artists';

const variants = {
  enter: {
    y: 0, 
    opacity: 0
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1
  },
  exit: {
    y:-50,
    zIndex: 0,
    opacity: 0
  },
};

const Dashboard = () => {
    
    const [alert, setAlert] = useState<[boolean, string, string]>([false, "", ""])
    const [value, setValue] = useState(0);
    const [direction, setDirection] = useState(1);
    const { user: contextUser } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState<getUserType>({} as getUserType)
    const [sideExpanded, setSideExpanded] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [postSetChanged, setPostSetChanged] = useState<(string | boolean)[]>(["", false]);
    const [selectedPage, setSelectedPage] = useState("Timeline")
    const [posts, setPosts] = useState<postContent[]>([]);
    const [postsVisible, setPostsVisible] = useState<(number | boolean)[][]>([])
  
    useEffect(() => {
        const dashboardInit = async () => {
            await getUserByUserId(contextUser.uid).then((res: any) => {
                setUserInfo(res)
            })
        }
        dashboardInit()
    }, [contextUser.uid])

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

        if (postSetChanged[0] !== "delete") {
            setPosts([])
            getTimelinePhotos().then((res: any) => {
                setPosts(res)
                const tmp = []
                for (let i = 0; i < res.length; i++) {
                    tmp.push([i, true])
                }
              setPostsVisible(tmp)
            })
        }
        
    }, [contextUser, postSetChanged])

    const alertVariants = {
        initial: {
            opacity: 0,
            y:-10
        },
        animate: {
            opacity: 1,
            y:0
        },
        exit: {
            opacity: 0,
            y:-10
        }
    }

    return (
        <div className="w-full h-full relative bg-opacity-10 bg-main">
            <AnimatePresence>
                {alert[1] && alert[0] &&
                    <motion.div
                        variants={alertVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="top-10 translate-x-2/4 left-1/4 w-1/2 z-50 fixed">
                        {alert[2] === 'success' ? (
                            <Alert severity="success" color="success" onClose={() => { setAlert([false, "", ""]) }}>{`${alert[1]} is complete!!!`}</Alert>
                        ) : (alert[2] === 'error' ? (
                                <Alert severity="error" color="error" onClose={() => { setAlert([false, "", ""]) }}>{`${alert[1]} is failed!!!`}</Alert>
                            ) : (alert[2] === 'warning' ? (
                                    <Alert severity="warning" color="warning" onClose={() => { setAlert([false, "", ""]) }}>This is a warning alert — check it out!</Alert>
                                ) : (
                                        <Alert severity="info" color="info" onClose={() => { setAlert([false, "", ""]) }}>This is a info alert — check it out!</Alert>
                        )))}
                    </motion.div>
                }
            </AnimatePresence>
            <Header userInfo={userInfo}/>
            <motion.div className="grid grid-cols-7 justify-between mx-auto max-w-screen-lg">
                <Sidebar
                    userInfo={userInfo}
                    sideExpanded={sideExpanded}
                    setSideExpanded={setSideExpanded}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setPostSetChanged={setPostSetChanged}
                    setAlert={setAlert}
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                />
                {(selectedPage === "Timeline" || selectedPage === "New Post") &&
                    <Timeline
                        sideExpanded={sideExpanded}
                        setIsLoading={setIsLoading}
                        posts={posts}
                        postsVisible={postsVisible}
                        setPostsVisible={setPostsVisible}
                        postSetChanged={postSetChanged}
                        setPostSetChanged={setPostSetChanged}
                        setAlert={setAlert}
                    />
                }
                {selectedPage === "Setting" &&
                    <ProfileSetting sideExpanded={sideExpanded}  />
                }
                {selectedPage === "Explore" &&
                    <Artists sideExpanded={sideExpanded} />
                }
            </motion.div>
            <AnimatePresence initial={false}>
                {direction > 0 ?
                    <motion.div
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full fixed bottom-0 z-50 md:hidden lg:hidden xl:hidden 2xl:hidden"
                    dragConstraints={{ top:0, bottom:50 }}
                    transition={{
                        y: { type: "spring", stiffness: 300, damping: 30 },
                    }}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <BottomNavigationAction label="" icon={<RestoreIcon />} />
                        <BottomNavigationAction label="" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="" icon={<LocationOnIcon />} />
                        <BottomNavigationAction label="" icon={<LocationOnIcon />} />
                        <BottomNavigationAction label="" icon={<LocationOnIcon />} />
                    </BottomNavigation>
                </motion.div> : null}
            </AnimatePresence>
        </div>
    );
}

export default Dashboard;