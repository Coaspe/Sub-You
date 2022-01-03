import { DocumentData } from "firebase/firestore";
import { AnimatePresence, LazyMotion, m, domAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { getPostByDocId } from "../../services/firebase";
import { postContent } from "../../types";

interface profileDetailImageProps {
    setDocId : React.Dispatch<React.SetStateAction<string>>
    docId: string
    firstImageSrc: string
}
const ProfileDetailImage: React.FC<profileDetailImageProps> = ({ docId, setDocId, firstImageSrc }) => {

    const [postInfo, setPostInfo] = useState<DocumentData | postContent | undefined>(undefined)
    const [windowInfo, setWindowInfo] = useState(0)
    const [postImagePageIndex, setPostImagePageIndex] = useState(0)
    const [load, setLoad] = useState(true)

    // To improve images loading speed, In advance cache all photoes of post
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
        // Check window ratio.
        setWindowInfo(window.innerWidth / window.innerHeight)
        return () => {
            setDocId("")
        }
    }, [])

    useEffect(() => {
        // Request Post's information related to the thumbnail photo. 
        getPostByDocId(docId).then((res: postContent | DocumentData | undefined) => {
            setPostInfo(res)
            if(res?.imageSrc.length > 1){
                cacheImages(res?.imageSrc)
            }
        })
    }, [docId])

    window.onresize = function () {
        setWindowInfo(window.innerWidth / window.innerHeight);
    }

    const svgVariants = {
        initial: {
            opacity:0
        },
        animate: {
            opacity:1
        },
        exit: {
            opacity:0
        }
    }
    return (
        // To reduce bundle size, use Lazy Motion
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
                                {load && 
                                    <>
                                        <m.svg
                                        variants={svgVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        x="0px" y="0px" 
                                        fill="#e2e1e1"
                                        onClick={()=>setPostImagePageIndex((origin) => { return origin + 1 })}
                                        viewBox="0 0 330 330"
                                        className={`opacity-80 w-6 absolute right-2 top-1/2 cursor-pointer z-50 ${(postImagePageIndex >= postInfo?.imageSrc.length - 1 || postInfo?.imageSrc.length === 1) && "hidden"}`}
                                        >
                                            <path d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M225.606,175.605
                                                l-80,80.002C142.678,258.535,138.839,260,135,260s-7.678-1.464-10.606-4.394c-5.858-5.857-5.858-15.355,0-21.213l69.393-69.396
                                                l-69.393-69.392c-5.858-5.857-5.858-15.355,0-21.213c5.857-5.858,15.355-5.858,21.213,0l80,79.998
                                                c2.814,2.813,4.394,6.628,4.394,10.606C230,168.976,228.42,172.792,225.606,175.605z"/>
                                        </m.svg>

                                        <m.svg
                                        variants={svgVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        fill="#e2e1e1"
                                        onClick={()=>setPostImagePageIndex((origin) => { return origin - 1 })}
                                        className={`opacity-80 w-6 absolute left-2 top-1/2 cursor-pointer ${(postImagePageIndex <= 0 || postInfo?.imageSrc.length === 1 ) && "hidden"}`}
                                        x="0px" y="0px"
                                            viewBox="0 0 330 330" >
                                            <path id="XMLID_6_" d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M205.606,234.394
                                                c5.858,5.857,5.858,15.355,0,21.213C202.678,258.535,198.839,260,195,260s-7.678-1.464-10.606-4.394l-80-79.998
                                                c-2.813-2.813-4.394-6.628-4.394-10.606c0-3.978,1.58-7.794,4.394-10.607l80-80.002c5.857-5.858,15.355-5.858,21.213,0
                                                c5.858,5.857,5.858,15.355,0,21.213l-69.393,69.396L205.606,234.394z"/>
                                        </m.svg>
                                    </>
                                }
                        {/* To Solve unintended animation problem. */}
                        {postImagePageIndex === 0
                            ?
                            <m.img
                                className="max-h-full max-w-full"
                                layoutId={`image-${docId}`}
                                src={firstImageSrc}>
                            </m.img>
                            :
                            <m.img
                                className="max-h-full max-w-full"
                                layoutId={`image-${docId}`}
                                src={postInfo?.imageSrc[postImagePageIndex]}>
                            </m.img>
                        }
                        <span>sedfsdf</span>
                        </m.div>
                    </m.div>
            </AnimatePresence>
        </LazyMotion>
    )
}

export default ProfileDetailImage;