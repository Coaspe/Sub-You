import { useContext, useEffect, useState } from "react"
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
            return [...origin, info]
        })
        return ()=>{console.log(info)}
    }, [info])

    return (
        <>
            {messages !== [] ?
                <div className="w-full h-full flex flex-col justify-between">
                    <div className="grid grid-cols-3 overflow-y-scroll gap-2">
                        <span></span>
                        <span className="place-self-center">우람이뭐하니</span>
                        <img onClick={() => {
                            updateLastCheckedTime(chatRoomKey, info.dateCreated)
                            setExpanded((origin) => !origin)
                        }} className="w-5 place-self-end cursor-pointer" src="/images/close.png" alt="close chatroom" />
                        {messages.map((msg: any) => (
                            <MessageRow src={user[msg.user].profileImg} message={msg.message} user={user[msg.user]} />
                        ))}
                    </div>
                    <div className="flex">
                        <input onChange={(e:any) => {
                            setText(e.target.value)
                        }} type="text" className="border-2"/>
                        <button onClick={() => {
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
