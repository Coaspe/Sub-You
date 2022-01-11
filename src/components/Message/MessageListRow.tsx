import { useEffect, useState } from "react";
import { getUserByUserId } from "../../services/firebase";
import { chatRoomInfoType, getUserType } from "../../types";
import { AnimateSharedLayout, motion } from 'framer-motion'
import MessageDetail from "./MessageDetail";

interface MessageListRowProps {
    info: chatRoomInfoType
    chatRoomKey: string
    users: string[]
}

const MessageListRow: React.FC<MessageListRowProps> = ({ info, users, chatRoomKey }) => {
    const [userInfo, setUserInfo] = useState<{ [key: string]: getUserType}>({})
    const [expanded, setExpanded] = useState(false)
    
    useEffect(() => {
        const tmp: { [chatRoomKey: string]: getUserType } = {}
        Promise.all(users.map((user) => (
            getUserByUserId(user)
        )
        ))
        .then((res: any) => {
            res.forEach((user: getUserType) => {
                console.log("user", user);
                tmp[user.uid] = user
            })
            setUserInfo((origin: any) => {
                console.log({...origin, ...tmp});
                
                return {...origin, ...tmp}
            })
        })
    }, [users])
    
    return (
        <>
            <AnimateSharedLayout type="crossfade">
                {userInfo[info.user] &&
                    <>
                    <motion.div whileHover={ {scale : 1.05 }} className="relative items-center w-full justify-between border px-6 py-2 rounded-2xl mb-3 shadow-lg cursor-pointer">
                        {!expanded && <motion.div className="absolute w-full h-full" onClick={() => { setExpanded((origin) => !origin) }} layoutId="gg"></motion.div>}
                        <div className="flex justify-between w-full items-center">
                        <div className="flex items-center">
                            <img className="rounded-full w-10 h-10" src={userInfo[info.user].profileImg} alt="profile" />
                            <div className="flex flex-col ml-6">
                                <span className="font-black mb-1">{userInfo[info.user].username}</span>
                                <span className="text-xs text-gray-400">{info.message}</span>
                            </div>
                        </div>
                        <span className="text-xs">{info.dateCreated}</span>
                        </div>
                    </motion.div>
                
                    {expanded &&
                    <motion.div layoutId="gg" className="absolute w-1/2 h-1/2 bg-white rounded-lg z-50">
                            <MessageDetail info={info} chatRoomKey={chatRoomKey} user={userInfo} setExpanded={setExpanded}/>
                    </motion.div>
                    }
                    </>
                }
            </AnimateSharedLayout>
        </>
    )
}

export default MessageListRow