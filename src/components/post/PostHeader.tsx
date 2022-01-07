import {useContext, useEffect, useState} from "react"
import Avatar from '@mui/material/Avatar';
import { postContent } from '../../types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserContext from "../../context/user";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { alertAction, postSetChangedAction } from "../../redux";
import { RootState } from '../../redux/store';
import axios from "axios";

interface postHeaderProps {
  postContentProps: postContent
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  postVisible: (number | boolean)[]
  setPostsVisible: React.Dispatch<React.SetStateAction<(number | boolean)[][]>>
}
 
const PostHeader: React.FC<postHeaderProps> = (
  { postContentProps,
    setIsLoading,
    postVisible,
    setPostsVisible}) => {
  
  const [whetherMyPost, setWhetherMyPost] = useState(false);
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()
  const postSetChanged: (string | boolean)[] = useSelector((state: RootState) => state.setPostSetChanged.postSetChanged)
  
  const setPostSetChanged = (postSetChanged: (string | boolean)[]) => {
    dispatch(postSetChangedAction.setPostSetChanged({postSetChanged : postSetChanged}))
  }
  const doSetAlert = (alert: [boolean, string, string]) => {
      dispatch(alertAction.setAlert({alert: alert}))
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
  
  const { user } = useContext(UserContext);

  useEffect(() => { 
    
    if (postContentProps.userId === user.uid) {
      setWhetherMyPost(true)
    }
  }, [postContentProps.userId, user.uid])
  
  return (
    <motion.div layout className="flex items-center justify-between bg-white px-2 py-2 font-stix sm:h-12">
          <motion.div className="flex items-center justify-center ml-2">
            <Avatar sx={{width : 35, height : 35}} className="mr-2" alt="user avatar" src={postContentProps.avatarImgSrc} />
            <span className="font-noto font-semibold text-sm">{postContentProps.username}</span>
          </motion.div>
          <motion.div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              >
                <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
            }}>
                <MenuItem onClick={handleClose}>Save</MenuItem>
                <MenuItem onClick={handleClose}>Purchase</MenuItem>
                <MenuItem onClick={handleClose}>Auction</MenuItem>
                <MenuItem onClick={handleClose}>Report</MenuItem>
                
          {whetherMyPost ? (<MenuItem onClick={async () => {
            setIsLoading(true)
            await axios.post("http://localhost:3001/deletepost", {
                docId: postContentProps.docId,
                email: user.email,
                storageImageNameArr: postContentProps.postId,
                postSetChanged: postSetChanged
            }).then((res) => {
              if (res.data.alert[2] === 'success') {
                setPostSetChanged(res.data.postSetChanged)
                doSetAlert(res.data.alert)
                setPostsVisible((origin) => {
                  let tmp = origin
                  tmp[postVisible[0] as number] = [postVisible[0] as number, false]
                  console.log(tmp);
                  return tmp
                })
              } else {
                setPostSetChanged(res.data.postSetChanged)
                doSetAlert(res.data.alert)
              }
              setIsLoading(res.data.loading)
            }).catch((err) => {
              console.log(err.message);
              })
                  handleClose()
                }}>Delete</MenuItem>) : null}
            </Menu>
          </motion.div>
    </motion.div>
  )
}

export default PostHeader;