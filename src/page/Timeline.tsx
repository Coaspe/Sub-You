import { memo, useEffect, useState } from "react";
import Post from "../components/post/Post";
import { postContent } from "../types";
import Postskeleton from "../components/Postskeleton";
import { motion } from 'framer-motion'


interface timelineProps {
  sideExpanded: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  postSetChanged:(string | boolean)[]
  setPostSetChanged: React.Dispatch<React.SetStateAction<(string | boolean)[]>>
  setAlert: React.Dispatch<React.SetStateAction<[boolean, string, string]>>
  posts: postContent[]
  postsVisible: (number | boolean)[][]
  setPostsVisible: React.Dispatch<React.SetStateAction<(number | boolean)[][]>>
}

const Timeline: React.FC<timelineProps> = (
  {
    sideExpanded,
    setIsLoading,
    postSetChanged,
    setPostSetChanged,
    setAlert,
    posts,
    postsVisible,
    setPostsVisible,
  }) => {
  
    const [load, setLoad] = useState(false)

    const cacheImages = async (srcArray: string[]) => {
        const promise = srcArray.map((src: string) => {
            
            return new Promise(function (resolve, reject) {
            const img = new Image();

            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject();
            })
        })

        return await Promise.all(promise)
    }  
    
    useEffect(() => {
        if (posts.length > 0) {
            Promise.all(posts.map((post) => (cacheImages(post.imageSrc)))).then((res) => {
                setLoad(true)
            })
        }
    }, [posts])

  return (
    <>
      <motion.div layout className={`${load ? "h-full": "h-screen" } flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-3 sm:mx-5`}>
            {load ? (
              posts.map((data, index) => (
                <Post
                  postContentProps={data}
                  setPostSetChanged={setPostSetChanged}
                  setIsLoading={setIsLoading}
                  setAlert={setAlert}
                  postVisible={postsVisible[index]}
                  setPostsVisible={setPostsVisible}
                />
                ))
            ) : (
                  <>
                    <Postskeleton />
                    <Postskeleton />
                    <Postskeleton />
                  </>)
           }
      </motion.div>
    </>
  )
}
export default memo(Timeline);
