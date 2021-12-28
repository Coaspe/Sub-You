import { memo, useContext, useEffect, useState } from "react";
import Post from "../components/post/Post";
import UserContext from "../context/user";
import { getPhotos } from "../services/firebase";
import { firebase } from "../lib/firebase";
import { postContent, userInfoFromFirestore } from "../types";
const Timeline = () => {
  const [posts, setPosts] = useState<postContent[]>([]);
  const { user: contextUser } = useContext(UserContext)
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
      console.log(following);
      
      return getPhotos(contextUser.uid, following)
    }

    getTimelinePhotos().then((res: any) => {
      const tmp = res.map((r: any) => ({
        postContentProps: {
          ...r
        }
      }))
      setPosts(tmp)
    })
  }, [contextUser])
  
  return (
    <div className="flex flex-col items-center justify-center col-span-2 ml-20 h-full sm:mx-2 sm:col-span-3 sm:mx-5">
      {posts.length > 0 ? (
        posts.map(({ postContentProps }: postContent) => (
        <Post postContentProps={postContentProps} />
      ))) : null}
    </div>
  );
};

export default memo(Timeline);
