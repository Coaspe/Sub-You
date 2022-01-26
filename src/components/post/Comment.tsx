import axios from "axios"
import { motion } from "framer-motion"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import UserContext from "../../context/user"
import { getCommentInfinite, getUserByUserId } from "../../services/firebase"
import { commentType, getUserType } from "../../types"
import CommentRow from "./CommentRow"
import CommentSkeleton from "./CommentSkeleton"

interface commentProps {
    commentDocID: string[]
    postDocID: string
}

const Comment: React.FC<commentProps> = ({ commentDocID, postDocID }) => {

    const { user } = useContext(UserContext)
    const [text, setText] = useState("")
    const [comments, setComments] = useState<commentType[]>([])
    const [commentUser, setCommentUser] = useState<getUserType>({} as getUserType)
    const enterRef = useRef<HTMLDivElement | null>(null)
    const [key, setKey] = useState(0)
    const [loading, setLoading] = useState(true)
    const [moreLoading, setMoreLoading] = useState(false)
    const handleKeypress = (e: any) => {
        if (e.key === 'Enter') {
            enterRef.current?.click()
        }
    };
    
    const handleScroll = useCallback(() => {
        if (commentDocID.length > 0 && key < commentDocID.length) {
            setMoreLoading(true)
            getCommentInfinite(commentDocID, key).then((res) => {
                // Datecreated Descending
                let tmp = res.docs.map((doc: any) => ({...doc.data(), docID:doc.id}))
                    .sort((a: any, b: any) => { return b.dateCreated - a.dateCreated })
                setComments((origin: any) => {
                    return [...origin, ...tmp]
                })
                setKey((origin) => (origin + tmp.length))
                setLoading(false)
            })
        }
    }, [commentDocID, key])
    
    useEffect(() => {
        getUserByUserId(user.uid).then((res: any) => {
            setCommentUser(res)
        })
    }, [])

    useEffect(() => {
        commentDocID.length === 0 ? setLoading(false) : handleScroll()
    }, [])

    useEffect(() => {
        setMoreLoading(false)
    }, [comments])

    return (
    <div className="font-noto absolute w-full h-full z-20 flex flex-col items-center backdrop-filter backdrop-blur overflow-y-scroll">
            {commentUser &&
                <div className="flex w-10/12 items-center justify-between my-2 mt-4">
                    <input
                        value={text}
                        onKeyPress={handleKeypress}
                        onChange={(e: any) => {
                            setText(e.target.value)
                        }}
                        type="text"
                        placeholder="Type a message here ..."
                        className="py-2 px-3 rounded-xl text-sm w-10/12 border bg-gray-100" />
                    <motion.div
                        whileHover={{scale : 1.1}}
                        ref={enterRef}
                        onClick={() => {
                            if (text !== "") {
                                axios.post("http://localhost:3001/addcomment", {
                                    text,
                                    userUID: user.uid,
                                    postDocID: postDocID,
                                    userProfileImg: commentUser.profileImg,
                                    username: commentUser.username
                                }).then((res) => {
                                    setComments((origin: any) => {
                                        return [res.data, ...origin]
                                    })
                                })
                                setText("")
                            }
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-chatWhite cursor-pointer">
                        <svg x="0px" y="0px"
                            className="w-7"
                            fill="gray"
                            viewBox="0 0 466.008 466.008">
                            <g>
                                <path d="M397.763,68.245C353.754,24.236,295.241,0,233.004,0S112.254,24.236,68.245,68.245C24.236,112.254,0,170.767,0,233.004
                                    s24.236,120.75,68.245,164.759c44.009,44.009,102.521,68.245,164.759,68.245s120.75-24.236,164.759-68.245
                                    c44.009-44.009,68.245-102.521,68.245-164.759S441.772,112.254,397.763,68.245z M335.984,212.008
                                    c-2.322,5.605-7.791,9.26-13.858,9.26h-38.473v127.596c0,8.284-6.716,15-15,15h-71.298c-8.284,0-15-6.716-15-15V221.268h-38.474
                                    c-6.067,0-11.536-3.654-13.858-9.26c-2.321-5.605-1.038-12.057,3.252-16.347l89.122-89.123c2.813-2.813,6.628-4.394,10.606-4.394
                                    c3.978,0,7.794,1.58,10.606,4.394l89.122,89.123C337.022,199.951,338.306,206.402,335.984,212.008z"/>
                            </g>
                        </svg>
                    </motion.div>
                </div>}
        <div className="flex flex-col items-center gap-3 mt-3 w-full">
                {!loading
                    ?
                    (comments.length > 0
                        ?
                        <>
                            {comments.map((comment, index) => <CommentRow key={comment.docID} commentInfo={comment} postDocID={postDocID} />)}
                            {key < commentDocID.length &&
                                <div
                                    onClick={() => {
                                        handleScroll()
                                    }}
                                    className={`${moreLoading && "pointer-events-none"} font-semibold text-sm shadow-inner cursor-pointer w-1/2 bg-white h-10 flex items-center justify-center rounded-xl text-gray-500`}>
                                    {!moreLoading ? "Load more..." : "Loading..."}
                                </div>}
                        </>
                        :
                        <div className="border px-3 py-2 rounded-xl bg-gray-50 text-gray-600 text-sm font-semibold">No Comments Yet</div>)
                    :
                    <>
                        {/* 5개씩 comments를 로드하므로 comments의 개수가 5개가 넘으면 5개만 보여준다. */}
                        {commentDocID.length >= 5
                            ? Array(5).fill(0).map((data, index) => (<CommentSkeleton key={index} />))
                            : commentDocID.map((data, index) => (<CommentSkeleton key={index} />))
                        }
                    </>
                }
        </div>
    </div>
    )
}

export default Comment