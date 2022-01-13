import { motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { rtDBRef } from "../../lib/firebase"
import { lastCheckedTimeAction } from "../../redux"
import { RootState } from "../../redux/store"
import { sendMessage } from "../../services/firebase"
import MessageListRow from "./MessageListRow"

const Message = () => {

    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    const [chatRoomsKeys, setChatRoomsKeys] = useState<string[]>([])
    const [chatRoomInfo, setChatRoomInfo] = useState<any>({})
    const [users, setUsers] = useState<any>({})
    const [noChatRoom, setNoChatRoom] = useState(false)
    const dispatch = useDispatch()
    const lastCheckedTime: { [key: string]: number } = useSelector((state: RootState) => state.setLastCheckedTime.lastCheckedTime)
    const [changed, setChanged] = useState("")
    const [unCheckedMessage, setUnCheckedMessage] = useState<{ [key: string]: number }>({})

    const setLastCheckedTime = (lastCheckedTime: { [key: string]: number }) => {
        dispatch(lastCheckedTimeAction.setLastCheckedTime({ lastCheckedTime: lastCheckedTime }))
    }
    useEffect(() => {
        console.log("Effect LastCheckedTime", lastCheckedTime);
        
    }, [lastCheckedTime])

    useEffect(() => {
        console.log("Effect LastCheckedTime", unCheckedMessage);
        
    },[unCheckedMessage])
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



    //Off 처리 해야함
    useEffect(() => {
        if (Object.keys(lastCheckedTime).length > 0 && changed !== "" && changed !== '1') {
            rtDBRef.child(`chatRooms/${changed}/messages`).on('value', (snap) => {
            console.log(lastCheckedTime);
            let tmp = Object.keys(snap.val()).map((date) => (parseInt(date)))
            let tmp2 = []
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[tmp.length - (i + 1)] > lastCheckedTime[changed]) {
                    tmp2.push(0)
                }
            }
                setChanged('1')
                console.log(tmp2);
                
            setUnCheckedMessage((origin) => {
                let tmp = Object.assign({}, origin)
                tmp[changed] = tmp2.length
                return tmp
            })
        })
    }
    }, [lastCheckedTime])
    
    useEffect(() => {
        console.log("lastCheckedTime", lastCheckedTime);
        
        // LastCheckedTime이 바뀐 Chat Room만 on을 실행하도록 바꿔야한다.
        if (Object.keys(lastCheckedTime).length > 0 && changed === "") {
            console.log("Execute");
            console.log(changed);
            
            Object.keys(lastCheckedTime).forEach((key) => {
                rtDBRef.child(`chatRooms/${key}/messages`).on('value', (snap) => {
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
                    
                })
            })
        }
        
        }, [lastCheckedTime])
    
    
    useEffect(()=> {

        rtDBRef.child(`lastCheckedTime`).on('value', (snap) => {
            setLastCheckedTime(snap.val())
            console.log("136line ",snap.val());
        })
        rtDBRef.child(`lastCheckedTime`).on('child_changed', (snap) => { 
            const key: string = snap.key as string
            setChanged(key)
        })
        

    }, [])
    
    return (
    <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
        <div className="w-full font-noto">
            <button onClick={() => {
                sendMessage("-Mt21qOjUbB8yf-oNpqP", "ggg", "zYATTAzchNSMTCQ22CWvu0Iaqgj1")
            }}>ADD</button>
            <span className="text-3xl font-black">Chats</span>
            <div>
                {!noChatRoom ?
                    Object.keys(chatRoomInfo).length > 0 && Object.keys(users).length === Object.keys(chatRoomInfo).length ? 
                        Object.keys(chatRoomInfo).map((chatRoomKey: string) => (
                        <MessageListRow
                            info={chatRoomInfo[chatRoomKey]}
                            chatRoomKey={chatRoomKey}
                            users={users[chatRoomKey]}
                            unCheckedMessage={unCheckedMessage[chatRoomKey]} />
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