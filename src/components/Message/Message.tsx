import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { rtDBRef } from "../../lib/firebase"
import { RootState } from "../../redux/store"
import { sendMessage } from "../../services/firebase"
import MessageListRow from "./MessageListRow"

const Message = () => {

    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    const [chatRoomsKeys, setChatRoomsKeys] = useState<string[]>([])
    const [chatRoomInfo, setChatRoomInfo] = useState<any>({})
    const [users, setUsers] = useState<any>({})
    const [noChatRoom, setNoChatRoom] = useState(false)

    // Get user's chat room and listen changes.
    useEffect(() => {
        const UID = "lX8fJDnfFkO1Z6WjqicdVG6QJps1"
        rtDBRef.child(`users/${UID}`).on("value", (snap) => {
            if (snap.exists()) {
                setChatRoomsKeys(snap.val())
                setNoChatRoom(false)
            } else {
                setNoChatRoom(true)
            }
        })
    }, []);

    useEffect(() => {
        if (chatRoomsKeys.length > 0) {
            chatRoomsKeys.forEach((chatRoomKey) => {
                let tm2p: any = {}

                rtDBRef.child(`chatRooms/${chatRoomKey}/users`).on("value", (snap) => {
                    setUsers((origin: any) => {
                        tm2p[chatRoomKey] = snap.val()
                        return {
                            ...origin, ...tm2p
                        }
                    });
                })

                rtDBRef.child(`chatRooms/${chatRoomKey}/messages`).limitToLast(1).on('child_added', (snap) => {
                    tm2p[chatRoomKey] = { dateCreated: parseInt(snap.key as string), ...snap.val(), dummy: Date.now() }
                    setChatRoomInfo((origin: any) => {
                        return {...origin, ...tm2p}
                    })
                })
            })
        }
    }, [chatRoomsKeys])

    return (
    <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
        <div className="w-full font-noto">
            <button onClick={() => {
                sendMessage("-Mt21qOjUbB8yf-oNpqP", "ggg", "zYATTAzchNSMTCQ22CWvu0Iaqgj1")
            }}>ADD</button>
            <span className="text-3xl font-black">Chats</span>
            <div>
                {!noChatRoom ?
                    Object.keys(chatRoomInfo).length > 0 && Object.keys(users).length > 0  ? 
                        Object.keys(chatRoomInfo).map((chatRoomKey: string) => (
                        <MessageListRow
                            info={chatRoomInfo[chatRoomKey]}
                            chatRoomKey={chatRoomKey}
                            users={users[chatRoomKey]} />
                        ))
                        :
                        <div>
                            Loading
                        </div>
                        : null}
            </div>
        </div>
    </motion.div>
    )
}

export default Message