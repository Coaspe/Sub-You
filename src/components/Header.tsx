import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { signOut } from '../helpers/auth-OAuth2';
import { useNavigate } from 'react-router';
import UserContext from '../context/user';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import { memo, useContext, useState} from "react";
import { uploadImage } from '../services/firebase';
import Compressor from "compressorjs";

const Header = () => {

    const navigate = useNavigate()
    const { user } = useContext(UserContext);
    const [comment, setComment] = useState("");
    const [open, setOpen] = useState(false);
    const [previewURL, setPriviewURL] = useState(["/images/logo.png"]);
    const [file, setFile] = useState<Blob[]>([]);
    const [page, setPage] = useState(1);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setFile([])
        setPriviewURL(["/images/logo.png"])
        setComment("")
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

    const BootstrapButton = styled(Button)({
        color: "black",
        borderRadius: 0,
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        borderLeft: '0px',
        borderBottom: '3px solid rgba(0,0,0,0)',
        lineHeight: 2,
        backgroundColor: 'transparent',
        fontfamily: [
        '"STIX Two Text"','serif'].join(','),
        '&:hover': {
            borderBottom: '3px solid rgba(0,0,0,1)',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#000',
            borderColor: '#000',
        },
        '&:focus': {
        },
    });

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

    return (
        <header className="h-20 bg-main bg-opacity-20 mb-3 sm:h-10 font-stix grid grid-cols-8">
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
                        className="pt-1 pb-1 pl-3 pr-3 mr-2 mt-2 w-1/6 text-center bg-main rounded-md cursor-pointer"
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

            <div className="w-full h-full flex items-center justify-between col-start-2 col-span-5">
                <div className="ml-20 font-stix font-black text-2xl sm:ml-3 ">
                    SubYou
                </div>
                <div className="sm:hidden">
                    <BootstrapButton><span className="font-stix font-bold">In Auction</span></BootstrapButton>
                    <BootstrapButton
                        onClick={() => {
                            navigate("/artist")
                        }}
                    ><span className="font-stix font-bold">Artist</span></BootstrapButton>
                </div>
                <div className="w-1/3 font-stix sm:h-7 sm:mr-3 sm:hidden">
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', opacity:0.6 }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1}}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'Search' }}
                        />
                    </Paper>
                </div>
                <div className=" flex items-center justify-center sm:mr-3 sm:hidden">
                    <Avatar className="mr-2" alt="user avatar" src={user.photoURL as string}/>
                    <span className="mr-5 sm:text-sm sm:mr-0">{user.displayName}</span>
                    <svg
                        className="w-6 h-6"
                        onClick={handleOpen}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="cursor-pointer sm:hidden" onClick={() => {
                        signOut()
                        navigate('/login')
                    }}>Logout</span>
                </div>
            </div>
        </header>
    )
}

export default memo(Header);