import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Artist from "../components/Artist";
import UserContext from "../context/user";
import { getAllUser,  getUserByUserId } from "../services/firebase";
import { getUserType } from "../types"

interface artistsProps {
    sideExpanded: boolean
}

const Artists: React.FC<artistsProps> = ({ sideExpanded }) => {
    const [users, setUsers] = useState<getUserType[]>([])
    const { user: contextUser } = useContext(UserContext)

    useEffect(() => {
        const getInfo = async () => {
            await Promise.all([
                getUserByUserId(contextUser.uid), // res[0] ContextUser's Info
                getAllUser() // res[1] : Recommanded User
            ]).then((res: any) => {
                
                let tmp : getUserType[] = res[1].filter((user: any) =>
                !res[0].following.includes(user.uid) && res[0].uid !== user.uid)
                
                setUsers(tmp)
            })
        }
        getInfo()
    }, [contextUser.uid])
    
    return (
        <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
                <motion.div className="w-full flex flex-col items-center sm:col-span-6 sm:mx-3">
                    {users !== [] ? (
                        users.map((user: getUserType) => (<Artist user={user} />))
                    ) : null}
                </motion.div>
        </motion.div>
    )
}

export default Artists;