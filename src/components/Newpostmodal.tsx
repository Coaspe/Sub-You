import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

import UserContext from '../context/user';
import { useContext, useEffect, useState} from "react";
import Compressor from "compressorjs";
import { useDispatch, useSelector } from 'react-redux';
import { alertAction, postSetChangedAction, previewURLAction } from '../redux';
import { RootState } from '../redux/store';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import axios from 'axios';
import { Skeleton } from '@mui/material';
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
    const previewURL : string[] = useSelector((state: RootState) => state.setPreviewURL.previewURL)

    const setPreviewURL = (previewURL: string[]) => {
        dispatch(previewURLAction.setPreviewURL({previewURL: previewURL}))
    }

    const setPostSetChanged = (postSetChanged: (string | boolean)[]) => {
        dispatch(postSetChangedAction.setPostSetChanged({postSetChanged : postSetChanged}))
    }
    const doSetAlert = (alert: [boolean, string, string]) => {
        dispatch(alertAction.setAlert({alert: alert}))
    }

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };
    const handleFileOnChange = (event: any) => {

        event.preventDefault();
        let files: Array<Blob> = []
        let images : string[]= [];

        for (let i = 0; i < event.target.files.length; i++) {
            let element = event.target.files[i]
            
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
                    if (i === event.target.files.length - 1)
                    {
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
    };


    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '1px solid #000',
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
                    <span className="font-noto text-2xl font-bold">
                        New Post
                    </span>
                    <AnimatePresence>
                        {previewURL[0] !== "/images/logo.png" ? 
                            (<motion.div animate={{opacity: 1}} className="w-full h-full grid grid-cols-3 gap-2 justify-center items-center">
                            {load  ?
                                (<>
                                    {previewURL.map((url, urlIndex) => (
                                            <Newpostmodalimage
                                                src={url}
                                                imagesNum={previewURL.length}
                                                myIndex={urlIndex}/>

                                    ))}
                                </>)
                                :
                                (<>
                                    {previewURL.map(() => <Skeleton variant="rectangular" width={118} height={200} />)}
                                </>)}
                            </motion.div>)
                            : 
                            (
                                <div 
                                    className="flex flex-col justify-center items-center h-5/6"
                                    style={{ width: 500, height: 500 }}
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
                            }
                            param.append("userEmail", user.email as string)
                        
                            setIsLoading(true)
                            await axios.post("http://localhost:3001/uploadpost", param).then(async (res) => {
                                const storageImageNames = res.data
                                await axios.post("http://localhost:3001/uploadpostFinish", {
                                    caption: comment,
                                    ImageUrl: storageImageNames,
                                    userInfo: user,
                                    category: "SNS",
                                    postSetChanged: postSetChanged
                                }).then((res) => {
                                    doSetAlert(res.data.alert)
                                    setIsLoading(res.data.loading)
                                    setPostSetChanged(res.data.postSetChanged)
                                    setTimeout(() => {
                                        doSetAlert([false,"",""])
                                    }, 3000);
                                }).catch((err) => {
                                    console.log(err);
                                })
                            })
                            handleClose()
                        }}
                        className={`${previewURL[0] === "/images/logo.png" && "pointer-events-none"} cursor-pointer`}
                        sx={{ color: previewURL[0] !== "/images/logo.png" ? "#008000" : "#8e9598" }}
                        />
                </Box>
            </Modal>
    )
}

export default Newpostmodal;