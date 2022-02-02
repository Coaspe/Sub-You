import { motion } from "framer-motion";
import { memo } from "react";
import { getUserType } from "../../types";
import moment from "moment"
import { ENToKR } from "../../data/fromNowENtoKR";

interface transactionRowProps {
    dateCreated: number
    user: getUserType
    price: number
}

const AuctionTransactionRow: React.FC<transactionRowProps> = ({ dateCreated, user, price }) => {

    return (
    <motion.div animate={{opacity : [0, 1]}} className="flex w-full items-center justify-between">
        {
            user.profileImg  ?  
        <>
            <div className="flex items-center justify-between">
                <img className="w-7 h-7 rounded-full mr-2" src={user.profileImg} alt="Auction user" />
                <span className="text-sm">{user.username}</span>
            </div>
            <span className="text-xxs text-gray-400">
                {ENToKR(moment(dateCreated).fromNow())}
            </span>
            <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-1">{price}</span>
                <span className="text-xxs text-gray-500">SUB</span>
            </div>
        </>
         :
        null
        }
    </motion.div>
    )
}

export default memo(AuctionTransactionRow);