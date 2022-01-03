import { DocumentData } from "firebase/firestore";
import { AnimatePresence, LazyMotion, m, domAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { getPostByDocId } from "../../services/firebase";
import { postContent } from "../../types";

interface profileDetailImageProps {
    setDocId : React.Dispatch<React.SetStateAction<string>>
    docId: string
    ff: string
}
const ProfileDetailImage: React.FC<profileDetailImageProps> = ({ docId, setDocId, ff }) => {
    const [imageSrcArr, setImageSrcArr] = useState<string[]>([ff])
    const [postInfo, setPostInfo] = useState<DocumentData | postContent | undefined>(undefined)
    const [windowInfo, setWindowInfo] = useState(0)
    const [postImagePageIndex, setPostImagePageIndex] = useState(0)
    const [load, setLoad] = useState(false)

    const cacheImages = async (srcArray: string[]) => {
        const promise = srcArray.map((src: string) => {
            
            return new Promise(function (resolve, reject) {
            const img = new Image();

            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject();
            })
        })

        await Promise.all(promise).then(() => {
            setLoad(true)
        })
    }

    useEffect(() => {
        setWindowInfo(window.innerWidth / window.innerHeight)
        return () => {
            setDocId("")
        }
    }, [])

    useEffect(() => {
        getPostByDocId(docId).then((res: postContent | DocumentData | undefined) => {
            setPostInfo(res)
            setImageSrcArr((origin) => {
                return origin.concat(res?.imageSrc.slice(1))
            })
            cacheImages(imageSrcArr)
        })
    }, [docId])

    window.onresize = function () {
        setWindowInfo(window.innerWidth / window.innerHeight);
    }

    useEffect(() => {
        console.log(load);
    },[load])

    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence>
                    <m.div
                        animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }}
                        transition={{ duration: 0.3 }}
                        className="z-10 fixed flex w-screen h-screen items-center justify-center"
                        onClick={() => {setDocId("") }}
                    >
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1  ,transition: { duration: 0.15 }}}
                                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                style={{ pointerEvents: "auto" }}
                                layoutId={`container-${docId}`}
                                onClick={(event)=> {event.stopPropagation()}}
                                className={`${windowInfo <= 0.9 ? "w-3/5" : "w-1/3"} relative z-50`}
                                >
                                {postInfo !== undefined && load &&
                                    <>
                                        <m.svg x="0px" y="0px"
                                            fill="gray"
                                            onClick={()=>setPostImagePageIndex((origin) => { return origin + 1 })}
                                            className="w-7 absolute right-2 top-1/2 cursor-pointer z-50"
                                            viewBox="0 0 490.4 490.4" >
                                            <g>
                                                <g>
                                                    <path d="M245.2,490.4c135.2,0,245.2-110,245.2-245.2S380.4,0,245.2,0S0,110,0,245.2S110,490.4,245.2,490.4z M245.2,24.5
                                                        c121.7,0,220.7,99,220.7,220.7s-99,220.7-220.7,220.7s-220.7-99-220.7-220.7S123.5,24.5,245.2,24.5z"/>
                                                    <path d="M138.7,257.5h183.4l-48,48c-4.8,4.8-4.8,12.5,0,17.3c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l68.9-68.9
                                                        c4.8-4.8,4.8-12.5,0-17.3l-68.9-68.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l48,48H138.7c-6.8,0-12.3,5.5-12.3,12.3
                                                        C126.4,252.1,131.9,257.5,138.7,257.5z"/>
                                                </g>
                                            </g>
                                        </m.svg>
                                        <m.svg
                                            x="0px" y="0px"
                                            fill="gray"
                                            onClick={()=>setPostImagePageIndex((origin) => { return origin - 1 })}
                                            className="w-7 absolute left-2 top-1/2 rotate-180 cursor-pointer"
                                            viewBox="0 0 490.4 490.4" >
                                            <g>
                                                <g>
                                                    <path d="M245.2,490.4c135.2,0,245.2-110,245.2-245.2S380.4,0,245.2,0S0,110,0,245.2S110,490.4,245.2,490.4z M245.2,24.5
                                                        c121.7,0,220.7,99,220.7,220.7s-99,220.7-220.7,220.7s-220.7-99-220.7-220.7S123.5,24.5,245.2,24.5z"/>
                                                    <path d="M138.7,257.5h183.4l-48,48c-4.8,4.8-4.8,12.5,0,17.3c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l68.9-68.9
                                                        c4.8-4.8,4.8-12.5,0-17.3l-68.9-68.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l48,48H138.7c-6.8,0-12.3,5.5-12.3,12.3
                                                        C126.4,252.1,131.9,257.5,138.7,257.5z"/>
                                                </g>
                                            </g>
                                        </m.svg>
                                    </>
                                }
                        
                        <m.img
                            className="max-h-full max-w-full"
                            layoutId={`image-${docId}`}
                            src={imageSrcArr[postImagePageIndex]}>
                        </m.img>
                        
                        <span>sedfsdf</span>
                        </m.div>
                    </m.div>
            </AnimatePresence>
        </LazyMotion>
    )
}

export default ProfileDetailImage;