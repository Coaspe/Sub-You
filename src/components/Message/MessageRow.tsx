import { memo, useContext } from "react"
import UserContext from "../../context/user"
import { getUserType } from "../../types"

interface MessageRowProps {
    src: string
    message: string
    user: getUserType
}
const MessageRow: React.FC<MessageRowProps> = ({ src, message, user }) => {

    const { user: contextUser } = useContext(UserContext)
    
    return (
        <div className={`flex items-center col-span-3 ${contextUser.uid === user.uid && "place-self-end"}`}>
            <img className="w-7 rounded-full" src={src} alt="message profilie" />
            <span className="text-sm">{message}</span>
        </div>
    )
}

export default memo(MessageRow)