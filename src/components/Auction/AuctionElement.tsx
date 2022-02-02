import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { memo, useCallback, useContext, useEffect, useState } from "react"
import { rtDBRef } from "../../lib/firebase"
import { ref, onValue, query, limitToLast} from "firebase/database";
import UserContext from "../../context/user"
import { getUserByUserId } from "../../services/firebase"
import { auctionInfoType, getUserType } from "../../types"
import AuctionTransactionRow from "./AuctionTransactionRow"
import axios from "axios";
import moment from 'moment'
import { alertAction } from "../../redux";
import { useDispatch } from "react-redux";

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
    const [price, setPrice] = useState<string>("")
    const [lastest, setLastest] = useState<[string, transactionType]>(["", { price: -1, userUid: "" }])
    const [users, setUsers] = useState<{ [uid: string]: getUserType }>({})
    const [leftTime, setLeftTime] = useState([-1, -1])
    const [sellerInfo, setSellerInfo] = useState<getUserType>({} as getUserType)
    const [alreadyParticipate, setAlreadyParticipate] = useState(false)
    const [loading, setLoading] = useState([true, true])
    const dispatch = useDispatch()
    const [buyBtnControl, setBuyBtnControl] = useState(false)
    
    const doSetAlert = (alert: [boolean, string, string]) => {
        dispatch(alertAction.setAlert({alert: alert}))
    }
    const handleElementExpand = () => {
        setElementExpanded(false)
        document.body.style.overflow = "visible"
    }
    const handleAxios = (path: string) => {
        return  axios.post(`http://localhost:3001/${path}`, {
                buyerUid: user.uid,
                price: parseInt(price),
                auctionKey
            }).then((res) =>
            {
                if (res.data === "MORESUBNEEDED") {
                    doSetAlert([true, "SUB가 부족합니다", "error"])
                    setTimeout(() => { doSetAlert([false, "", ""]) }, 3000)
                } else if (res.data === "COMMITEERROR") {
                    doSetAlert([true, "결제에 문제가 생겼습니다", "error"])
                    setTimeout(() => { doSetAlert([false, "", ""]) }, 3000)
                } else if (res.data === "NEEDMOREPRICE") {
                    doSetAlert([true, "최근 호가보다 가격이 낮습니다", "error"])
                    setTimeout(() => { doSetAlert([false, "", ""]) }, 3000)
                }
                else {
                    doSetAlert([true, `${price} SUB 구매 완료`, "success"])
                    setTimeout(()=>{doSetAlert([false, "", ""])}, 3000)
                }
            })
    }

    useEffect(() => {
        // Check already participated in auction
        onValue(ref(rtDBRef, `auctions/users/${user.uid}/buy`), (snap) => {
            if (snap.exists()) {
                Object.values(snap.val()).includes(auctionKey) && setAlreadyParticipate(true)
            }
        }, {
            onlyOnce: true
        })

        getUserByUserId(auctionInfo.seller).then((res: any) => {
            setSellerInfo(res)
        })

        // Client Timer
        if (auctionInfo.done === false) {
            const handleTimer = () => {
                let time = moment.duration(moment(auctionInfo.time).diff(moment().valueOf()))
                setLeftTime([time.minutes(), time.seconds()])
                if (auctionInfo.time - moment().valueOf() <= 0 || auctionInfo.done) {
                    setLeftTime([0, 0])
                    clearInterval(timer)
                }
            }
            let timer = setInterval(handleTimer, 1000)
        }

        if (auctionInfo.transactions) { 

            // Buyers onValue
            const qq = query(ref(rtDBRef, `auctions/${auctionKey}/buyers`))

            onValue(qq, (snap) => {
                setLoading((origin) => ([true, origin[1]]))
                let query_user = Object.values(snap.val()).filter((user) => !Object.keys(users).includes(user as string))
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
            })

            // Transaction onValue
            const q = query(ref(rtDBRef, `auctions/${auctionKey}/transactions`), limitToLast(10))

            onValue(q, (snap) => {
                if (snap.exists()) {
                    setLoading((origin) => ([origin[0], true])
)
                    const lastKey = Object.keys(snap.val())[Object.keys(snap.val()).length - 1]
                    const lastVal = snap.val()[lastKey]
    
                    const reversed_arr = Object.values(snap.val()) as transactionType[]
                    const reversedKey = Object.keys(snap.val())
    
                    setLastest([lastKey, lastVal])
                    setTransactions([reversedKey, reversed_arr])
                }
            });
        }

    }, [])

    useEffect(() => {
        if (Object.keys(users).length > 0) {
            setLoading((origin) => ([false, origin[1]]))
        }
    }, [users])

    useEffect(() => {
        if (transactions[0].length > 0) {
            setLoading((origin) => ([origin[0], false]))
        }
    }, [transactions])

    return (
        <AnimateSharedLayout type="crossfade">
            <motion.div layoutId="aa" animate={{ opacity: [0, 1] }} onClick={() => {
                setElementExpanded(true)
                document.body.style.overflow = "hidden"
            }} className="col-span-1 flex flex-col items-center justify-between font-noto cursor-pointer">
                <motion.div layoutId="header-container" className="flex items-center justify-between w-full mb-1">
                    {sellerInfo && leftTime[0] > -1
                        ? 
                        <>
                            <motion.div className="flex items-center justify-between">
                                <img className="w-7 h-7 rounded-full mr-2" src={sellerInfo.profileImg} alt="Auction user" />
                                <span className="text-sm">{sellerInfo.username}</span>
                            </motion.div>
                            {!auctionInfo.done && <div className="flex items-center">
                                <img className="w-4 mr-1" src="images/alarm-clock.png" alt="clock" />
                                <span className="text-xs">{`${leftTime[0] < 10 ? '0'+leftTime[0] : leftTime[0]} : ${leftTime[1] < 10 ? '0'+leftTime[1] : leftTime[1]}`}</span>
                            </div>}
                        </>
                        :
                        null
                    }
                </motion.div>
                <motion.div  className="bg-white w-full flex flex-col items-center justify-center h-smpost">
                    <motion.img layoutId="img" className="max-w-full max-h-full" src={auctionInfo.photoURL} alt="Auction element" />
                </motion.div>
                <motion.div layoutId="footer-container" className="flex w-full items-center justify-between mt-1">
                    {
                        !loading[0] && !loading[0] ?
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
                    <motion.div onClick={handleElementExpand} animate={{ opacity: [0, 1] }} exit={{ opacity: [1, 0] }} transition={{ duration: 0.3 }} className="top-0 left-0 fixed flex items-center justify-center w-full h-full bg-black z-30 bg-opacity-50 ">
                        <motion.div onClick={(event) => { event.stopPropagation() }} layoutId="aa" className="relative flex flex-col items-center justify-center w-1/2 z-50 bg-white py-5">
                            <motion.img onClick={handleElementExpand} className="cursor-pointer w-5 absolute right-2 top-2 pointer-cursor" src="/images/close.png" alt="close" />
                            <motion.div layoutId="header-container" className="flex items-center justify-between w-2/3 mb-1">
                                {sellerInfo
                                    ?
                                    <>
                                        <div className="flex items-center justify-between">
                                            <img className="w-7 h-7 rounded-full mr-2" src={sellerInfo.profileImg} alt="Auction user" />
                                            <span className="text-sm">{sellerInfo.username}</span>
                                        </div>
                                        {!auctionInfo.done && <div className="flex items-center">
                                            <img className="w-4 mr-1" src="images/alarm-clock.png" alt="clock" />
                                            <span className="text-xs">{`${leftTime[0] < 10 ? '0' + leftTime[0] : leftTime[0]} : ${leftTime[1] < 10 ? '0' + leftTime[1] : leftTime[1]}`}</span>
                                        </div>}
                                    </>
                                    :
                                    null
                                }
                            </motion.div>
                            
                        <motion.div  className="bg-white w-full flex flex-col items-center justify-center h-smpost">
                        <motion.img layoutId="img" className="max-w-full max-h-full" src={auctionInfo.photoURL} alt="Auction element" />
                        </motion.div>
                            <motion.div layoutId="footer-container" className="my-5 max-h-28 overflow-y-scroll flex flex-col items-center justify-between w-2/3 px-2 py-3">
                                {!loading[0] && !loading[0] &&
                                    transactions[0].map((key, index) => (
                                        <div key={key} className="flex items-center w-full border mb-2 px-2 py-2 rounded-2xl shadow-md">
                                            {index === 0 && <img className="w-4 mr-3" src="images/crown.png" alt="crown" />}
                                            <AuctionTransactionRow
                                                dateCreated={parseInt(transactions[0][transactions[0].length - 1 - index])}
                                                user={users[transactions[1][transactions[0].length - 1 - index].userUid]}
                                                price={transactions[1][transactions[0].length - 1 - index].price} />
                                        </div>
                                    ))
                                }
                            </motion.div>
                            {!auctionInfo.done &&
                                <motion.div className="flex items-center justify-around w-2/3">
                                    <input
                                        value={price}
                                        onChange={(e: any) => {
                                            setPrice(e.target.value.toString())
                                        }}
                                        className="w-1/2 border py-2 pl-2 my-1 text-sm"
                                        placeholder={(lastest[1].price).toString()}
                                        type="number"
                                        prefix="SUB" />
                                    <button
                                        onClick={() => {
                                            setBuyBtnControl(true)

                                            if (alreadyParticipate) {
                                                handleAxios("makeTransaction")
                                            } else {
                                                handleAxios("participateInAuction")
                                                setAlreadyParticipate(true)
                                            }

                                            setTimeout(() => {
                                                setBuyBtnControl(false)
                                            }, 2000)

                                            setPrice("")
                                        }}
                                        className={`p-2 text-sm rounded-full border ${(parseInt(lastest[1].price.toString()) >= parseInt(price) || buyBtnControl ) && "pointer-events-none"}`}>Buy</button>
                                </motion.div>
                            }
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </AnimateSharedLayout>
    )
}

export default memo(AuctionElement)