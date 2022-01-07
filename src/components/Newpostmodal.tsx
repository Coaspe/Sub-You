import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

import UserContext from '../context/user';
import { useContext, useEffect, useState} from "react";
import { uploadImage } from '../services/firebase';
import Compressor from "compressorjs";
import { useDispatch, useSelector } from 'react-redux';
import { alertAction, postSetChangedAction } from '../redux';
import { RootState } from '../redux/store';

import axios from 'axios';

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
    const [previewURL, setPriviewURL] = useState(["/images/logo.png"]);
    const [file, setFile] = useState<Blob[]>([]);
    const [fileBlob, setFileBolb] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch()
    const postSetChanged : (string|boolean)[] = useSelector((state: RootState) => state.setPostSetChanged.postSetChanged)

    const setPostSetChanged = (postSetChanged: (string | boolean)[]) => {
        dispatch(postSetChangedAction.setPostSetChanged({postSetChanged : postSetChanged}))
    }
    const doSetAlert = (alert: [boolean, string, string]) => {
        dispatch(alertAction.setAlert({alert: alert}))
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
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
                    console.log(result);
                    
                    files.push(result)
                    images.push(URL.createObjectURL(result))
                    if (i === event.target.files.length - 1)
                    {
                        setPriviewURL(images)
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
        setPriviewURL(["/images/logo.png"])
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

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="sm:hidden"
            >
                <Box sx={style} className="flex flex-col items-center justify-between">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        New Post
                    </Typography>
                    {previewURL[0] !== "/images/logo.png" ? 
                        (
                            <div className="flex flex-col items-center">
                                <div style={{ width: 500, height: 500 }} className="flex flex-col justify-center items-center">
                                    <img
                                        className='max-h-full max-w-full'
                                        src={previewURL[page-1]}
                                        alt={`Page : ${page-1}`}
                                        />
                                </div>
                                <Pagination count={file.length} page={page} onChange={handlePageChange} />
                            </div>
                            )          
                        : 
                        (
                    <div 
                        className="flex flex-col justify-between items-center h-5/6"
                        style={{ width: 500, height: 500 }}
                        >
                        
                        <div></div>
                        <img
                            className='max-w-full max-h-full'
                            src="./images/logo.png"
                            alt="asef"
                        />
                        <div></div>
                    </div>)}
                    <label
                        className="font-noto pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 w-1/6 text-center bg-main rounded-md cursor-pointer"
                        htmlFor="input-file"
                    >
                        Find
                    </label>
                    <form encType='multipart/form-data' name="file">
                        <input
                            type="file"
                            id="input-file"
                            multiple
                            name="input-file"
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
                        param.append('file', file[0])

                        // await axios({ method: "POST", url:"http://localhost:3001/uploadpost", data : formData, headers: formData.getHeaders() }).then((res) => {
                        //     // setIsLoading(false)
                        //     console.log(res);
                        // })
                        await axios.post("http://localhost:3001/uploadpost", param,{
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                                })
                        // uploadImage(
                        //     comment,
                        //     file,
                        //     user,
                        //     "SNS",
                        //     setPostSetChanged,
                        //     setIsLoading,
                        //     doSetAlert
                        // )
                        // handleClose()
                        }}
                        className={`${previewURL[0] === "/images/logo.png" && "pointer-events-none"} cursor-pointer`}
                        sx={{ color: previewURL[0] !== "/images/logo.png" ? "#008000" : "#8e9598" }}
                    />
                </Box>
            </Modal>
    )
}

export default Newpostmodal;