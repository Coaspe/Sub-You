import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { rtDBRef } from "../../lib/firebase"
import { RootState } from "../../redux/store"
import { makeMessageRoom, sendMessage } from "../../services/firebase"
import { chatRoomInfoType } from "../../types"
import MessageListRow from "./MessageListRow"

const Message = () => {

    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    const [chatRoomsKeys, setChatRoomsKeys] = useState<string[]>([])
    const [chatRoomInfo, setChatRoomInfo] = useState<any>({})
    const [chatRoomInfoArr, setChatRoomInfoArr] = useState<chatRoomInfoType[]>([])
    const [users, setUsers] = useState<Array<string>>([])

    useEffect(() => {
        const UID = "lX8fJDnfFkO1Z6WjqicdVG6QJps1"
        rtDBRef.child(`users/${UID}`).on("value", (snap) => {
            setChatRoomsKeys(snap.val())
        })
    }, []);

    useEffect(() => {
        if (chatRoomsKeys.length > 0) {
            let tm2p: any = {}
            chatRoomsKeys.forEach((key) => {

                rtDBRef.child(`chatRooms/${key}/users`).on("value", (snap) => {
                    setUsers(snap.val());
                })

                rtDBRef.child(`chatRooms/${key}/messages`).limitToLast(1).on('child_added', (snap, asdf) => {
                    tm2p[key] = { dateCreated: parseInt(snap.key as string), ...snap.val(), dummy: Date.now() }
                    setChatRoomInfo(() => {
                        console.log("Inside Use state : ", tm2p);
                        return tm2p
                    })
                })
            })
        }
    }, [chatRoomsKeys])

    useEffect(() => {
        const tmp = Object.values(chatRoomInfo)
        const tmp_key = Object.keys(chatRoomInfo)
        const tt: chatRoomInfoType[] = tmp.map((data: any, index: any) => ([tmp_key[index], data]))
        setChatRoomInfoArr(tt)
    }, [chatRoomInfo])
    
    return (
    <motion.div className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
        <div className="w-full font-noto">
                <span className="text-3xl font-black">Chats</span>
                <div>
                {chatRoomInfoArr.length === chatRoomsKeys.length && users.length > 0 ? 
                    chatRoomInfoArr.map((data) => (
                        <MessageListRow
                            info={data}
                            users={users} />
                    ))   
                 : null}
                </div>
                <button onClick={() => {
                    sendMessage("-Mt21qOjUbB8yf-oNpqP", "asdawd", "zYATTAzchNSMTCQ22CWvu0Iaqgj1")
                }}>ADD</button>
        </div>
    </motion.div>
    )
}

export default Message