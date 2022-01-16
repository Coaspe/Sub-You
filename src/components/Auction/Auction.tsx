import { motion } from "framer-motion"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import UserContext from "../../context/user"
import { rtDBRef } from "../../lib/firebase"
import { RootState } from "../../redux/store"
import { auctionInfoType } from "../../types"
import AuctionElement from "./AuctionElement"


const Auction = () => {

    const { user } = useContext(UserContext)
    const [auctionInfo, setAuctionInfo] = useState<{ [key: string] : auctionInfoType }>({} as { [key: string] : auctionInfoType })

    useEffect(() => {
        // Get Auctions Informations
        rtDBRef.child(`auctions/users/${user.uid}`).get().then((res) => {
            if (res.exists()) {
                let tmp: { [key: string] : auctionInfoType } = {}
                Object.values(res.val().buy).concat(Object.values(res.val().sell)).forEach((auc) => {
                    rtDBRef.child(`auctions/${auc}`).once('value', (snap) => {
                        tmp[snap.key as string] = snap.val()
                        if (Object.keys(tmp).length === Object.keys(res.val().buy).length + Object.values(res.val().sell).length - 2) {
                            setAuctionInfo(tmp)
                        }
                    })
                })
            }
            
        })
    }, [])
    
    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    
    return (
        <motion.div layout className={`h-full flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
            <div className="w-full font-noto flex flex-col items-center">
                <span className="text-3xl font-black">My Auction</span>
                <div className="grid grid-cols-2 w-full gap-4 mt-5">
                    {Object.keys(auctionInfo).map((key) => (
                        <AuctionElement auctionKey={key} auctionInfo={auctionInfo[key]}/>
                    ))
                   }
                </div>
            </div>
            <div className="w-full font-noto flex flex-col items-center">
                <span className="text-3xl font-black">Hot Auctions</span>
            </div>
        </motion.div>
    )

}

export default Auction