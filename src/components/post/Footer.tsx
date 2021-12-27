import { postContent } from "../../types"
const Footer = ({ postContentProps }: postContent) => {
    return (
        <div>
            <div className="flex justify-between">
                <div>
                    Emo
                </div>
                <div>
                    Another
                </div>
            </div>
            
            <div>
                <span>{postContentProps.comments}</span>
            </div>
        </div>
    )
}

export default Footer;