import { onValue, query, ref, onChildAdded, limitToLast} from "firebase/database"
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
                // 채팅방 안에 있는 유저의 수를 감시
                onValue(ref(rtDBRef, `chatRooms/${chatRoomKey}/users`), (snap) => {
                    setUsers((origin: any) => {
                        tm2p[chatRoomKey] = snap.val()
                        return {
                            ...origin, ...tm2p
                        }
                    });
                });

                // MessageListRow가 가장 최근의 메세지를 보여주기 위해 message를 감시
                const q = query(ref(rtDBRef, `chatRooms/${chatRoomKey}/messages`), limitToLast(1));
                onChildAdded(q, (snap) => {
                    tm2p[chatRoomKey] = { dateCreated: parseInt(snap.key as string), ...snap.val() }
                    setChatRoomInfo((origin: any) => {
                        return {...origin, ...tm2p}
                    })
                });
            })

        }

    }, [chatRoomsKeys])
    
    useEffect(() => {
        // 채팅방을 가장 최근에 확인한 시간을 받아온다.
        onValue(ref(rtDBRef, 'lastCheckedTime'), (snap) => {
            setLastCheckedTime(snap.val())
        });
    }, [])

    return (
    <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
            <div className="w-full font-noto">
            <span className="text-3xl font-black">Chats</span>
            <div className="mt-5">
                {!noChatRoom ?
                    Object.keys(chatRoomInfo).length > 0 && chatRoomsKeys.length > 0 &&  chatRoomsKeys.length === Object.keys(users).length ? 
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