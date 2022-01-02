import {  memo, useContext, useEffect, useState } from "react";
import Post from "../components/post/Post";
import UserContext from "../context/user";
import { getPhotos } from "../services/firebase";
import { firebase } from "../lib/firebase";
import { postContent, userInfoFromFirestore } from "../types";
import Postskeleton from "../components/Postskeleton";
import { motion } from 'framer-motion'
import { BoxProps } from "@mui/material";

interface timelineProps {
  sideExpanded: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  postSetChanged: (string | boolean)[]
  setPostSetChanged: React.Dispatch<React.SetStateAction<(string | boolean)[]>>
  setAlert: React.Dispatch<React.SetStateAction<[boolean, string, string]>>
}

const Timeline: React.FC<timelineProps> = ({ sideExpanded, isLoading ,setIsLoading, postSetChanged, setPostSetChanged, setAlert }) => {
  const [posts, setPosts] = useState<postContent[]>([]);
  const { user: contextUser } = useContext(UserContext)
  const [postsVisible, setPostsVisible] = useState<(number | boolean)[][]>([])

  useEffect(() => {
    async function getTimelinePhotos() {
      const result = await firebase
        .firestore()
        .collection("users")
        .where("uid", "==", contextUser.uid)
        .get();
    
      const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));
    
      const userTemp = user as userInfoFromFirestore[]
      const { following } = userTemp[0]
    
      return getPhotos(contextUser.uid, following)
    }

    if (postSetChanged[0] !== "delete") {
      setPosts([])
      getTimelinePhotos().then((res: any) => {
        setPosts(res)
        const tmp = []
        for (let i = 0; i < res.length; i++) {
          tmp.push([i, true])
        }
        setPostsVisible(tmp)
      })
    }
    
  }, [contextUser, postSetChanged])
  
  return (
    <>
      <motion.div layout className={`h-full flex pt-5 flex-col items-center col-span-3 ${sideExpanded ? "col-start-3" : "col-start-2"} sm:col-span-3 sm:mx-5 bg-main bg-opacity-10`}>
        {posts.length > 0 && postsVisible.length > 0 ? (
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
              </>
          )}
        
      </motion.div>
    </>
  )
}
export default memo(Timeline);
