import { AnimatePresence, motion } from "framer-motion"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import UserContext from "../../context/user"
import { rtDBRef } from "../../lib/firebase"
import { ref, onValue, get, child} from "firebase/database";
import { RootState } from "../../redux/store"
import { auctionInfoType } from "../../types"
import AuctionElement from "./AuctionElement"


const Auction = () => {

    const { user } = useContext(UserContext)
    const [ auctionInfo, setAuctionInfo] = useState<{ [key: string] : auctionInfoType }>({} as { [key: string] : auctionInfoType })
    const [sellAuctionInfo, setSellAuctionInfo] = useState<{ [key: string] : auctionInfoType }>({} as { [key: string] : auctionInfoType })
    const [buyAuctionInfo, setBuyAuctionInfo] = useState<{ [key: string] : auctionInfoType }>({} as { [key: string] : auctionInfoType })
    const [sellOrBuyMyAuction, setSellOrBuyMyAuction] = useState("Sell")
    const [sellOrBuyPrevious, setSellOrBuyPrevious] = useState("Sell")

    useEffect(() => {
        
        get(child(ref(rtDBRef), `auctions/users/${user.uid}`)).then((res) => {
            if (res.exists()) {
                let tmp: { [key: string]: auctionInfoType } = {}
                if (res.val().buy && res.val().sell) {
                    Object.values(res.val().buy).forEach((auc) => {
                        onValue(ref(rtDBRef, `auctions/${auc}`), (snap) => {
                            tmp[snap.key as string] = snap.val()
                            if (Object.keys(tmp).length === Object.keys(res.val().buy).length) {
                                setBuyAuctionInfo(tmp)
                            }
                        }, {
                            onlyOnce: true
                        });
                    })

                    let tmp2: { [key: string]: auctionInfoType } = {}
                    Object.values(res.val().sell).forEach((auc) => {
                        onValue(ref(rtDBRef, `auctions/${auc}`), (snap) => {
                            tmp2[snap.key as string] = snap.val()
                            if (Object.keys(tmp2).length === Object.keys(res.val().sell).length) {
                                setSellAuctionInfo(tmp2)
                            }
                        }, {
                            onlyOnce: true
                        });
                    })

                    setAuctionInfo({ ...tmp, ...tmp2 })

                } else if (res.val().buy && !res.val().sell) {
                    Object.values(res.val().buy).forEach((auc) => {
                        onValue(ref(rtDBRef, `auctions/${auc}`), (snap) => {
                            tmp[snap.key as string] = snap.val()
                            if (Object.keys(tmp).length === Object.keys(res.val().buy).length) {
                                setBuyAuctionInfo(tmp)
                                setAuctionInfo(tmp)
                            }
                        }, {
                            onlyOnce: true
                        });
                    })
                } else if (!res.val().buy && res.val().sell) {
                    Object.values(res.val().sell).forEach((auc) => {
                        onValue(ref(rtDBRef, `auctions/${auc}`), (snap) => {
                            tmp[snap.key as string] = snap.val()
                            if (Object.keys(tmp).length === Object.keys(res.val().sell).length) {
                                setSellAuctionInfo(tmp)
                                setAuctionInfo(tmp)
                            }
                        }, {
                            onlyOnce: true
                        });
                    })
                }
            }
        })
        // Get Auctions Informations
    }, [])
    
    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    
    return (
        <div className={`h-full flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
            <AnimatePresence>

                {/* Now Auction */}
                <motion.div key="My Auction" layout className="w-full font-noto flex flex-col items-center mb-20">
                    <div className="grid grid-cols-3 w-full">
                        <span className="text-xl font-black col-start-2 place-self-center">My Auction</span>
                        <div className="col-start-3 place-self-end text-sm">
                            <button
                                onClick={() => {
                                    setSellOrBuyMyAuction("Sell")
                                }}
                                className={`${sellOrBuyMyAuction === "Sell" && "bg-white"}`}>Sell</button>
                            <button                             
                            onClick={() => {
                                    setSellOrBuyMyAuction("Buy")
                                }}className={`mx-2 ${sellOrBuyMyAuction === "Buy" && "bg-white"}`}>Buy</button>
                            <button                             
                            onClick={() => {
                                    setSellOrBuyMyAuction("All")
                                }}className={`${sellOrBuyMyAuction === "All" && "bg-white"}`}>All</button>
                        </div>
                    </div>
                    <motion.div layout className="grid grid-cols-2 w-full gap-4 mt-5">
                        {sellOrBuyMyAuction === "All" && auctionInfo &&
                            Object.keys(auctionInfo).filter((data)=>auctionInfo[data].done === false).map((key) => (
                                <AuctionElement key={key} auctionKey={key} auctionInfo={auctionInfo[key]} />
                            ))}
                        {sellOrBuyMyAuction === "Sell" && sellAuctionInfo &&
                            Object.keys(sellAuctionInfo).filter((data)=>sellAuctionInfo[data].done === false).map((key) => (
                                <AuctionElement key={key} auctionKey={key} auctionInfo={sellAuctionInfo[key]} />
                            ))}
                        {sellOrBuyMyAuction === "Buy" && buyAuctionInfo &&
                            Object.keys(buyAuctionInfo).filter((data)=>buyAuctionInfo[data].done === false).map((key) => (
                                <AuctionElement key={key} auctionKey={key} auctionInfo={buyAuctionInfo[key]} />
                            ))}
                    </motion.div>
                </motion.div>

                {/* Previous Auctions */}
                <motion.div layout key="Previous Auction" className="w-full font-noto flex flex-col items-center mb-20">
                    <div className="grid grid-cols-3 w-full">
                        <span className="text-xl font-black col-start-2 place-self-center">Previous</span>
                        <div className="col-start-3 place-self-end text-sm">
                            <button
                            onClick={() => {
                                setSellOrBuyPrevious("Sell")
                            }}
                            className={`${sellOrBuyPrevious === "Sell" && "bg-white"}`}>Sell</button>
                            <button                             
                            onClick={() => {
                                setSellOrBuyPrevious("Buy")
                            }}className={`mx-2 ${sellOrBuyPrevious === "Buy" && "bg-white"}`}>Buy</button>
                            <button                             
                            onClick={() => {
                                setSellOrBuyPrevious("All")
                            }}className={`${sellOrBuyPrevious === "All" && "bg-white"}`}>All</button>
                        </div>
                    </div>
                    <motion.div layout className="grid grid-cols-2 w-full gap-4 mt-5">
                        {sellOrBuyPrevious === "All" && auctionInfo &&
                            Object.keys(auctionInfo).filter((data)=>auctionInfo[data].done === true).map((key) => (
                                <AuctionElement key={key} auctionKey={key} auctionInfo={auctionInfo[key]} />
                                ))}
                        {sellOrBuyPrevious === "Sell" && sellAuctionInfo &&
                            Object.keys(sellAuctionInfo).filter((data)=>sellAuctionInfo[data].done === true).map((key) => (
                                <AuctionElement key={key} auctionKey={key} auctionInfo={sellAuctionInfo[key]} />
                            ))}
                        {sellOrBuyPrevious === "Buy" && buyAuctionInfo &&
                            Object.keys(buyAuctionInfo).filter((data)=>buyAuctionInfo[data].done === true).map((key) => (
                                <AuctionElement key={key} auctionKey={key} auctionInfo={buyAuctionInfo[key]} />
                                ))}
                    </motion.div>
                </motion.div>

                {/* Hot Auctions */}
                <motion.div layout key="Hot Aunctions" className="w-full font-noto flex flex-col items-center">
                    <span className="text-xl font-black">Hot Auctions</span>
                    <div className="w-full h-screen">No</div>
                </motion.div>
            </AnimatePresence>
        </div>
    )

}

export default Auction