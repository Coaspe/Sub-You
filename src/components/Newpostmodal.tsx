import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

import UserContext from '../context/user';
import { useContext, useEffect, useState} from "react";
import Compressor from "compressorjs";
import { useDispatch, useSelector } from 'react-redux';
import { alertAction, postSetChangedAction, previewURLAction, imageLocationInModalAction } from '../redux';
import { RootState } from '../redux/store';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import Newpostmodalimage from './Newpostmodalimage';

interface newPostModalProps { 
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    
    setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading :React.Dispatch<React.SetStateAction<boolean>>;
}

const Newpostmodal: React.FC<newPostModalProps> = (
    {
        setOpen,
        open,
        setSelectedPage,
        setIsLoading,
    }) => {
    
    const { user } = useContext(UserContext);
    const [comment, setComment] = useState("");
    const [file, setFile] = useState<Blob[]>([]);
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    const postSetChanged : (string|boolean)[] = useSelector((state: RootState) => state.setPostSetChanged.postSetChanged)
    const previewURL: string[] = useSelector((state: RootState) => state.setPreviewURL.previewURL)
    const myLocation : Array<number> = useSelector((state: RootState) => state.setImageLocationInModal.myLocation)
    
    const setMyLocation = (location: Array<number>) => {
        dispatch(imageLocationInModalAction.setMyLocation({myLocation: location}))
    }
    const setPreviewURL = (previewURL: string[]) => {
        dispatch(previewURLAction.setPreviewURL({previewURL: previewURL}))
    }

    const setPostSetChanged = (postSetChanged: (string | boolean)[]) => {
        dispatch(postSetChangedAction.setPostSetChanged({postSetChanged : postSetChanged}))
    }
    const doSetAlert = (alert: [boolean, string, string]) => {
        dispatch(alertAction.setAlert({alert: alert}))
    }

    const setLocation = (location: Array<[number, number]>) => {
        dispatch(imageLocationInModalAction.setImageLocationInModal({imageLocationInModal: location}))
    }

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };
    const handleFileOnChange = (event: any) => {

        let files: Array<Blob> = []
        let images : string[]= [];

        for (let i = 0; i < event.target.files.length; i++) {
            console.log(event.target.files);
            
            const element = event.target.files[i]
            
            let qual = 0.45;

            if (element.size >= 4000000) {
                qual = 0.1
            } else if (element.size >= 2000000) {
                qual = 0.2
            } else if (element.size >= 1000000) {
                qual = 0.4
            }

            new Compressor(element, {
            quality: qual,
            success(result: any) {
                files.push(result)
                images.push(URL.createObjectURL(result))
                if (images.length === event.target.files.length)
                {
                    if (previewURL[0] !== "/images/logo.png") {
                        previewURL.map((data)=>(URL.revokeObjectURL(data)))
                     }           
                    setPreviewURL(images)
                    setFile(files)
                }
            },
            error(err) {
                console.log(err.message);
                return;
            },
            });
            
        }
    };

    const handleClose = () => {
        setOpen(false)
        setFile([])
        setPreviewURL(["/images/logo.png"])
        setComment("")
        if (previewURL[0] !== "/images/logo.png") {
            previewURL.map((data)=>(URL.revokeObjectURL(data)))
        }
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        return () => {
            setSelectedPage("Timeline")
        }
    }, [])

    useEffect(() => {   

        setLoad(false)
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

        cacheImages(previewURL).then(() => {
            let tmp: Array<[number, number]> = []
            let tmp2: Array<number> = []
            for (let i = 0; i < previewURL.length; i++) {
                tmp.push([Math.floor(i / 3) + 1, Math.floor(i % 3) + 1]);
                tmp2.push(i)
            }
            
            setLocation(tmp)
            setMyLocation(tmp2)
            setLoad(true)
        })

    }, [previewURL])

    return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="w-full sm:hidden"
            >
                <Box sx={style} className="flex flex-col items-center justify-between w-1/2">
                    <span className="font-noto text-2xl font-bold mb-7">
                        New Post
                    </span>
                    <AnimatePresence>
                        {previewURL[0] !== "/images/logo.png" ? 
                            (<motion.div animate={{opacity: 1}} className="w-full h-full grid grid-cols-3 gap-2 justify-items-center items-center">
                            {load ?
                                (<>
                                    {previewURL.map((url, i) => (
                                        <Newpostmodalimage
                                            src={url}
                                            imagesNum={previewURL.length}
                                            myIndex={i}
                                        />

                                    ))}
                                </>)
                                :
                                (<>
                                    {previewURL.map(() => <div className="animate-pulse w-full h-full bg-black bg-opacity-80 rounded-md">
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                    </div>)}
                                </>)}
                            </motion.div>)
                            : 
                            (
                                <div 
                                    className="flex flex-col justify-center items-center w-full"
                                    style={{ height: 500 }}
                                    >
                                    <img
                                        className='max-w-full max-h-full'
                                        src="./images/logo.png"
                                        alt="New Post default"
                                    />
                                </div>
                        )}
                    </AnimatePresence>
                    <label
                        className="font-noto pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 w-1/6 text-center bg-main rounded-md cursor-pointer"
                        htmlFor="input-file"
                    >
                        Find
                    </label>
                    <form encType='multipart/form-data' name="files">
                        <input
                            type="file"
                            name="files"
                            id="input-file"
                            multiple
                            style={{ display: "none" }}
                            onChange={(event : any) => {
                                handleFileOnChange(event);
                            }}
                            />
                    </form>
                    <div className='flex items-center'>
                    <TextField
                        id="outlined-comment"
                        label="comment"
                        value={comment}
                        onChange={handleCommentChange}
                        />
                    <CheckCircleTwoToneIcon
                    onClick={async () => {

                        let param = new window.FormData()

                        for (let i = 0; i < file.length; i++) {
                            param.append(`file${i}`, file[i]); 
                            console.log(`file${i}`, file[i]);
                        }

                        param.append("caption", comment as string)
                        param.append("userInfo",  JSON.stringify({ uid: user.uid, email: user.email, photoURL: user.photoURL }))
                        param.append("category", "SNS")
                        param.append("postSetChanged", JSON.stringify(postSetChanged))
                        param.append("location", JSON.stringify(myLocation))
                        
                        setIsLoading(true)
                        
                        await axios.post("http://localhost:3001/uploadpost", param).then((res) => {
                                doSetAlert(res.data.alert)
                                setIsLoading(res.data.loading)
                                setPostSetChanged(res.data.postSetChanged)
                                setTimeout(() => {
                                    doSetAlert([false,"",""])
                                }, 3000);
                            }).catch((err) => {
                                console.log(err);
                            })
                        handleClose()
                        }}
                        className={`${previewURL[0] === "/images/logo.png" && "pointer-events-none"} cursor-pointer`}
                        sx={{ color: previewURL[0] !== "/images/logo.png" ? "#008000" : "#8e9598" }}
                        />
                    </div>
                </Box>
            </Modal>
    )
}

export default Newpostmodal;