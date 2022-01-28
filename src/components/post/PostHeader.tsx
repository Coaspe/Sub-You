import {useContext, useEffect, useState} from "react"
import Avatar from '@mui/material/Avatar';
import { postContent } from '../../types';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserContext from "../../context/user";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { alertAction, postSetChangedAction } from "../../redux";
import { RootState } from '../../redux/store';
import axios from "axios";
import MakeAuctionModal from "./MakeAuctionModal";

interface postHeaderProps {
  postContentProps: postContent
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  postVisible: (number | boolean)[]
  setPostsVisible: React.Dispatch<React.SetStateAction<(number | boolean)[][]>>
  selectedMode: string
  setSelectedMode: React.Dispatch<React.SetStateAction<string>>
}
 
const PostHeader: React.FC<postHeaderProps> = (
  {
    postContentProps,
    setIsLoading,
    postVisible,
    setPostsVisible,
    selectedMode,
    setSelectedMode
  }) => {
  
  const ITEM_HEIGHT = 48;
  const [whetherMyPost, setWhetherMyPost] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()
  const postSetChanged: (string | boolean)[] = useSelector((state: RootState) => state.setPostSetChanged.postSetChanged)
  const [makeAuctionModalOpen, setMakeAuctionModalOpen] = useState(false)

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
    <>
      {makeAuctionModalOpen && <MakeAuctionModal makeAuctionModalOpen={makeAuctionModalOpen} setSettingModal={setMakeAuctionModalOpen} imageSrc={postContentProps.imageSrc} userUID={postContentProps.userId}/>}
    <motion.div layout className="flex items-center justify-between bg-chatWhite px-2 py-2 font-noto sm:h-12 shadow-md z-30">
      <div className="flex items-center justify-center ml-2">
        <Avatar sx={{width : 35, height : 35}} className="mr-2" alt="user avatar" src={postContentProps.avatarImgSrc} />
        <span className="font-noto font-semibold text-sm">{postContentProps.username}</span>
      </div>
      <div className="flex items-center">
            <svg x="0px" y="0px"
              onClick={()=>{setSelectedMode("image")}}
              fill={selectedMode === "image" ? "black" : "gray"}
              className="w-5 cursor-pointer mr-2"
              viewBox="0 0 98.327 98.327"
              >
              <g>
                <path d="M96.064,11.098H15.578c-1.249,0-2.261,1.012-2.261,2.261v11.057H2.261C1.012,24.416,0,25.428,0,26.677v58.292
                  c0,1.249,1.013,2.261,2.261,2.261h80.488c1.248,0,2.261-1.012,2.261-2.261V73.91h11.057c1.248,0,2.261-1.012,2.261-2.261V13.357
                  C98.327,12.108,97.314,11.098,96.064,11.098z M75.193,17.581c4.771,0,8.639,3.867,8.639,8.638s-3.868,8.637-8.639,8.637
                  s-8.637-3.867-8.637-8.637C66.557,21.448,70.423,17.581,75.193,17.581z M77.629,80.08l-70.25-0.021
                  c0.284-6.229,2.467-16.201,5.938-24.424v16.015c0,1.249,1.013,2.261,2.261,2.261h59.289C75.872,76.164,77.374,79.172,77.629,80.08z
                  M20.697,66.742c0.444-9.767,5.549-28.744,12.985-35.736C40.341,24.792,46,30.229,50.44,36.556
                  c4.106,5.882,7.681,11.084,10.691,14.354c4.957,4.957,9.191-2.557,14.391-5.032c7.574-3.607,13.816,15.149,15.426,20.886
                  L20.697,66.742z"/>
              </g>
            </svg>
            <svg 
              onClick={()=>{setSelectedMode("comment")}}
              className="w-5 cursor-pointer"
              fill={selectedMode === "comment" ? "black" : "gray"}
              x="0px" y="0px" viewBox="-0.5 0.5 42 42">
              <path d="M29.5,30.5h7c2.529,0,3-0.529,3-3v-21c0-2.41-0.59-3-3-3h-32c-2.47,0-3,0.53-3,3v20.971c0,2.469,0.41,3.029,3,3.029h13
                c0,0,9.562,8.756,10.75,9.812c0.422,0.375,1.281,0.172,1.25-0.812V30.5z M7.5,21.5h21v3h-21V21.5z M7.5,15.5h13v3h-13V15.5z
                M7.5,9.5h26v3h-26V9.5z"/>
            </svg>
      </div>
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
                  width: '15ch',
                },
            }}>
          <MenuItem className="font-noto" onClick={handleClose}>
              <img className="w-4 mr-3" src="/images/diskette.png" alt="Save" />
              <span className="font-noto text-xs">Save</span>
          </MenuItem>
          <MenuItem onClick={() => {
              setMakeAuctionModalOpen(true)
              handleClose()
          }}>
              <img className="w-4 mr-3" src="/images/hammer.png" alt="Auction" />
              <span className="font-noto text-xs">Auction</span>
          </MenuItem>
          <MenuItem onClick={handleClose}>
              <img className="w-4 mr-3" src="/images/caution-triangle.png" alt="Report" />
              <span className="font-noto text-xs">Report</span>
          </MenuItem>
                
          {whetherMyPost ? (<MenuItem onClick={async () => {
            setIsLoading(true)
            handleClose()
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
              setTimeout(() => {
                doSetAlert([false,"",""])
              }, 3000);
              setIsLoading(res.data.loading)
            }).catch((err) => {
              console.log(err.message);
              })
          }}>
              <img className="w-4 mr-3" src="/images/delete.png" alt="Delete" />
              <span className="font-noto text-xs">Delete</span>
          </MenuItem>) : null}
            </Menu>
          </motion.div>
    </motion.div>
    </>
  )
}

export default PostHeader;