import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { useState } from "react"
import AuctionTransactionRow from "./AuctionTransactionRow"

const AuctionElement = () => {

    const [elementExpanded, setElementExpanded] = useState(false)

    return (
        <AnimateSharedLayout type="crossfade">
            <motion.div onClick={() => {setElementExpanded(true)}} layoutId="aa" whileHover={{scale:1.1}} className="col-span-1 flex flex-col items-center justify-center font-noto">
                <motion.div layoutId="header-container" className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center justify-between">
                        <img className="w-7 h-7 rounded-full mr-2" src="/images/5.jpg" alt="Auction user" />
                        <span className="text-sm">username</span>
                    </div>
                    <span className="text-xs">21:22</span>
                </motion.div>
                <motion.img layoutId="img" src="/images/7.jpg" alt="Auction element" />
                <motion.div layoutId="footer-container" className="flex w-full items-center justify-between mt-1">
                    <AuctionTransactionRow />
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {elementExpanded &&
                    <motion.div layoutId="aa" className="absolute flex flex-col items-center justify-center w-1/2 z-50 bg-main bg-opacity-10">
                        <img onClick={() => {setElementExpanded(false)}} className="w-5 absolute right-2 top-2 pointer-cursor" src="/images/close.png" alt="close" />
                        <motion.div layoutId="header-container" className="flex items-center justify-between w-2/3 mb-1">
                            <div className="flex items-center justify-between">
                                <img className="w-7 h-7 rounded-full mr-2" src="/images/5.jpg" alt="Auction user" />
                                <span className="text-sm">username</span>
                            </div>
                            <span className="text-xs">21:22</span>
                        </motion.div>
                        <motion.img className="w-2/3" layoutId="img" src="/images/7.jpg" alt="Auction element" />
                        <motion.div layoutId="footer-container" className="flex flex-col items-center justify-between w-2/3 mt-1">
                            <AuctionTransactionRow />
                            <AuctionTransactionRow />
                            <AuctionTransactionRow />
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </AnimateSharedLayout>
    )
}

export default AuctionElement