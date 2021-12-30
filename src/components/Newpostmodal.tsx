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

interface newPostModalProps { 
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    setSelected: React.Dispatch<React.SetStateAction<number>>;
}

const Newpostmodal: React.FC<newPostModalProps> = ({ setOpen, open, setSelected }) => {
    
    const { user } = useContext(UserContext);
    const [comment, setComment] = useState("");
    const [previewURL, setPriviewURL] = useState(["/images/logo.png"]);
    const [file, setFile] = useState<Blob[]>([]);
    const [page, setPage] = useState(1);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };
    const handleFileOnChange = (event: any) => {

        event.preventDefault();
        let files: Array<File> | Array<Blob> = []
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
                success(result: File) {
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
    height: 1000,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    };
    useEffect(() => {
        return () => {
            setSelected(0)
        }
    },[])
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
                                <div style={{ width: 650, height: 650 }} className="flex flex-col justify-center items-center">
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
                    <div className="flex flex-col justify-between items-center h-5/6">
                        <div></div>
                        <img
                            src="./images/logo.png"
                            alt="asef"
                        />
                        <div></div>
                    </div>)}
                    <br />
                    <label
                        className="font-noto pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 w-1/6 text-center bg-main rounded-md cursor-pointer"
                        htmlFor="input-file"
                    >
                        Find
                    </label>
                    <form>
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
                        onClick={() => {
                            uploadImage(comment, file, user, "SNS")
                            handleClose()
                        }}
                        className={`${previewURL[0] === "/images/logo.png" ? "hidden" : "visible"} cursor-pointer`}
                        sx={{ color: `#008000` }}
                    />
                </Box>
            </Modal>
    )
}

export default Newpostmodal;