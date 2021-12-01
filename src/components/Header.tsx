import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { signOut } from '../helpers/auth-OAuth2';
import { useNavigate } from 'react-router';
import { memo, useContext } from "react";
import UserContext from '../context/user';

const Header = () => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext);

    // user.toJSON() is not a function error!
    // const [userInfo, setUserInfo] = useState<userInfoType>({} as userInfoType);
    // useEffect(() => {
    //     setUserInfo(user.toJSON() as userInfoType)
    //     console.log(user);
    // }, [])
    
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
        <header className="h-20 bg-main bg-opacity-50 mb-3 sm:h-10 font-stix">
            <div className="w-full h-full flex items-center justify-between">
                <div className="ml-20 sm:ml-3 font-stix font-black text-2xl">
                    {/* logo and name */}
                    SubYou
                </div>
                <div className="sm:hidden">
                    <BootstrapButton><span className="font-stix font-bold">In Auction</span></BootstrapButton>
                    <BootstrapButton><span className="font-stix font-bold">Collection</span></BootstrapButton>
                    <BootstrapButton><span className="font-stix font-bold">Artist</span></BootstrapButton>
                </div>
                <Paper
                className="w-1/3 sm:h-7 sm:mr-3 font-stix"
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', opacity:0.6 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1}}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                </Paper>
                <div className="mr-20 flex items-center justify-center sm:hidden">
                    <Avatar className="mr-2" alt="user avatar" src={user.photoURL as string}/>
                    <span className="mr-5">{user.displayName}</span>
                    <span className="cursor-pointer" onClick={() => {
                        signOut()
                        navigate('/login')
                    }}>Logout</span>
                </div>
            </div>
        </header>
    )
}

export default memo(Header);