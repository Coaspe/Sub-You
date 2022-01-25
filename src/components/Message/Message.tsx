import { onValue, query, ref, onChildAdded, onChildChanged, limitToLast} from "firebase/database"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { rtDBRef } from "../../lib/firebase"
import { lastCheckedTimeAction } from "../../redux"
import { RootState } from "../../redux/store"
import MessageListRow from "./MessageListRow"
import MessageSkeleton from "./MessageSkeleton"

const Message = () => {

    const [chatRoomsKeys, setChatRoomsKeys] = useState<string[]>([])
    const [chatRoomInfo, setChatRoomInfo] = useState<any>({})
    const [users, setUsers] = useState<any>({})
    const [noChatRoom, setNoChatRoom] = useState(false)
    const dispatch = useDispatch()
    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    const lastCheckedTime: { [key: string]: number } = useSelector((state: RootState) => state.setLastCheckedTime.lastCheckedTime)
    const [changed, setChanged] = useState("")
    const [unCheckedMessage, setUnCheckedMessage] = useState<{ [key: string]: number }>({})

    const setLastCheckedTime = (lastCheckedTime: { [key: string]: number }) => {
        dispatch(lastCheckedTimeAction.setLastCheckedTime({ lastCheckedTime: lastCheckedTime }))
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
        // At first
        if (Object.keys(lastCheckedTime).length > 0 && changed === "") {
            
            Object.keys(lastCheckedTime).forEach((key) => {
                onValue(ref(rtDBRef, `chatRooms/${key}/messages`), (snap) => {
                    let tmp = Object.keys(snap.val()).map((date) => (parseInt(date)))
                    
                    let tmp2 = []
                    for (let i = 0; i < tmp.length; i++) {
                        if (tmp[tmp.length - (i + 1)] > lastCheckedTime[key]) {
                            tmp2.push(0)
                        } else {
                            break
                        }
                    }
                    setUnCheckedMessage((origin) => {
                        let tmp = Object.assign({}, origin)
                        tmp[key] = tmp2.length
                        return {...unCheckedMessage, ...tmp}
                    })
                });
            })
        } else {
            // When LastCheckedTime change event occurs
                if (Object.keys(lastCheckedTime).length > 0 && changed !== "" && changed !== '1') {
                onValue(ref(rtDBRef, `chatRooms/${changed}/messages`), (snap) => {
                    let tmp = Object.keys(snap.val()).map((date) => (parseInt(date)))
                    let tmp2 = []
                    for (let i = 0; i < tmp.length; i++) {
                        if (tmp[tmp.length - (i + 1)] > lastCheckedTime[changed]) {
                            tmp2.push(0)
                        }
                    }
                        setChanged('1')
                        
                    setUnCheckedMessage((origin) => {
                        let tmp = Object.assign({}, origin)
                        tmp[changed] = tmp2.length
                        return tmp
                    })
                });
            }
        }
    }, [lastCheckedTime])
    
    
    useEffect(() => {
        onValue(ref(rtDBRef, 'lastCheckedTime'), (snap) => {
            setLastCheckedTime(snap.val())
        });
        onChildChanged(ref(rtDBRef, 'lastCheckedTime'), (snap) => {
            const key: string = snap.key as string
            setChanged(key)
        });
    }, [])
    
    return (
    <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
        <div className="w-full font-noto">
            <span className="text-3xl font-black">Chats</span>
            <div className="mt-5">
                {!noChatRoom ?
                    (Object.keys(chatRoomInfo).length > 0 && Object.keys(users).length === Object.keys(chatRoomInfo).length) ? 
                        Object.keys(chatRoomInfo).map((chatRoomKey: string) => (
                        <MessageListRow
                            info={chatRoomInfo[chatRoomKey]}
                            chatRoomKey={chatRoomKey}
                            users={users[chatRoomKey]}
                            unCheckedMessage={unCheckedMessage[chatRoomKey]} />
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