import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { locationType, locationTypeInitial } from '../types';
import { useNavigate } from 'react-router-dom';
import { ReactCountryFlag } from "react-country-flag"
import { doesEmailExist, signupWithEmail } from '../services/firebase';
import axios from 'axios'
import { styled } from '@mui/system';

const Signup = () => {
    const [location, setLocation] = useState<locationType>(locationTypeInitial);
    const navigate = useNavigate()

    const [emailAddress, setEmailAddress] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axios.get('https://ipapi.co/json/')
            .then((response: any) => {
                let data = response.data;
                setLocation(data)
            });
    }, [])
    const handleSingup = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const usernameExists = await doesEmailExist(emailAddress);
        if (!usernameExists) {
        try {
            signupWithEmail(emailAddress, password, username)
            navigate("/");
        } catch (error: any) {
            setEmailAddress("");
            setUsername("");
            setPassword("");
            setError(error.message)
        }
        } else {
        setError("That email is already taken, please try another.");
        }
    };
    const SignupBtn = styled(Button)`
    background: linear-gradient(45deg, #736578 30%, #b2a8b5 90%);
    margin-top: 0.4rem;
    font-family: "STIX";
    `
    return (
        <div className="flex justify-center items-center w-screen h-screen font-stix sm:max-w-full">
            {error !== "" ? (<Alert severity="error">{error}</Alert>) : null}
            <div className="w-1/2 sm:w-0 sm:invisible">
                <img src="/images/loginLeft.jpg" alt="loginLeft" />
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center rounded-xl py-10 sm:w-full">
                <img className="w-40 mb-5" src="/images/logo.png" alt="logo" />
                <Box
                    className="flex flex-col items-center justify-center font-stix"
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {
                            m: 1, width: '25ch' },
                    }}

                    autoComplete="off"
                >
                    <TextField
                        id="outlined-password-input"
                        label="Email"
                        type="email"                    style={{
                            fontFamily: "STIX"
                        }}
                        error={emailAddress.indexOf("@") === -1 && emailAddress.length !== 0 ? true : false}
                        helperText={emailAddress.indexOf("@") === -1 && emailAddress.length !== 0 ? "You need eamil address!" : ""}
                        autoComplete="current-email"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailAddress(event.target.value)
                        }}

                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"                    style={{
                            fontFamily: "STIX"
                        }}
                        autoComplete="current-password"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value)
                        }}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Name"
                        type="name"                    style={{
                            fontFamily: "STIX"
                        }}
                        error={username.length <= 2 && username.length !== 0 ? true : false}
                        helperText={username.length <= 2 && username.length !== 0 ? "Your Name is too short!" : ""}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setUsername(event.target.value)
                        }}
                    />
                </Box>
                <div className="flex flex-col mt-3 items-center justify-bewteen">
                    <SignupBtn variant="contained" type="submit" onClick={(e: React.MouseEvent<HTMLElement>) => {
                        handleSingup(e)
                    }}>Signup</SignupBtn>
                </div>
                    <hr
                        className="w-1/3 mt-6 opacity-50"
                        style={{
                        color: "#736578",
                        backgroundColor: "#736578",
                        height: .5,
                        borderColor: "#736578",
                    }} />
                    <span className="mt-5 cursor-pointer text-main" onClick={() => { navigate('/login') }}>If you have an account?</span>
                <ReactCountryFlag countryCode={location.country} svg/>
            </div>
        </div>
    )
}

export default Signup;