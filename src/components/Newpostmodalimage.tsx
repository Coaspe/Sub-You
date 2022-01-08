import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { previewURLAction } from '../redux'
import { RootState } from '../redux/store'

interface NewpostmodalimageProps {
    src: string
    imagesNum: number,
    myIndex: number
}
const Newpostmodalimage: React.FC<NewpostmodalimageProps> = ({ src, imagesNum, myIndex }) => {
    const dispatch = useDispatch()
    const previewURL : string[] = useSelector((state: RootState) => state.setPreviewURL.previewURL)

    const setPreviewURL = (previewURL: string[]) => {
        dispatch(previewURLAction.setPreviewURL({previewURL: previewURL}))
    }

    useEffect(() => {
        console.log(previewURL);
    }, [previewURL])

    const tmp = []
    for (let i = 0; i < imagesNum; i++) {
        tmp.push(i)
    }

    return (
        <motion.div className={`relative w-full h-full flex items-center justify-center col-span-1`}>
            <motion.div className='absolute w-full h-full opacity-0 hover:opacity-100 hover:bg-black hover:bg-opacity-80 flex justify-center items-center'>
                <div className='w-1/2 h-1/2 grid grid-cols-3 gap-2'>
                    {tmp.map((data, index) => (
                        <div className="w-5 h-5 border flex items-center justify-center cursor-pointer"
                            onClick={() => {
                                
                                const tmp = previewURL.slice()
                                const tmp_element = tmp[index]
                                tmp[myIndex] = tmp_element
                                tmp[index] = src

                                setPreviewURL(tmp)
                        }}
                        >
                            <span className={`font-noto ${index === myIndex ? "text-red-500 pointer-events-none" : "text-yellow-50"}`}>
                                {index + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>
            <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={previewURL[myIndex]} alt="new" />
        </motion.div>
    )
}

export default Newpostmodalimage
// 1(myIndexLocation) [1,1] (location)
// 2 1,2
// 3 1,3
// 4 2,1