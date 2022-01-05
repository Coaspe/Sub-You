import { postContent } from "../../types"
import Footer from "./Footer"
import Imagesw from "./Imagesw"
import PostHeader from "./PostHeader"
import { AnimatePresence, LazyMotion, m, domAnimation } from "framer-motion"

interface postProps {
    postContentProps: postContent
    setPostSetChanged : React.Dispatch<React.SetStateAction<(string | boolean)[]>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setAlert: React.Dispatch<React.SetStateAction<[boolean, string, string]>>
    postVisible: (number | boolean)[]
    setPostsVisible: React.Dispatch<React.SetStateAction<(number | boolean)[][]>>
}
const Post: React.FC<postProps> = (
    {
        postContentProps,
        setPostSetChanged,
        setIsLoading,
        setAlert, 
        postVisible, 
        setPostsVisible }) => {
    
    return (
        <AnimatePresence>
            <LazyMotion features={domAnimation}>
                {(postVisible && postVisible[1]) &&
                    <m.div
                        layout
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        exit={{opacity : 0, height : 0}}
                        // transition={{ type: "spring", bounce: 0.25}}
                        className="mb-10 flex flex-col w-full max-w-md border-2 border-main border-opacity-30 bg-white sm:col-span-3 ">
                        <PostHeader
                            postContentProps={postContentProps}
                            setPostSetChanged={setPostSetChanged}
                            setIsLoading={setIsLoading}
                            postVisible={postVisible}
                            setPostsVisible={setPostsVisible}
                            setAlert={setAlert} />
                        <Imagesw postContentProps={postContentProps} />
                        <Footer postContentProps={postContentProps} />
                    </m.div>
                }
            </LazyMotion>
        </AnimatePresence>
    )
}

export default Post