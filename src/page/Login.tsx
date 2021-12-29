import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios'
import { errorInitial, errorType, locationType, locationTypeInitial } from '../types';
import FirebaseContext from "../context/firebase";
import { useNavigate } from 'react-router-dom';
import { ReactCountryFlag } from "react-country-flag"
import { signInWithFacebook, signInWithGoogle } from '../helpers/auth-OAuth2';
import { styled } from '@mui/system';
import ColoredLine from '../components/ColoredLine';
import './Login.css'
import { getUserType } from "../types";
import { getUserByEmail } from "../services/firebase";

const Login = () => {
    const [location, setLocation] = useState<locationType>(locationTypeInitial);
    const navigate = useNavigate()

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<errorType>(errorInitial);
    const { firebase } = useContext(FirebaseContext);
    useEffect(() => {
        const getTimeline = async () => {
            const { following } = await getUserByEmail("aspalt85@gmail.com") as getUserType
        }
        getTimeline()
        axios.get('https://ipapi.co/json/')
            .then((response: any) => {
                let data = response.data;
                setLocation(data)
            });
    }, [])
    const SignupBtn = styled(Button)`
        background: linear-gradient(45deg, #736578 30%, #b2a8b5 90%);
        margin-top: 1rem;
        font-family: "STIX";
    `
  const handleLogin = async (event:React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
      navigate("/");
    } catch (error: any) {
      setEmailAddress("");
      setPassword("");
        setError(error);
        console.log(error.message);
    }
    };

    return (
        <div className="flex justify-center items-center w-screen h-screen font-stix sm:max-w-full bg-main bg-opacity-10">
            <div className="w-1/2 sm:w-0 sm:invisible flex mx-auto z-10">

                    <div className="flex flex-col ml-36">
                        <p className="font-black text-5xl">We Sub You!</p>
                        <p className="text-lg">You can subscribe your stars and own their photos with NFT tech in our flatform.</p>
                    <p className="text-lg">You can be a star and put your pictures up for auction in our flatform.</p>
                    </div>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center rounded-xl py-10 sm:w-full z-10">
                <img className="w-40 mb-5" src="/images/logo.png" alt="logo" />
                <Box
                    className="flex flex-col items-center justify-center font-stix"
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {
                            m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-password-input"
                        label="Email"
                        type="Email"
                        style={{
                            fontFamily: "STIX"
                        }}
                        autoComplete="current-email"
                        onChange={(e: any) => {
                            setEmailAddress(e.target.value)
                        }}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        style={{
                            fontFamily: "STIX"
                        }}
                        autoComplete="current-password"
                        onChange={(e: any) => {
                            setPassword(e.target.value)
                        }}
                    />
                </Box>
                <SignupBtn variant="contained" type="submit" onClick={(e: React.MouseEvent<HTMLElement>) => {
                    handleLogin(e)
                }}>Login</SignupBtn>
                <ColoredLine color="#736578" />

                <div className="flex flex-col items-center justify-center mt-6" >
                    <span className="text-main">Login with SNS account!</span>
                    <div className="flex items-center justify-bewteen">
                        <img className="w-8 h-8 rounded-full mr-1 cursor-pointer" src="/images/googlecircle.png" alt="googlecircle" onClick={() => {
                            try {
                                signInWithGoogle(navigate)
                            } catch (error: any) {
                                console.log(error.message);
                            }
                        }} />
                        <img className="w-10 rounded-full cursor-pointer" src="/images/facebookcircle.png" alt="facebookcircle" onClick={() => {
                            signInWithFacebook(navigate)
                        }}/>
                        <img className="w-10 rounded-full mr-1 cursor-pointer" src="/images/twittercircle.png" alt="twittercircle" />
                        <img className="w-8 h-8 rounded-full cursor-pointer" src="/images/applecircle.png" alt="applecircle" />
                    </div>
                </div>

                <ColoredLine color="#736578" />
                <span
                    className="cursor-pointer text-main mt-3" onClick={() => {
                    navigate("/signup")
                    }}>
                    Don't have an account?
                </span>
                <ReactCountryFlag countryCode={location.country} svg/>
                    </div>
                    <div className="area flex items-center justify-center absolute z-0">
                        <ul className="circles">
                        <img className="max-w-full max-h-full blur"src="/images/1.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/2.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/3.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/4.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/5.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/6.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/7.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/8.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/9.jpg" alt="login" />
                        <img className="max-w-full max-h-full blur"src="/images/6.jpg" alt="login" />
                        </ul>
                    </div >

        </div>
    )
}

export default Login;