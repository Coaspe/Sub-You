import { useContext, useEffect, useState } from "react";
import Artist from "../components/Artist";
import Header from "../components/Header"
import UserContext from "../context/user";
import { getAllUser,  getUserByUserId } from "../services/firebase";
import { getUserType } from "../types"

const Artists = () => {
    const [users, setUsers] = useState<getUserType[]>([])
    const [me, setMe] = useState<getUserType>({} as getUserType)
    const { user: contextUser } = useContext(UserContext)

    useEffect(() => {
        const getInfo = async () => {
            await Promise.all([
                getUserByUserId(contextUser.uid), // res[0] ContextUser's Info
                getAllUser() // res[1] : Recommanded User
            ]).then((res: any) => {
                
                let tmp : getUserType[] = res[1].filter((user: any) =>
                !res[0].following.includes(user.uid) && res[0].uid !== user.uid)
                
                setMe(res[1].find(((element: getUserType) => element.uid === contextUser.uid)))
                setUsers(tmp)
            })
        }
        getInfo()
    }, [contextUser.uid])
    
    return (
        <div className="w-full h-full">
            <Header userInfo={me}/>
            <div className="grid grid-cols-7 justify-between mx-auto max-w-screen-lg">
                <div className="col-start-3 col-span-3 flex flex-col items-center sm:col-span-6 sm:mx-3">
                    {users !== [] ? (
                        users.map((user: getUserType) => (<Artist user={user} />))
                    ) : null}
                </div>
            </div>

        </div>
    )
}

export default Artists;