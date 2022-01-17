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
    const enterRef = useRef<HTMLDivElement | null>(null)

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
                <div className="w-full h-full flex flex-col justify-between items-center bg-chatWhite shadow-lg rounded-lg">
                    <div className="grid grid-cols-3 w-full my-3 items-center">
                        <span className="place-self-center col-start-2">우람이뭐하니</span>
                        <img onClick={() => {
                            updateLastCheckedTime(chatRoomKey, info.dateCreated)
                            setExpanded((origin) => !origin)
                        }} className="w-5 place-self-end cursor-pointer mr-3" src="/images/close.png" alt="close chatroom" />
                    </div>
                    <div className="grid grid-cols-3 overflow-y-scroll w-full px-10 gap-2 shadow-inner">
                        <div></div>
                        <AnimatePresence>
                            {messages.map((msg: any) => (
                                <MessageRow key={`${msg.dateCreated}+${msg.user}`} src={user[msg.user].profileImg} message={msg.message} user={user[msg.user]} />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="flex w-full items-center justify-around bg-white py-3">
                        <svg x="0px" y="0px"
                            className="w-5"
                            fill="#b4b9bb"
                            viewBox="0 0 230.629 230.629" >
                        <path d="M230.629,59.325H0v150.989h230.629V59.325z M115.314,183.373c-26.814,0-48.553-21.738-48.553-48.554
                            c0-26.814,21.738-48.553,48.553-48.553s48.555,21.739,48.555,48.553C163.869,161.635,142.129,183.373,115.314,183.373z
                            M88.041,20.315h54.547l17.943,28.93H70.1L88.041,20.315z M144.447,134.819c0,16.089-13.043,29.133-29.133,29.133
                            c-16.088,0-29.131-13.044-29.131-29.133c0-16.089,13.043-29.132,29.131-29.132C131.404,105.688,144.447,118.73,144.447,134.819z"/>
                        </svg>

                        <input
                            value={text}
                            onKeyPress={handleKeypress}
                            onChange={(e: any) => {
                                setText(e.target.value)
                            }}
                            type="text"
                            placeholder="Type a message here ..."
                            className="py-2 px-3 rounded-xl text-sm w-2/3" />
                        <div
                            ref={enterRef}
                            onClick={() => {
                                if (text !== "") {
                                    sendMessage(chatRoomKey, text, contextUser.uid)
                                    setText("")
                                }
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-chatWhite cursor-pointer">
                            <svg  x="0px" y="0px"
                                className="w-6"
                                fill="gray"
                                viewBox="0 0 60.083 60.083" >
                            <path d="M60.049,10.871c0-0.002-0.001-0.005-0.001-0.007c-0.023-0.125-0.066-0.239-0.132-0.343
                                c-0.001-0.001-0.001-0.003-0.001-0.004c-0.001-0.002-0.003-0.003-0.004-0.005c-0.063-0.098-0.139-0.182-0.232-0.253
                                c-0.019-0.015-0.039-0.026-0.059-0.04c-0.075-0.049-0.152-0.09-0.239-0.117c-0.055-0.019-0.111-0.025-0.168-0.034
                                c-0.044-0.006-0.083-0.026-0.129-0.026H59.08c-0.039-0.001-0.066,0.003-0.094,0.006c-0.009,0.001-0.017,0-0.026,0.001
                                c-0.009,0.001-0.019,0-0.029,0.002c-0.027,0.004-0.054,0.008-0.08,0.014L0.798,22.062c-0.413,0.086-0.729,0.421-0.788,0.839
                                s0.15,0.828,0.523,1.025l16.632,8.773l2.917,16.187c-0.002,0.012,0.001,0.025,0,0.037c-0.01,0.08-0.011,0.158-0.001,0.237
                                c0.005,0.04,0.01,0.078,0.02,0.117c0.023,0.095,0.06,0.184,0.11,0.268c0.01,0.016,0.01,0.035,0.021,0.051
                                c0.003,0.005,0.008,0.009,0.012,0.013c0.013,0.019,0.031,0.034,0.046,0.053c0.047,0.058,0.096,0.111,0.152,0.156
                                c0.009,0.007,0.015,0.018,0.025,0.025c0.015,0.011,0.032,0.014,0.047,0.024c0.061,0.04,0.124,0.073,0.191,0.099
                                c0.027,0.01,0.052,0.022,0.08,0.03c0.09,0.026,0.183,0.044,0.277,0.044c0.001,0,0.002,0,0.003,0h0c0,0,0,0,0,0
                                c0.004,0,0.008-0.002,0.012-0.002c0.017,0.001,0.034,0.002,0.051,0.002c0.277,0,0.527-0.124,0.712-0.315l11.079-7.386l11.6,7.54
                                c0.164,0.106,0.354,0.161,0.545,0.161c0.105,0,0.212-0.017,0.315-0.051c0.288-0.096,0.518-0.318,0.623-0.604l13.936-37.825
                                c0.093-0.151,0.146-0.33,0.146-0.521C60.083,10.981,60.059,10.928,60.049,10.871z M48.464,17.594L24.471,35.236
                                c-0.039,0.029-0.07,0.065-0.104,0.099c-0.013,0.012-0.026,0.022-0.037,0.035c-0.021,0.023-0.04,0.046-0.059,0.071
                                c-0.018,0.024-0.032,0.049-0.048,0.074c-0.037,0.06-0.068,0.122-0.092,0.188c-0.005,0.013-0.013,0.023-0.017,0.036
                                c-0.001,0.004-0.005,0.006-0.006,0.01l-2.75,8.937l-2.179-12.091L48.464,17.594z M22.908,46.61l2.726-9.004l4.244,2.759l1.214,0.789
                                l-4.124,2.749L22.908,46.61z"/>
                            </svg>
                        </div> 
                    </div>
                </div>
          : null}  
        </>
    )
}

export default MessageDetail
