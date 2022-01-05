import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

interface profileSettingProps {
    sideExpanded: boolean
}
const ProfileSetting: React.FC<profileSettingProps> = ({ sideExpanded }) => {

    return (
        <AnimatePresence>
            <motion.div layout className={`h-screen flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-3 sm:mx-5`}>
                <motion.div className="w-2/3 h-2/3 bg-red-50">
                    asdawda
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default memo(ProfileSetting)