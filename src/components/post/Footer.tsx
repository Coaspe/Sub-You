import { postContent } from "../../types"

interface footerProps{
    postContentProps : postContent
}

const Footer : React.FC<footerProps> = ({ postContentProps }) => {
    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <div>
                    Emo
                </div>
                <div>
                    Another
                </div>
            </div>
            
            <div>
                <span>{postContentProps.caption}</span>
            </div>
        </div>
    )
}

export default Footer;