import { useEffect, useState } from "react";
import {motion} from "framer-motion"
interface artistImageProps {
  src: Promise<string>;
}

const ArtistImage: React.FC<artistImageProps> = ({ src }) => {
    const variant = {
        hover: {
            scale: 1.8,
            transition: {
                delay: 0.1
            }
        }
    }
    const [source, setSource] = useState("");

    useEffect(() => {
        src.then((res) => {
            setSource(res)
        })
    }, [])
    
    return (
        <motion.div
            variants={variant}
            whileTap="tap"
            whileHover="hover"
            className="w-32">
            <img className="max-w-full" src={source} alt="a" />
        </motion.div>
    )
}

export default ArtistImage