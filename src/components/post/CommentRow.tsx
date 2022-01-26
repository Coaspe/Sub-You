import { memo, useContext, useState } from "react"
import UserContext from "../../context/user"
import { updateCommentLikes } from "../../services/firebase"
import { commentType } from "../../types"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from "axios";

interface commentRowProps {
    commentInfo: commentType
    postDocID: string
}
const CommentRow: React.FC<commentRowProps> = ({ commentInfo, postDocID }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {user} = useContext(UserContext)
    const [like, setLike] = useState(commentInfo.likes.includes(user.uid) ? true : false)
    const [likes, setLikes] = useState(commentInfo.likes.length)
    const [deleted, setDeleted] = useState(false)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div key={`${commentInfo.dateCreated}/${commentInfo.username}`}
            className={`${deleted && "blur-sm pointer-events-none"} flex flex-col bg-gray-50 px-3 rounded-xl font-noto py-2 shadow-lg w-10/12`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <img className="rounded-full w-8 h-8" src={commentInfo.userProfileImg} alt="comment" />
                <div className="flex flex-col ml-2 mb-2">
                    <div className="flex items-center">
                        <span className="font-bold mr-2">{commentInfo.username}</span>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls="long-menu"
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            className="w-6 h-6"
                            onClick={handleClick}
                            >
                                <MoreVertIcon sx={{width: 20}} />
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
                            maxHeight: 48 * 4.5,
                            width: '15ch',
                            },
                        }}>
                            {!(user.uid === commentInfo.userUID) && <MenuItem onClick={handleClose}>
                                <img className="w-4 mr-3" src="/images/caution-triangle.png" alt="Report" />
                                <span className="font-noto text-xs">Report</span>
                            </MenuItem>}
                                    
                            {user.uid === commentInfo.userUID && (
                            <MenuItem onClick={async () => {
                                handleClose()
                                setDeleted(true)
                                axios.post("http://localhost:3001/deleteComment", {
                                    postDocID: postDocID,
                                    commentDocID: commentInfo.docID
                                })
                            }}>
                                <img className="w-4 mr-3" src="/images/delete.png" alt="Delete" />
                                <span className="font-noto text-xs">Delete</span>
                            </MenuItem>)}
                        </Menu>
                    </div>
                    <div className="flex items-center">
                        <span className="text-xxs text-gray-400 font-semibold">1 hr 전</span>
                        <span className="text-xxs text-gray-400 font-semibold ml-3">{likes} 좋아요</span>
                        <span className="text-xxs text-gray-400 font-semibold ml-3">{commentInfo.reply.length === 0 ? "답글 쓰기" : `${commentInfo.reply.length} 답글`}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                    <svg onClick={() => {
                        updateCommentLikes(user.uid, commentInfo.docID, like)
                        like ? setLikes((origin)=>(origin-1)) : setLikes((origin)=>(origin+1))
                        setLike((origin) => (!origin))
                    }} x="0px" y="0px" className={`w-5 mr-2 cursor-pointer ${like ? "hover:fill-heartHoverRed" : "hover:fill-heartHoverGray"}`} fill={like ? "#e71837" : "gray"} viewBox="0 0 544.582 544.582">
                    <g>
                        <path
                            d="M448.069,57.839c-72.675-23.562-150.781,15.759-175.721,87.898C247.41,73.522,169.303,34.277,96.628,57.839
                                C23.111,81.784-16.975,160.885,6.894,234.708c22.95,70.38,235.773,258.876,263.006,258.876
                                c27.234,0,244.801-188.267,267.751-258.876C561.595,160.732,521.509,81.631,448.069,57.839z" />
                    </g>
                </svg>
            </div>
        </div>
            <p className="text-gray-400 text-sm font-semibold py-2">{commentInfo.text}</p>
    </div>
    )
}

export default memo(CommentRow)