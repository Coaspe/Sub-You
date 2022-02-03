import { useEffect, useState } from "react";
import { getUserByUserId } from "../../services/firebase";
import { chatRoomInfoType, getUserType } from "../../types";
import { AnimateSharedLayout, motion } from 'framer-motion'
import MessageDetail from "./MessageDetail";
import { onValue, ref, update} from "firebase/database"
import { rtDBRef } from "../../lib/firebase"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { lastCheckedTimeAction } from "../../redux";

interface MessageListRowProps {
    info: chatRoomInfoType
    chatRoomKey: string
    users: string[]
}

const MessageListRow: React.FC<MessageListRowProps> = ({ info, users, chatRoomKey }) => {

    const [userInfo, setUserInfo] = useState<{ [key: string]: getUserType}>({})
    const [expanded, setExpanded] = useState(false)
    const [time, setTime] = useState("")
    const [messages, setMessages] = useState<number[]>([])
    const lastCheckedTime: { [key: string]: number } = useSelector((state: RootState) => state.setLastCheckedTime.lastCheckedTime)
    const unCheckedMessage: { [key: string]: number } = useSelector((state: RootState) => state.setLastCheckedTime.unCheckedMessage)
    const dispatch = useDispatch()

    const setUnCheckedMessage = (lastCheckedTime: { [key: string]: number }) => {
        dispatch(lastCheckedTimeAction.setUnCheckedMessage({ TimeOrMessage: lastCheckedTime }))
    }
    
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

    useEffect(() => {
        if (messages.length > 0 && !expanded) {
            let tmp2 = []
            for (let i = 0; i < messages.length; i++) {
                // resource를 아끼기위해 뒤에서부터 탐색
                if (messages[messages.length - (i + 1)] > lastCheckedTime[chatRoomKey]) {
                    tmp2.push(0)
                } else {
                    break
                }
                let tmp = Object.assign({}, unCheckedMessage)
                tmp[chatRoomKey] = tmp2.length
                setUnCheckedMessage({ ...tmp })
            }
        }
    }, [messages])
    
    useEffect(() => {
        onValue(ref(rtDBRef, `chatRooms/${chatRoomKey}/messages`), (snap) => {
            setMessages(Object.keys(snap.val()).map((data)=>(parseInt(data))))
        })
    }, [])

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
                                    <div className="flex">
                                        <span className="font-black mb-1 text-sm mr-2">{userInfo[info.user].username}</span>
                                        <div className={`flex rounded-full items-centers justify-center w-5 h-5 bg-red-600 ${!expanded && (unCheckedMessage[chatRoomKey] !== 0 && unCheckedMessage[chatRoomKey] !== undefined) ? "visible" : "hidden"}`}>
                                            <span className="text-sm text-white font-black">{unCheckedMessage[chatRoomKey]}</span>
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