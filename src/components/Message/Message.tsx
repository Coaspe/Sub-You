import { onValue, query, ref, onChildAdded, onChildChanged, limitToLast} from "firebase/database"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { rtDBRef } from "../../lib/firebase"
import { lastCheckedTimeAction } from "../../redux"
import { RootState } from "../../redux/store"
import { sendMessage } from "../../services/firebase"
import MessageListRow from "./MessageListRow"
import MessageSkeleton from "./MessageSkeleton"

const Message = () => {

    const [chatRoomsKeys, setChatRoomsKeys] = useState<string[]>([])
    const [chatRoomInfo, setChatRoomInfo] = useState<any>({})
    const [users, setUsers] = useState<any>({})
    const [noChatRoom, setNoChatRoom] = useState(false)
    const dispatch = useDispatch()
    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)


    const setLastCheckedTime = (lastCheckedTime: { [key: string]: number }) => {
        dispatch(lastCheckedTimeAction.setLastCheckedTime({ TimeOrMessage: lastCheckedTime }))
    }

    // Get user's chat room and listen changes.
    useEffect(() => {
        window.scrollTo(0,0)
        const UID = "lX8fJDnfFkO1Z6WjqicdVG6QJps1"
        onValue(ref(rtDBRef, `users/${UID}`), (snap) => {
            if (snap.exists()) {
                setChatRoomsKeys(snap.val())
                setNoChatRoom(false)
            } else {
                setNoChatRoom(true)
            }
        });
    }, []);

    useEffect(() => {
        if (chatRoomsKeys.length > 0) {  
            chatRoomsKeys.forEach((chatRoomKey) => {
                let tm2p: any = {}
                onValue(ref(rtDBRef, `chatRooms/${chatRoomKey}/users`), (snap) => {
                    setUsers((origin: any) => {
                        tm2p[chatRoomKey] = snap.val()
                        return {
                            ...origin, ...tm2p
                        }
                    });
                });
                const q = query(ref(rtDBRef, `chatRooms/${chatRoomKey}/messages`), limitToLast(1));
                onChildAdded(q, (snap) => {
                    tm2p[chatRoomKey] = { dateCreated: parseInt(snap.key as string), ...snap.val(), dummy: Date.now() }
                    setChatRoomInfo((origin: any) => {
                        return {...origin, ...tm2p}
                    })
                });
            })
        }

    }, [chatRoomsKeys])
    
    useEffect(() => {
        onValue(ref(rtDBRef, 'lastCheckedTime'), (snap) => {
            setLastCheckedTime(snap.val())
        });

    }, [])

    return (
    <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
            <div className="w-full font-noto">
                <button
                onClick={()=>{
                    sendMessage("-Mt21qOjUbB8yf-oNpqP", "fff", "lX8fJDnfFkO1Z6WjqicdVG6QJps1")
                }}
                >
                    test
                </button>
            <span className="text-3xl font-black">Chats</span>
            <div className="mt-5">
                {!noChatRoom ?
                    (Object.keys(chatRoomInfo).length > 0 && Object.keys(users).length === Object.keys(chatRoomInfo).length) ? 
                        Object.keys(chatRoomInfo).map((chatRoomKey: string) => (
                        <MessageListRow
                            key={chatRoomKey}
                            info={chatRoomInfo[chatRoomKey]}
                            chatRoomKey={chatRoomKey}
                            users={users[chatRoomKey]}
                            />
                        ))
                        :
                    <div>
                        <MessageSkeleton />
                        <MessageSkeleton />
                        <MessageSkeleton />
                        <MessageSkeleton />
                        <MessageSkeleton />
                    </div>
                : null}
            </div>
        </div>
    </motion.div>
    )
}

export default Message