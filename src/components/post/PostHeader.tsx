import {useContext, useEffect, useState} from "react"
import Avatar from '@mui/material/Avatar';
import { postContent } from '../../types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserContext from "../../context/user";
import { deletePost } from "../../services/firebase";
 
const PostHeader = ({postContentProps} : postContent) => {
  
  const [whetherMyPost, setWhetherMyPost] = useState(false);
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
  }, [user])
  
  return (
      <div className="flex items-center justify-between bg-white px-2 py-2 font-stix sm:h-12">
          <div className="flex items-center justify-center ml-2">
            <Avatar sx={{width : 35, height : 35}} className="mr-2" alt="user avatar" src={postContentProps.avatarImgSrc} />
            <span className="font-noto font-semibold text-sm">{postContentProps.username}</span>
          </div>
          <div>
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
              {whetherMyPost ? (<MenuItem onClick={() => {
                deletePost(postContentProps.docId, user.email, postContentProps.postId)
                handleClose()
              }}>Delete</MenuItem>) : null}
          </Menu>
          </div>
      </div>
  )
}

export default PostHeader;