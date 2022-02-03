import { motion } from "framer-motion"
import { memo, useContext, useEffect, useRef } from "react"
import UserContext from "../../context/user"
import { getUserType } from "../../types"

interface MessageRowProps {
    src: string // for user profile image
    message: string // message
    user: getUserType // for user uid
}
const MessageRow: React.FC<MessageRowProps> = ({ src, message, user }) => {
    
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        divRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    }, [])
    
    const { user: contextUser } = useContext(UserContext)
    
    return (
        <motion.div ref={divRef} initial={{opacity:0}} animate={{opacity:1}} className={`grid grid-cols-3 items-center col-span-3`}>
            <div className={`${contextUser.uid === user.uid && "place-self-end col-start-3 bg-main bg-opacity-50"} rounded-md bg-gray-500 py-1 px-2 flex items-center`}>
                <img className="w-7 rounded-full mr-2" src={src} alt="message profilie" />
                <span className="text-sm">{message}</span>
            </div>
        </motion.div>
    )
}

export default memo(MessageRow)