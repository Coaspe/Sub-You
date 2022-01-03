import { getUserType } from "../../types";
import { AnimatePresence, motion } from "framer-motion";
interface props {
    userInfo: getUserType
    setSettingModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileSettingModal: React.FC<props> = ({ userInfo, setSettingModal }) => {
    return (
        <AnimatePresence>
            <motion.div
                onClick={()=>setSettingModal(false)}
                animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }}
                className="z-10 fixed flex w-screen h-screen items-center justify-center">
                <motion.div className="w-2/3 h-2/3 bg-red-50">
                    
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ProfileSettingModal