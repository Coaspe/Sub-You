import { useEffect, useState } from "react";
import { getUserByUserId } from "../../services/firebase";
import { chatRoomInfoType, getUserType } from "../../types";
import { AnimateSharedLayout, motion } from 'framer-motion'

interface MessageListRowProps {
    info: chatRoomInfoType
    users: string[]
}

const MessageListRow: React.FC<MessageListRowProps> = ({ info, users }) => {
    const [usersInfo, setUsersInfo] = useState<getUserType[]>([] as getUserType[])
    const [xx, setXx] = useState<any>({})
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        const tmp: any = {}
        Promise.all(users.map((user) => (
            getUserByUserId(user)
        )
        ))
            .then((res: any) => {
                setUsersInfo(res)
                res.forEach((user: getUserType) => {
                    tmp[user.uid] = user
                })
                setXx(tmp)
            })
    }, [users])

    return (
        <>
            {/* <AnimateSharedLayout type="crossfade"> */}
                {xx[info[1].user] &&
                    <>
                    <motion.div className="relative items-center w-full justify-between border px-6 py-2 rounded-2xl mb-3 shadow-lg cursor-pointer">
                        {/* {!expanded && <motion.div className="absolute w-full h-full" onClick={() => { setExpanded((origin) => !origin) }} layoutId="gg"></motion.div>} */}
                        <div className="flex justify-between w-full items-center">
                        <div className="flex items-center">
                            <img className="rounded-full w-10 h-10" src={xx[info[1].user].profileImg} alt="profile" />
                            <div className="flex flex-col ml-6">
                                <span>{xx[info[1].user].username}</span>
                                <span>{info[1].message}</span>
                            </div>
                        </div>
                        <span className="text-xs">{info[1].dateCreated}</span>
                        </div>
                    </motion.div>
                
                    {expanded && <motion.div onClick={() => { setExpanded((origin) => !origin) }} layoutId="gg" className="absolute w-1/2 h-1/2 bg-white rounded-lg z-50"></motion.div>}
                    </>
                }
            {/* </AnimateSharedLayout> */}
        </>
    )
}

export default MessageListRow