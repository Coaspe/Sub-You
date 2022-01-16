import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { memo, useContext, useEffect, useState } from "react"
import UserContext from "../../context/user"
import { rtDBRef } from "../../lib/firebase"
import { getUserByUserId, makeTransaction, participateInAuction } from "../../services/firebase"
import { auctionInfoType, getUserType } from "../../types"
import AuctionTransactionRow from "./AuctionTransactionRow"

interface AuctionElementProps {
    auctionKey: string
    auctionInfo: auctionInfoType
}
type transactionType = {
    price: number, userUid: string
}

const AuctionElement: React.FC<AuctionElementProps> = ({ auctionKey, auctionInfo }) => {
    
    const { user } = useContext(UserContext)
    const [elementExpanded, setElementExpanded] = useState(false)
    const [transactions, setTransactions] = useState<[string[], transactionType[]]>([[], []])
    const [price, setPrice] = useState<string | number>("")
    const [lastest, setLastest] = useState<[string, transactionType]>(["", { price: 0, userUid: "" }])
    const [users, setUsers] = useState<{ [uid: string]: getUserType }>({})
    const [leftTime, setLeftTime] = useState("")
    useEffect(() => {
        rtDBRef.child(`auctions/${auctionKey}/time`).on("value", (snap) => {
            setLeftTime(snap.val().toString())
        })
    }, [])
    
    useEffect(() => {
    console.log(transactions);
    }, [transactions])
    useEffect(() => {
    console.log(auctionInfo);
    }, [auctionInfo])

    useEffect(() => {

        if (auctionInfo.buyers !== undefined) { 
            console.log(auctionInfo.buyers);
            rtDBRef.child(`auctions/${auctionKey}/transactions`).limitToLast(10).on("value", (snap) => {
                const lastKey = Object.keys(snap.val())[Object.keys(snap.val()).length - 1]
                const lastVal = snap.val()[lastKey]
    
                const reversed_arr = Object.values(snap.val()) as transactionType[]
                const reversedKey = Object.keys(snap.val())
    
                setTransactions([reversedKey, reversed_arr])
                setLastest([lastKey, lastVal])
            })
        }
    }, [auctionInfo])

    useEffect(() => {

        if (auctionInfo.buyers !== undefined) {
            console.log(auctionInfo.buyers);
            
            let query_user = Object.values(auctionInfo.buyers).filter((user) => !Object.keys(users).includes(user))
            let tmp: { [uid: string]: getUserType } = {}
    
            Promise.all(query_user.map((user) => getUserByUserId(user)))
                .then((res) => {
                    res.forEach((userData: any) => {
                        tmp[userData.uid] = userData
                })
                    setUsers((origin) => {
                        return {...origin, ...tmp}
                    })
                })
        }
    }, [auctionInfo])

    return (
        <AnimateSharedLayout type="crossfade">
            <motion.div onClick={() => {setElementExpanded(true)}} layoutId="aa" whileHover={{scale:1.1}} className="col-span-1 flex flex-col items-center justify-center font-noto">
                <motion.div layoutId="header-container" className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center justify-between">
                        <img className="w-7 h-7 rounded-full mr-2" src="/images/5.jpg" alt="Auction user" />
                        <span className="text-sm">username</span>
                    </div>
                    <span className="text-xs">{leftTime}</span>
                </motion.div>
                <motion.img layoutId="img" src={auctionInfo.photoURL} alt="Auction element" />
                <motion.div layoutId="footer-container" className="flex w-full items-center justify-between mt-1">
                    {
                        lastest[0] !== "" && Object.keys(users).length === Object.keys(auctionInfo.buyers).length ?
                        <AuctionTransactionRow
                            dateCreated={parseInt(lastest[0])}
                            user={users[lastest[1].userUid]}
                            price={lastest[1].price}
                        />
                        :
                        null
                    }
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {elementExpanded &&
                    <motion.div layoutId="aa" className="absolute flex flex-col items-center justify-center w-1/2 z-50 bg-white">
                        <img onClick={() => {setElementExpanded(false)}} className="w-5 absolute right-2 top-2 pointer-cursor" src="/images/close.png" alt="close" />
                        <motion.div layoutId="header-container" className="flex items-center justify-between w-2/3 mb-1">
                            <div className="flex items-center justify-between">
                                <img className="w-7 h-7 rounded-full mr-2" src="/images/5.jpg" alt="Auction user" />
                                <span className="text-sm">username</span>
                            </div>
                            <span className="text-xs">{leftTime}</span>
                        </motion.div>
                        <motion.img className="w-2/3" layoutId="img" src={auctionInfo.photoURL} alt="Auction element" />
                        <motion.div layoutId="footer-container" className="my-5 max-h-28 overflow-y-scroll flex flex-col items-center justify-between w-2/3">
                            {Object.keys(users).length > 0 && transactions[0].length > 0 &&
                                transactions[0].map((key, index) => (
                                    <AuctionTransactionRow
                                        dateCreated={parseInt(transactions[0][transactions[0].length - 1 - index])}
                                        user={users[transactions[1][transactions[0].length - 1 - index].userUid]}
                                        price={transactions[1][transactions[0].length - 1 - index].price} />
                            ))}
                        </motion.div>
                        <div className="flex items-center justify-between w-2/3">
                            <input
                                value={price}
                                onChange={(e: any) => {
                                    setPrice(e.target.value)
                                }}
                                className="border py-2 pl-2 my-1"
                                placeholder={`${transactions[0].length > 0 ? lastest[1].price : "Your First!"}`}
                                type="number"
                                prefix="ETH" />
                            <button
                                onClick={() => {
                                    transactions[0].length > 0 ?
                                    makeTransaction(user.uid, price as number, auctionKey) :
                                    participateInAuction(user.uid, price as number, auctionKey)
                                    
                                    setPrice("")
                                }}
                                className={`h-5 ${transactions[0].length > 0 && lastest[1].price >= price && "pointer-events-none"}`}>Buy</button>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </AnimateSharedLayout>
    )
}

export default memo(AuctionElement)