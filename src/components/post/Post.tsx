import { postContent } from "../../types"
import Footer from "./Footer"
import Imagesw from "./Imagesw"
import PostHeader from "./PostHeader"
import { AnimatePresence, LazyMotion, motion, m, domAnimation } from "framer-motion"
import { memo, useEffect, useState } from "react"
import Postskeleton from "../Postskeleton"

interface postProps {
    postContentProps: postContent
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    postVisible: (number | boolean)[]
    setPostsVisible: React.Dispatch<React.SetStateAction<(number | boolean)[][]>>
}
const Post: React.FC<postProps> = (
    {
        postContentProps,
        setIsLoading,
        postVisible, 
        setPostsVisible }) => {
            
    const [load, setLoad] = useState(false)
    const cacheImages = (srcArray: string[]) => {
        const promise = srcArray.map((src: string) => {
            
            return new Promise(function (resolve, reject) {
            const img = new Image();

            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject();
            })
        })

        return Promise.all(promise)
    }  
    useEffect(() => {
        const awaitCache = async (srcArray: string[]) => {
            await cacheImages(srcArray).then(() => {
                setLoad(true)
            })
        }
        awaitCache(postContentProps.imageSrc)
    }, [])
    
    return (
        <AnimatePresence>
            {load ? 
            <LazyMotion features={domAnimation}>
                {postVisible[1] &&
                    <m.div
                        layout
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        exit={{opacity : 0, height : 0}}
                        // transition={{ type: "spring", bounce: 0.25}}
                        className="mb-10 flex flex-col w-full max-w-md border-2 border-main border-opacity-30 bg-white sm:col-span-3 ">
                        <PostHeader
                            postContentProps={postContentProps}
                            setIsLoading={setIsLoading}
                            postVisible={postVisible}
                            setPostsVisible={setPostsVisible}
                            />
                        <Imagesw postContentProps={postContentProps} />
                        <Footer postContentProps={postContentProps} />
                    </m.div>
                }
            </LazyMotion>
           :
            <Postskeleton />}
        </AnimatePresence>
    )
}

export default Post