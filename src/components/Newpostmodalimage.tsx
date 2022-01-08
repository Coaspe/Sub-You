import { Skeleton } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { imageLocationInModalAction } from '../redux'
import { RootState } from '../redux/store'

interface NewpostmodalimageProps {
    src: string
    imagesNum: number,
    myIndex : number
}
const Newpostmodalimage: React.FC<NewpostmodalimageProps> = ({ src, imagesNum, myIndex }) => {
    const dispatch = useDispatch()
    const previewURL : string[] = useSelector((state: RootState) => state.setPreviewURL.previewURL)

    const location : Array<[number, number]> = useSelector((state: RootState) => state.setImageLocationInModal.imageLocationInModal)
    const myLocation : Array<number> = useSelector((state: RootState) => state.setImageLocationInModal.myLocation)

    const setLocation = (location: Array<[number, number]>) => {
        dispatch(imageLocationInModalAction.setImageLocationInModal({imageLocationInModal: location}))
    }
    const setMyLocation = (location: Array<number>) => {
        dispatch(imageLocationInModalAction.setMyLocation({myLocation: location}))
    }
    const tmp = []
    for (let i = 0; i < imagesNum; i++) {
        tmp.push(i)
    }
    return (
    <>
        {location[myLocation[myIndex]] !== undefined ?
        <motion.div layout className={`relative w-full h-full flex items-center justify-center col-span-1 row-start-${location[myLocation[myIndex]][0]} col-start-${location[myLocation[myIndex]][1]}`}>
            <motion.div className='absolute w-full h-full opacity-0 hover:opacity-100 hover:bg-black hover:bg-opacity-80 flex justify-center items-center'>
                <div className='w-1/2 h-1/2 grid grid-cols-3 gap-2 items-center'>
                    {tmp.map((data, index) => (
                        <div className="w-5 h-5 border flex items-center justify-center cursor-pointer"
                            onClick={() => {
                                
                                const tmp = myLocation.slice()
                                const tmp_element = tmp[myIndex]
                                let tt = 0

                                if (index === myIndex) {
                                    for (let i = 0; i < myLocation.length; i++) {
                                        const element = myLocation[i];
                                        if (element === myIndex) {
                                            tt = i
                                            break;
                                        }
                                    }
                                    tmp[tt] = tmp_element
                                    tmp[myIndex] = myIndex
                                } else {
                                    for (let i = 0; i < myLocation.length; i++) {
                                        const element = myLocation[i];
                                        if (element === index) {
                                            tt = i
                                            break;
                                        }
                                    }
                                    tmp[myIndex] = tmp[tt]
                                    tmp[tt] = tmp_element
                                }
                                setMyLocation(tmp)      
                        }}
                        >
                            <span className={`font-noto ${myLocation[myIndex] === index ? "text-yellow-700" :"text-yellow-50"}`}>
                                {index + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>
            <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={previewURL[myIndex]} alt="new" />
        </motion.div> : (
        <>
            {previewURL.map(() => <Skeleton variant="rectangular" width={118} height={200} />)}
        </>
    )}
    </>
    )
}

export default Newpostmodalimage
// 1(myIndexLocation) [1,1] (location)
// 2 1,2
// 3 1,3
// 4 2,1
// location mylocation myIndex
// 안 바뀜               안 바뀜
// 231345