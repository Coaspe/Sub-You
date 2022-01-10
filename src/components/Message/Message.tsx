import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { rtDBRef } from "../../lib/firebase"
import { RootState } from "../../redux/store"
import { makeMessageRoom, sendMessage } from "../../services/firebase"

const Message = () => {

    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    const [chatRoomsKeys, setChatRoomsKeys] = useState<string[]>([])
    const [chatRoomInfo, setChatRoomInfo] = useState<any>({})
    const [xx, setXx] = useState(0)
    useEffect(() => {
        const UID = "lX8fJDnfFkO1Z6WjqicdVG6QJps1"
        rtDBRef.child(`users/${UID}`).on("value", (snap) => {
            setChatRoomsKeys(snap.val())
        })
    }, []);

    useEffect(() => {
        console.log("useEffect chatRoomInfo", chatRoomInfo);
    }, [chatRoomInfo])

       useEffect(() => {
        console.log("useEffect xx", xx);
    }, [xx])
    // useEffect(() => {
    //     if (chatRoomsKeys.length > 0) {
    //         let tmp: any = {}
    //         chatRoomsKeys.forEach((key) => {
    //             tmp[key] = {}
    //             rtDBRef.child(`chatRooms/${key}/messages`).limitToLast(1).get().then((res) =>{
    //                 res.forEach((data) => {
    //                     tmp[key] = { dateCreated: data.key, ...data.val() }
    //                 })
    //             })
    //         })
    //         setChatRoomInfo(tmp)
    //     }
    // }, [chatRoomsKeys])
    // [[key,],[]]
    useEffect(() => {
        if (chatRoomsKeys.length > 0) {
            let tm2p: any = {}
            chatRoomsKeys.forEach((key) => {
                rtDBRef.child(`chatRooms/${key}/messages`).on('child_added', (snap, asdf) => {
                    tm2p[key] = { dateCreated: parseInt(snap.key as string), dummy: xx,...snap.val() }
                    console.log(chatRoomInfo);
                    console.log(tm2p);
                    setChatRoomInfo(() => {
                        console.log("Inside Use state : ", tm2p);
                        return tm2p
                    })
                    setXx((xx)=>{return xx + 1})
                })
            })
        }
    },[chatRoomsKeys])

    return (
    <motion.div className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
        {chatRoomInfo["-Mt21qOjUbB8yf-oNpqP"] && chatRoomInfo["-Mt21qOjUbB8yf-oNpqP"].dateCreated && <span>{chatRoomInfo["-Mt21qOjUbB8yf-oNpqP"].dateCreated}</span>}
            <button
            onClick={() => {
                sendMessage("-Mt21qOjUbB8yf-oNpqP", "aaaa", "lX8fJDnfFkO1Z6WjqicdVG6QJps1")
            }}
            >sdfsef</button>
            <button
            onClick={() => {
                makeMessageRoom(["lX8fJDnfFkO1Z6WjqicdVG6QJps1", "zYATTAzchNSMTCQ22CWvu0Iaqgj1"])
            }}
            >make</button>
    </motion.div>
    )
}

export default Message