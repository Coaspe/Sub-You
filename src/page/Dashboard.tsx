import Header from "../components/Header";
import Timeline from "./Timeline";
import Sidebar from "./Sidebar";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {useContext, useEffect, useState} from 'react'
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import UserContext from "../context/user";
import { getUserByUserId } from "../services/firebase";
import { getUserType } from "../types";


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
    const { user: contextUser } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState<getUserType>({} as getUserType)
    const [sideExpanded, setSideExpanded] = useState(true)
    useEffect(() => {
        const dashboardInit = async () => {
            await getUserByUserId(contextUser.uid).then((res: any) => {
                setUserInfo(res)
            })
        }
        dashboardInit()
    }, [contextUser.uid])

    return (
        <div className="w-full h-full">
            <Header userInfo={userInfo}/>
            <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
                    <Sidebar userInfo={userInfo} setSideExpanded={setSideExpanded} sideExpanded={sideExpanded}/>
                    <Timeline sideExpanded={sideExpanded} />
            </div>
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
                    }}
>
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