import { postContent } from "../../types"
import Footer from "./Footer"
import Imagesw from "./Imagesw"
import PostHeader from "./PostHeader"
import { motion } from "framer-motion"
const Post = ({ postContentProps } : postContent) => {
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity:1 }}
            className="mb-10 flex flex-col justify-center w-full max-w-md border-2 border-main border-opacity-30 bg-white sm:col-span-3 ">
            <PostHeader postContentProps={postContentProps} />
            <Imagesw postContentProps={postContentProps} />
            <Footer postContentProps={postContentProps}/>
        </motion.div>
    )
}

export default Post