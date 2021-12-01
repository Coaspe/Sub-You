import { photoContent } from "../../types"
import Image from "./Image"
import PostHeader from "./PostHeader"

const Post = ({content} : photoContent) => {
    return (
        <div className="w-full mb-3 rounded-md">
            <PostHeader content={content} />
            <Image content={content} />
        </div>
    )
}

export default Post