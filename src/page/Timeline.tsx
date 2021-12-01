import { memo, useContext } from "react";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Post from "../components/post/Post";
import UserContext from '../context/user';
import { photoContent } from "../types";
const Timeline = () => {
  // we need to get the logged in user's photos
//   const { photos } = usePhotos();
  // on loading the photos, we need to use react skeleton
  // if we have photos, render them(create a post component)
  // if ith user has no photos, tell them to create some photos
  const { user } = useContext(UserContext);

  const tmp : photoContent= {
    content: {
    dateCreated: 11,
    userEmail: "asdf@gmail.com",
    username: "coaspe",
    imageUrl: "https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/259790395_2526453924152361_3075694569960754124_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=uagfHtgxl3YAX-kodWt&edm=AIQHJ4wBAAAA&ccb=7-4&oh=f969fbb6d844a3f9fce0d828f2ea56f3&oe=61A449FB&_nc_sid=7b02f1&ig_cache_key=MjcxMzk1NjkzNDE5OTE0OTkxOA%3D%3D.2-ccb7-4",
    profileImg: "https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/259790395_2526453924152361_3075694569960754124_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=uagfHtgxl3YAX-kodWt&edm=AIQHJ4wBAAAA&ccb=7-4&oh=f969fbb6d844a3f9fce0d828f2ea56f3&oe=61A449FB&_nc_sid=7b02f1&ig_cache_key=MjcxMzk1NjkzNDE5OTE0OTkxOA%3D%3D.2-ccb7-4"}
  }
  return (
      <div className="flex flex-col items-center justify-center col-span-2 bg-main bg-opacity-60 ml-20 sm:mx-2 sm:col-span-3">
      <Post content={tmp.content} />
       <Post content={tmp.content} />
      
        <Stack className="mb-10"spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={410} height={200} />
        </Stack>
{/*           
        <Stack className="mb-10" spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={410} height={200} />
          </Stack>
        <Stack className="mb-10"spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={410} height={200} />
        </Stack>
          
        <Stack className="mb-10" spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={410} height={200} />
        </Stack> */}
      {/* {!photos ? (
        <>
          <Skeleton count={4} width={640} height={500} className="mb-5" />
        </>
      ) : photos?.length > 0 ? (
        photos.map((content) => <Post key={content.docId} content={content} />)
      ) : (
        <p className="text-center text-2xl">Follow people to see photos!</p>
      )} */}
    </div>
  );
};

export default memo(Timeline);
