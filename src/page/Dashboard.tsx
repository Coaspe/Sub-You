import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Alert from '@mui/material/Alert';

import { useDispatch, useSelector } from 'react-redux';
import Header from "../components/Header";
import Timeline from "./Timeline";
import Sidebar from "./Sidebar";
import {useCallback, useContext, useEffect, useState, useRef} from 'react'
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/user";
import { getUserByUserId, getPhotosInfiniteScroll, getTimelinePhotos, SUBSnapShot, getUserByEmail } from "../services/firebase";
import { getUserType, postContent } from "../types";
import ProfileSetting from '../components/Profile/ProfileSetting';
import Artists from '../page/Artists';
import { alertAction, postsAction, userInfoAction } from '../redux';
import { RootState } from '../redux/store';
import Message from '../components/Message/Message';
import Auction from '../components/Auction/Auction';

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
    
    const [value, setValue] = useState(0);
    const [direction, setDirection] = useState(1);
    const { user:contextUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false)
    const [morePostLoading, setMorePostLoading] = useState(false)
    const [selectedPage, setSelectedPage] = useState("Timeline")
    const [postsVisible, setPostsVisible] = useState<(number | boolean)[][]>([])

    // Due to load variable issue from Timeline.tsx
    const [page, setPage] = useState(0)
    const [key, setKey] = useState(0)
    const dispatch = useDispatch()
    
    const alert: [boolean, string, string] = useSelector((state: RootState) => state.setAlert.alert)
    const userInfo: getUserType = useSelector((state: RootState) => state.setUserInfo.userInfo)
    const postSetChanged: (string | boolean)[] = useSelector((state: RootState) => state.setPostSetChanged.postSetChanged)
    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    
    const doSetUserInfo = useCallback((userInfo: getUserType) => {
        dispatch(userInfoAction.setUserInfo({userInfo: userInfo}))
    }, [dispatch])

    const doSetPosts = useCallback((posts: postContent[]) => {
        dispatch(postsAction.setPosts({posts: posts}))
    }, [dispatch])

    const concatPosts = useCallback((posts: postContent[]) => {
        dispatch(postsAction.concatPosts({posts: posts}))
    }, [dispatch])

    const doSetAlert = (alert: [boolean, string, string]) => {
        dispatch(alertAction.setAlert({alert: alert}))
    }

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev) => {return prev + 1});
        }
    }, []);

    const sendQuery = useCallback(async () => {
        try {
            setMorePostLoading(true)
            const res: any = await getPhotosInfiniteScroll(
                contextUser.uid,
                userInfo.following,
                key
            );
            concatPosts(res)
            setKey(res[res.length - 1].dateCreated)
            setPostsVisible((prev) => { return [...prev, [prev.length, true]] })
        }
        catch (err) {
            console.log(err);
        }
        setMorePostLoading(false)
    }, [contextUser.uid, key, userInfo.following, concatPosts]);

    // Supervise userInfo change
    useEffect(() => {
        SUBSnapShot(contextUser.email, doSetUserInfo)
    }, [doSetUserInfo])

    useEffect(() => {
        if (postSetChanged[0] !== "delete") {
            doSetPosts([])
            getTimelinePhotos(contextUser.uid).then((res: any) => {
                if (res.length > 0) {
                    doSetPosts(res)
                    const tmp = []
                    for (let i = 0; i < res.length; i++) {
                        tmp.push([i, true])
                    }
                    setKey(res[res.length - 1].dateCreated)
                    setPostsVisible(tmp)
                }
            })
        }
        
    }, [contextUser, postSetChanged, doSetPosts])

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
            };
        const observer = new IntersectionObserver(handleObserver, option);
        if (divRef.current) observer.observe(divRef.current);
    }, [handleObserver]);

    useEffect(() => {
        if (key !== 0) {
            sendQuery();
        }
    }, [page]);

    const divRef = useRef<HTMLDivElement>(null)
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
                            <Alert severity="success" color="success" onClose={() => { doSetAlert([false, "", ""]) }}>{`${alert[1]}`}</Alert>
                        ) : (alert[2] === 'error' ? (
                                <Alert severity="error" color="error" onClose={() => { doSetAlert([false, "", ""]) }}>{`${alert[1]}`}</Alert>
                            ) : (alert[2] === 'warning' ? (
                                    <Alert severity="warning" color="warning" onClose={() => { doSetAlert([false, "", ""]) }}>{`${alert[1]}`}</Alert>
                                ) : (
                                        <Alert severity="info" color="info" onClose={() => { doSetAlert([false, "", ""]) }}>{`${alert[1]}`}</Alert>
                        )))}
                    </motion.div>
                }
            </AnimatePresence>
            <Header userInfo={userInfo}/>
            <motion.div className="grid grid-cols-7 justify-between mx-auto max-w-screen-lg">
                <Sidebar
                    userInfo={userInfo}
                    sideExpanded={sideExpanded}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                />
                {(selectedPage === "Timeline" || selectedPage === "New Post") &&
                <Timeline
                    sideExpanded={sideExpanded}
                    setIsLoading={setIsLoading}
                    postSetChanged={postSetChanged}
                    postsVisible={postsVisible}
                    setPostsVisible={setPostsVisible}
                />
                }
                {selectedPage === "Setting" &&
                    <ProfileSetting sideExpanded={sideExpanded}  />
                }
                {selectedPage === "Explore" &&
                    <Artists sideExpanded={sideExpanded} />
                }
                {selectedPage === "Message" &&
                    <Message />
                }
                {selectedPage === "Auction" &&
                    <Auction />
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
            {selectedPage === "Timeline" && <div ref={divRef} className={`h-10 w-full absolute bottom-0 flex items-center justify-center`}>
            {morePostLoading && <span>loading...</span>}
            </div>}
        </div>
    );
}

export default Dashboard;