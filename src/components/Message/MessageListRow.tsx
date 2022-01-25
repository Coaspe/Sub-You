import { useEffect, useState } from "react";
import { getUserByUserId } from "../../services/firebase";
import { chatRoomInfoType, getUserType } from "../../types";
import { AnimateSharedLayout, motion } from 'framer-motion'
import MessageDetail from "./MessageDetail";

interface MessageListRowProps {
    info: chatRoomInfoType
    chatRoomKey: string
    users: string[]
    unCheckedMessage: number
}

const MessageListRow: React.FC<MessageListRowProps> = ({ info, users, chatRoomKey, unCheckedMessage }) => {

    const [userInfo, setUserInfo] = useState<{ [key: string]: getUserType}>({})
    const [expanded, setExpanded] = useState(false)
    const [time, setTime] = useState("")
    
    useEffect(() => {
        const tmp: { [chatRoomKey: string]: getUserType } = {}
        Promise.all(users.map((user) => (
            getUserByUserId(user)
        )
        ))
        .then((res: any) => {
            res.forEach((userTmp: getUserType) => {
                tmp[userTmp.uid] = userTmp
            })
            setUserInfo((origin: any) => {
                return {...origin, ...tmp}
            })
        })

        
    }, [users])

    useEffect(() => {
        const date = new Date(info.dateCreated)
        setTime(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`)
    }, [info])

    return (
        <>
            <AnimateSharedLayout type="crossfade">
                {userInfo[info.user] &&
                    <>
                    <motion.div whileHover={ {scale : 1.05 }} className="relative items-center w-full justify-between border px-6 py-2 rounded-2xl mb-3 shadow-2xl cursor-pointer">
                        {!expanded && <motion.div className="absolute w-full h-full" onClick={() => { setExpanded((origin) => !origin) }} layoutId="gg"></motion.div>}
                        <div className="flex justify-between w-full items-center">
                        <div className="flex items-center">
                            <img className="rounded-full w-10 h-10" src={userInfo[info.user].profileImg} alt="profile" />
                                <div className="flex flex-col ml-6">
                                    <div className="flex items-center">
                                        <span className="font-black mb-1 text-sm">{userInfo[info.user].username}</span>
                                        <div className={`flex rounded-full items-centers justify-center w-5 h-5 bg-red-600 ${!expanded && unCheckedMessage !== 0 ? "visible" : "hidden"}`}>
                                            <span className="text-sm text-white font-black">{unCheckedMessage}</span>
                                        </div>
                                    </div>
                                <span className="text-xs text-gray-400">{info.message}</span>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">{time}</span>
                        </div>
                    </motion.div>
                
                    {expanded &&
                    <motion.div layoutId="gg" className="absolute w-1/2 h-1/2 bg-main bg-opacity-30 rounded-lg z-50">
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