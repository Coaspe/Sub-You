import { memo } from "react";
import Post from "../components/post/Post";
import { postContent } from "../types";
import Postskeleton from "../components/Postskeleton";
import { motion } from 'framer-motion'
import { useSelector } from "react-redux"
import {RootState} from "../redux/store"


interface timelineProps {
  sideExpanded: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  postSetChanged:(string | boolean)[]
  postsVisible: (number | boolean)[][]
  setPostsVisible: React.Dispatch<React.SetStateAction<(number | boolean)[][]>>
}

const Timeline: React.FC<timelineProps> = (
  {
    sideExpanded,
    setIsLoading,
    postSetChanged,
    postsVisible,
    setPostsVisible,
  }) => {

  const posts: postContent[] = useSelector((state: RootState) => state.setPosts.posts)
  return (
    <>
      <motion.div className={`h-full flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-4" : "col-start-3"} sm:col-span-7 sm:mx-5 sm:col-start-1`}>
        {posts.length === 0 ? 
          <>
            <Postskeleton />
            <Postskeleton />
            <Postskeleton />
          </>
        :
          posts.map((data, index) => (
          <Post
            key={index}
            postContentProps={data}
            setIsLoading={setIsLoading}
            postVisible={postsVisible[index]}
            setPostsVisible={setPostsVisible}
          />
        ))}
      </motion.div>
    </>
  )
}
export default memo(Timeline);
