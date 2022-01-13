import { AnimatePresence } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react"
import UserContext from "../../context/user";
import { rtDBRef } from "../../lib/firebase";
import { sendMessage, updateLastCheckedTime } from "../../services/firebase";
import { chatRoomInfoType, getUserType } from "../../types"
import MessageRow from "./MessageRow";

interface MessageDetailProps {
    info: chatRoomInfoType
    chatRoomKey: string
    user: { [key: string]: getUserType }
    setExpanded:React.Dispatch<React.SetStateAction<boolean>>
}

const MessageDetail: React.FC<MessageDetailProps> = ({ info, chatRoomKey, user, setExpanded }) => {
    
    const [messages, setMessages] = useState<any>([])
    const [text, setText] = useState("")
    const { user: contextUser } = useContext(UserContext)
    const enterRef = useRef<HTMLButtonElement | null>(null)
    useEffect(() => {
        const getMessages = (key: string) => {
        rtDBRef
            .child(`chatRooms/${key}/messages`)
            .orderByChild("dateCreated")
            .once("value", (snap) => {
                console.log(snap.val());
                setMessages(Object.values(snap.val()))
            })
        }
        if (chatRoomKey !== undefined && messages !== []) {
            getMessages(chatRoomKey)
        }
    }, [])

    useEffect(() => {
        setMessages((origin: any) => {
            if (origin[origin.length - 1].dateCreated !== info.dateCreated)
            {
                return [...origin, info]
            } else {
                return origin
            }
        })
    }, [info])

    const handleKeypress = (e: any) => {
        if (e.key === 'Enter') {
            enterRef.current?.click()
        }
    };

    return (
        <>
            {messages !== [] ?
                <div className="w-full h-full flex flex-col justify-between items-center">
                    <div className="grid grid-cols-3 overflow-y-scroll gap-2">
                        <span></span>
                        <span className="place-self-center">우람이뭐하니</span>
                        <img onClick={() => {
                            updateLastCheckedTime(chatRoomKey, info.dateCreated)
                            setExpanded((origin) => !origin)
                        }} className="w-5 place-self-end cursor-pointer mr-3" src="/images/close.png" alt="close chatroom" />
                        <AnimatePresence>
                            {messages.map((msg: any) => (
                                <MessageRow key={`${msg.dateCreated}+${msg.user}`} src={user[msg.user].profileImg} message={msg.message} user={user[msg.user]} />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="flex">
                        <input
                            value={text}
                            onKeyPress={handleKeypress}
                            onChange={(e: any) => {
                            setText(e.target.value)
                        }} type="text" className="border-2"/>
                        <button
                            ref={enterRef}
                            onClick={() => {
                                sendMessage(chatRoomKey, text, contextUser.uid)
                                setText("")
                            }}>submit</button>
                    </div>    
                </div>
          : null}  
        </>
    )
}

export default MessageDetail
