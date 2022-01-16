import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { getUserType } from "../../types";

interface transactionRowProps {
    dateCreated: number
    user: getUserType
    price: number
}

const AuctionTransactionRow: React.FC<transactionRowProps> = ({ dateCreated, user, price }) => {
    const [time, setTime] = useState("")

    useEffect(() => {
        console.log(user);
        const date = new Date(dateCreated)
        setTime(`${date.getHours()}:${date.getMinutes()}`)
    }, [dateCreated])

    return (
    <motion.div animate={{opacity : [0, 1]}} className="flex w-full items-center justify-between mb-1">
        {
            user.profileImg ?  
        <>
            <div className="flex items-center justify-between">
                <img className="w-7 h-7 rounded-full mr-2" src={user.profileImg} alt="Auction user" />
                <span className="text-sm">{user.username}</span>
            </div>
            <span className="text-xs">
                {time}
            </span>
            <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-1">{price}</span>
                <span className="text-xs text-gray-500">ETH</span>
            </div>
        </>
         :
        null
        }
    </motion.div>
    )
}

export default memo(AuctionTransactionRow);