import { motion } from "framer-motion"
import { memo } from "react"

interface props {
    src: string
    docId: string
}
const ProfileLoadingImage : React.FC<props> = ({ src, docId }) => {
    return (
        <motion.img
            className="max-h-full max-w-full"
            layoutId={`image-${docId}`}
            src={src}>
        </motion.img>
    )
}

export default memo(ProfileLoadingImage)
