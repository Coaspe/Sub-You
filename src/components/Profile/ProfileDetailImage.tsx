import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface profileDetailImageProps {
    setDocId : React.Dispatch<React.SetStateAction<string>>
    docId: string
    ff: string
}
const ProfileDetailImage: React.FC<profileDetailImageProps> = ({ docId, setDocId, ff }) => {

    useEffect(() => {
        return () => {
            setDocId("")
        }
    }, [])

    return (
        <AnimatePresence>
        <motion.div animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }} transition={{duration:0.3}} className="z-10 absolute w-screen h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                style={{ pointerEvents: "auto" }}
                layoutId={`container-${docId}`}
                className="w-3/5"
                onClick={()=>{setDocId("")}}>
                    <motion.img className="max-h-full max-w-full" layoutId={`image-${docId}`} src={ff}></motion.img>
            </motion.div>
        </motion.div>
        </AnimatePresence>
    )
}

export default ProfileDetailImage;