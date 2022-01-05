import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

import { signOut } from '../helpers/auth-OAuth2';
import { useNavigate } from 'react-router';
import UserContext from '../context/user';
import { memo, useContext} from "react";
import { getUserType } from '../types';

interface headerProps {
    userInfo : getUserType
}

const Header : React.FC<headerProps> = ({ userInfo }) => {

    const navigate = useNavigate()
    const { user } = useContext(UserContext);

    const handleClickProfile = () => {
        navigate(`/p/${userInfo?.userEmailEncrypted}`)
    }

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

    return (
        <header className="h-20 font-noto bg-main bg-opacity-20 sm:h-10 flex items-center justify-evenly ">

            <div className="w-full h-full flex items-center justify-between col-start-2 col-span-5">
                <div className="ml-20 font-stix font-black text-2xl sm:ml-3 cursor-pointer"
                    onClick={() => {
                    navigate("/")
                }}>
                    SubYou
                </div>
                <div className="sm:hidden">
                    <BootstrapButton>
                        <span className="font-stix font-bold">
                            In Auction
                        </span>
                    </BootstrapButton>
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
                <div className=" flex items-center justify-center mr-20 sm:mr-3 sm:hidden">
                    <Avatar onClick={handleClickProfile} className="mr-2 cursor-pointer" alt="user avatar" src={user.photoURL as string}/>
                    <span onClick={handleClickProfile} className="text-md font-bold mr-5 cursor-pointer sm:text-sm sm:mr-0">{user.displayName}</span>
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