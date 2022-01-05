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
  subLoading: boolean
  setSubLoading: React.Dispatch<React.SetStateAction<boolean>>
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
    subLoading,
    setSubLoading
  }) => {
  
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

    if (posts.length > 0) {
        setLoad(false)
        Promise.all(posts.map(async (post) => (await cacheImages(post.imageSrc)))).then(() => {
        setLoad(true)
          })
        }
    }, [posts])

  return (
    <>
      <motion.div className={`h-full flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
            {load && subLoading ?  (
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
