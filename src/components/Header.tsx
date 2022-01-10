import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import { signOut } from '../helpers/auth-OAuth2';
import { useNavigate } from 'react-router';
import UserContext from '../context/user';
import { memo, useContext} from "react";
import { getUserType } from '../types';
import { makeMessageRoom, sendMessage } from '../services/firebase';

interface headerProps {
    userInfo : getUserType
}

const Header : React.FC<headerProps> = ({ userInfo }) => {

    const navigate = useNavigate()
    const { user } = useContext(UserContext);

    const handleClickProfile = () => {
        navigate(`/p/${userInfo?.userEmailEncrypted}`)
    }

    return (
        <header className="h-20 font-noto bg-main bg-opacity-20 sm:h-10 grid grid-cols-7 ">
            <div className="w-full h-full flex items-center justify-between col-start-2 col-span-5">
                <div className="ml-20 font-stix font-black text-3xl sm:ml-3 cursor-pointer"
                    onClick={() => {
                    navigate("/")
                }}>
                    SubYou
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
                    <img className="w-7 cursor-pointer sm:hidden" src='/images/logout.png' alt="Logout" onClick={() => {
                        signOut()
                        navigate('/login')
                    }}/>
                </div>
            </div>
        </header>
    )
}

export default memo(Header);