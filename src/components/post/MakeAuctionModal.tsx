import { Modal } from "@mui/material";
import Tooltip from '@mui/material/Tooltip'
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react'

interface props {
    setSettingModal: React.Dispatch<React.SetStateAction<boolean>>
    makeAuctionModalOpen: boolean
    imageSrc: string[]
    userUID: string
}

const MakeAuctionModal:React.FC<props> = ({makeAuctionModalOpen, setSettingModal, imageSrc, userUID}) => {
    const handleClose = () => {
        setSettingModal(false)
    } 
    const [loading, setLoading] = useState(false)
    const [seletedImage, setSeletedImage] = useState("")
    const [price, setPrice] = useState<string>("")
    const handleOnChange = (e: any) => {
        const re = /^[0-9\b]+$/;
        if ((e.target.value !== '0' && re.test(e.target.value)) || e.target.value === "") {
            setPrice(e.target.value)
        }
    }

    useEffect(() => {
    const cacheImages = (srcArray: string[]) => {
        const promise = srcArray.map((src: string) => {
            
            return new Promise(function (resolve, reject) {
            const img = new Image();

            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject();
            })
        })

        return Promise.all(promise)
    }
        cacheImages(imageSrc).then(() => {
        setLoading(true)
    })
    }, [])

    return (
        <Modal
            open={makeAuctionModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="w-full flex items-center justify-center"
            >
            <div className="w-1/2 flex bg-white items-center justify-center flex-col rounded-lg font-noto">
                <div className="w-full grid grid-cols-3 gap-2 px-2 py-2">
                    {imageSrc.map((src) => (
                        <div className="w-full h-full flex items-center justify-center relative" key={src}
                            onClick={() => {
                                seletedImage === src ? setSeletedImage("") : setSeletedImage(src)
                            }}
                        >
                            <div className={`${!loading && "animate-pulse bg-slate-400"} cursor-pointer flex items-center justify-center absolute w-full h-full ${seletedImage === src ? "bg-slate-600 bg-opacity-50 hover:bg-opacity-70" : "hover:bg-slate-600 hover:bg-opacity-50"}`}>
                                {seletedImage === src &&
                                <motion.svg x="0px" y="0px"
                                    animate={{opacity: [0,1]}}
                                    transition={{duration: 0.1}}
                                    className="w-1/3"
                                    fill="#81c147"
                                    viewBox="0 0 330 330">
                                    <g>
                                        <path d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M165,300
                                            c-74.44,0-135-60.561-135-135S90.56,30,165,30s135,60.561,135,135S239.439,300,165,300z"/>
                                        <path d="M226.872,106.664l-84.854,84.853l-38.89-38.891c-5.857-5.857-15.355-5.858-21.213-0.001
                                            c-5.858,5.858-5.858,15.355,0,21.213l49.496,49.498c2.813,2.813,6.628,4.394,10.606,4.394c0.001,0,0,0,0.001,0
                                            c3.978,0,7.793-1.581,10.606-4.393l95.461-95.459c5.858-5.858,5.858-15.355,0-21.213
                                            C242.227,100.807,232.73,100.806,226.872,106.664z"/>
                                    </g>
                                </motion.svg>
                                }
                            </div>
                            <motion.img animate={{
                                height: !loading ? "16rem" : "auto",
                                opacity: !loading ? 0 : 1
                            }} className="max-w-full max-h-full" src={src} alt="auction" />
                        </div>
                    ))}

                </div>
                <div className="flex items-center justify-center">
                    <input
                        value={price}
                        type="tel"
                        placeholder="Price"
                        onChange={handleOnChange}
                        className="w-1/4 bg-white border appearance-none px-2 py-1 rounded-xl my-1 text-sm mr-2"
                        />
                        <Tooltip 
                            arrow
                            title={`
                            ${(seletedImage === "" && price === "") ? "사진과 가격을 결정하세요"
                                :
                                (seletedImage === "" && price !== "") ? "사진을 선택하세요"
                                :
                                (seletedImage !== "" && price === "") ? "가격을 책정하세요"
                                : "경매 등록"
                            }
                            `}>
                        <button 
                        onClick={()=>{
                            axios.post("http://localhost:3001/makeAuction", {
                                sellerUid: userUID,
                                photoURL: seletedImage,
                                firstPrice: price
                            }).then((res) => {
                                console.log(res);
                                
                            })
                            handleClose()
                        }}
                        className="bg-white text-sm">
                            Confirm
                        </button>
                    </Tooltip>
                </div>
            </div>
        </Modal>
    )
}

export default MakeAuctionModal;