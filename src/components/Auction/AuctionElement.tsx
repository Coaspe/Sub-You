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
import { useDispatch, useSelector } from "react-redux";
import { userInfoAction } from "../../redux";
import { RootState } from "../../redux/store";

interface AuctionElementProps {
    auctionKey: string
    auctionInfo: auctionInfoType
}
type transactionType = {
    price: number, userUid: string
}

const AuctionElement: React.FC<AuctionElementProps> = ({ auctionKey, auctionInfo }) => {
    
    const userInfo: getUserType = useSelector((state: RootState) => state.setUserInfo.userInfo)
    const { user } = useContext(UserContext)
    const [elementExpanded, setElementExpanded] = useState(false)
    const [transactions, setTransactions] = useState<[string[], transactionType[]]>([[], []])
    const [price, setPrice] = useState<string | number>("")
    const [lastest, setLastest] = useState<[string, transactionType]>(["", { price: 0, userUid: "" }])
    const [users, setUsers] = useState<{ [uid: string]: getUserType }>({})
    const [leftTime, setLeftTime] = useState([-1, -1])
    const [sellerInfo, setSellerInfo] = useState<getUserType>({} as getUserType)
    const [alreadyParticipate, setAlreadyParticipate] = useState(false)
    const dispatch = useDispatch()

    const doSetUserInfo = useCallback((userInfo: getUserType) => {
        dispatch(userInfoAction.setUserInfo({userInfo: userInfo}))
    }, [dispatch])

    const handleAxios = (path: string) => {
    return  axios.post(`http://localhost:3001/${path}`, {
            buyerUid: user.uid,
            price: price as number,
            auctionKey
    }).then((res) => {
                console.log(res.data);
                
                doSetUserInfo({...userInfo, SUB: res.data})
            }).catch((error) => {
                console.log(error);
        })
    }
    useEffect(() => {
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
        onValue(ref(rtDBRef, `auctions/${auctionKey}/time`), (snap) => {
            setLeftTime(snap.val())
        })
    }, [])

    useEffect(() => {
        if (auctionInfo.buyers) { 
            const q = query(ref(rtDBRef, `auctions/${auctionKey}/transactions`), limitToLast(10))
            onValue(q, (snap) => {
                const lastKey = Object.keys(snap.val())[Object.keys(snap.val()).length - 1]
                const lastVal = snap.val()[lastKey]

                const reversed_arr = Object.values(snap.val()) as transactionType[]
                const reversedKey = Object.keys(snap.val())

                setTransactions([reversedKey, reversed_arr])
                setLastest([lastKey, lastVal])
            });

            
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
    }, [auctionInfo.buyers])

    useEffect(() => {

        if (auctionInfo.done === false) {
            console.log("Mount time", moment().format('LTS'));
            console.time('front')
            const handleTimer = () => {
                let time = moment.duration(moment(auctionInfo.time).diff(moment().valueOf()))
                setLeftTime([time.minutes(), time.seconds()])
                if (auctionInfo.time - moment().valueOf() <= 0 || auctionInfo.done) {
                    setLeftTime([0, 0])
                    clearInterval(timer)
                    console.timeEnd('front')
                    console.log("Mount time", moment().format('LTS'));
                }
            }
            let timer = setInterval(handleTimer, 1000)
        }
    }, [])

    return (
        <AnimateSharedLayout type="crossfade">
            <motion.div animate={{ opacity: [0, 1] }} onClick={() => {setElementExpanded(true)}} layoutId="aa" className="col-span-1 flex flex-col items-center justify-between font-noto cursor-pointer">
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
                    <motion.div layoutId="aa" className="absolute flex flex-col items-center justify-center w-1/2 z-50 bg-white py-5">
                        <img onClick={() => { setElementExpanded(false) }} className="cursor-pointer w-5 absolute right-2 top-2 pointer-cursor" src="/images/close.png" alt="close" />
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
                        <motion.img className="w-2/3" layoutId="img" src={auctionInfo.photoURL} alt="Auction element" />
                        <motion.div layoutId="footer-container" className="my-5 max-h-28 overflow-y-scroll flex flex-col items-center justify-between w-2/3">
                            {Object.keys(users).length > 0 && transactions[0].length > 0 &&
                                transactions[0].map((key, index) => (
                                    <div key={key} className="flex items-center w-full">
                                        {index === 0 && <img className="w-4 mr-3" src="images/crown.png" alt="crown" />}
                                        <AuctionTransactionRow
                                            dateCreated={parseInt(transactions[0][transactions[0].length - 1 - index])}
                                            user={users[transactions[1][transactions[0].length - 1 - index].userUid]}
                                            price={transactions[1][transactions[0].length - 1 - index].price} />
                                    </div>
                                ))}
                        </motion.div>
                        {!auctionInfo.done && <div className="flex items-center justify-between w-2/3">
                            <input
                                value={price}
                                onChange={(e: any) => {
                                    setPrice(e.target.value)
                                }}
                                className="border py-2 pl-2 my-1"
                                placeholder={`${transactions[0].length > 0 ? parseInt(lastest[1].price.toString()) + 1 : "Your First!"}`}
                                type="number"
                                prefix="SUB" />
                            <button
                                onClick={() => {
                                    if (alreadyParticipate) {
                                        handleAxios("makeTransaction")
                                    } else {
                                        handleAxios("participateInAuction")
                                        setAlreadyParticipate(true)
                                    }
                                    setPrice("")
                                }}
                                className={`h-5 ${parseInt(lastest[1].price.toString()) >= price && "pointer-events-none"}`}>Buy</button>
                        </div>}
                    </motion.div>
                }
            </AnimatePresence>
        </AnimateSharedLayout>
    )
}

export default memo(AuctionElement)