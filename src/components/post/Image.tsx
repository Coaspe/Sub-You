import { photoContent } from "../../types"

const Image = ({content} : photoContent) => {
    return (
        <div className="border-2 flex items-center justify-center">
            <img className="object-contain max-w-full" src="/images/2.jpg" alt="Post" />
        </div>
    )
}

export default Image