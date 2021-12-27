import { useEffect, useState } from "react";
import Artist from "../components/Artist";
import Header from "../components/Header"
import { getAllUser } from "../services/firebase";
import { getUserType } from "../types"
const Artists = () => {
    const [users, setUsers] = useState<getUserType[]>([])

    useEffect(() => {
        getAllUser().then((res: any) => {
            setUsers(res)
        })
    }, [])

    return (
        <div className="bg-main bg-opacity-20 w-full h-screen">
            <Header />
            <div className="grid grid-cols-6 justify-between mx-auto max-w-screen-lg">
                <div className="col-start-3 col-span-2 flex flex-col items-center">
                    {users !== [] ? (
                        users.map((user: getUserType) => (<Artist user={user} />))
                    ) : null}
                </div>
            </div>

        </div>
    )
}

export default Artists;