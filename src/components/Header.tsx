import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import { signOutAuth } from '../helpers/auth-OAuth2';
import { useNavigate } from 'react-router';
import UserContext from '../context/user';
import { memo, useCallback, useContext} from "react";
import { getUserType } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { sideBarExpandedAction } from '../redux';
import { RootState } from '../redux/store';

interface headerProps {
    userInfo : getUserType
}

const Header : React.FC<headerProps> = ({ userInfo }) => {

    const navigate = useNavigate()
    const { user } = useContext(UserContext);
    const dispatch = useDispatch()
    const sideExpanded: boolean = useSelector((state: RootState) => state.setSidebarExpanded.sideBarExpanded)
    
    const setSideExpanded = useCallback((sideBarExpanded: boolean) => {
        dispatch(sideBarExpandedAction.setSideBarExpanded({sideBarExpanded: sideBarExpanded}))
    }, [dispatch])

    const handleClickProfile = () => {
        navigate(`/p/${userInfo?.userEmailEncrypted}`)
    }

    return (
        <header className="h-20 font-noto bg-main bg-opacity-20 sm:h-10 grid grid-cols-7 ">
            <div className="w-full h-full flex items-center justify-between col-start-1 col-span-7">
                <div className="px-2 py-2 rounded-full ml-2 hover:bg-stone">
                    <svg
                        onClick={() => {
                            setSideExpanded(!sideExpanded)
                        }}
                        className="w-6 cursor-pointer"
                        x="0px" y="0px"
                        viewBox="0 0 384.97 384.97">
                        <g id="Menu">
                            <path d="M12.03,84.212h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
                                C5.39,60.152,0,65.541,0,72.182C0,78.823,5.39,84.212,12.03,84.212z"/>
                            <path d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
                                S379.58,180.455,372.939,180.455z"/>
                            <path d="M372.939,300.758H12.03c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h360.909
                                c6.641,0,12.03-5.39,12.03-12.03C384.97,306.147,379.58,300.758,372.939,300.758z"/>
                        </g>
                    </svg>
                </div>
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
                    <Avatar onClick={handleClickProfile} className="mr-2 cursor-pointer" alt="user avatar" src={userInfo.profileImg}/>
                    <span onClick={handleClickProfile} className="text-md font-bold mr-5 cursor-pointer sm:text-sm sm:mr-0">{user.displayName}</span>
                    <img className="w-7 cursor-pointer sm:hidden" src='/images/logout.png' alt="Logout" onClick={() => {
                        signOutAuth()
                        navigate('/login')
                    }}/>
                </div>
            </div>
        </header>
    )
}

export default memo(Header);