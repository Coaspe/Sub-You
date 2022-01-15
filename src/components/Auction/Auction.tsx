import { motion } from "framer-motion"
import { useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import UserContext from "../../context/user"
import { rtDBRef } from "../../lib/firebase"
import { RootState } from "../../redux/store"
import { makeAuction, makeTransaction, participateInAuction } from "../../services/firebase"
import AuctionElement from "./AuctionElement"


const Auction = () => {

    const { user } = useContext(UserContext)

    useEffect(() => {
        const auctionsKeys = rtDBRef.child(`auctions/users/${user.uid}`).get().then((res) => {
            //
            console.log(res.val());
            
        })
    })
    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    // real time database 더 손 봐야한다.
    return (
        <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
            <div className="w-full font-noto flex flex-col items-center">
                <span className="text-3xl font-black">My Auction</span>
                <div className="grid grid-cols-2 w-full">
                    <AuctionElement />
                </div>
            </div>
            <div className="w-full font-noto flex flex-col items-center">
                <span className="text-3xl font-black">Hot Auctions</span>
            </div>
        </motion.div>
    )

}

export default Auction