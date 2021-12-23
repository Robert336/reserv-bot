import { useState, useRef } from 'react';
import { Paper, TextField, Button, FormControl, Alert } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import validator from 'validator';



const PageContainer = styled.div`
    
    background: rgb(172,143,255);
    background: linear-gradient(0deg, rgba(172,143,255,1) 0%, rgba(235,184,26,1) 100%);
    
    width: 100vw;
    height: 100vh;    
    display: grid;
    place-items: center;
`;

const StyledPaper = styled(Paper)`
    position: relative;    
    font-family: "Work Sans";

    display: grid;
    max-width: 30em;
    width: 80%;

    padding-bottom: 1em;
    padding: 2em;
`;

const Reserv = styled.h1`
    font-family: "Work Sans";
    font-style: normal;
    font-weight: bold;
    font-size: 3em;
    text-align: center;
    color: #000000;

    text-shadow: -3px 0px 0px #EBB81A;

`;

const StyledForm = styled.div`
    display: grid;
    grid-row-gap: 0.5em;
    margin: 1em;

`;



export default function ForgotPassword() {
    const emailRef = useRef();

    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const email = emailRef.current.value;


        if (!validator.isEmail(email)) {
            return setError("Not a valid email");
        }

        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(email);
            setMessage("Check your inbox for further instructions");
        } catch (error) {
            setError("Failed to reset password");
            console.log(error);
        }

        setLoading(false);

    }

    return (
        <AuthProvider>
            <PageContainer>
                <StyledPaper>
                    <Reserv>Reset Password</Reserv>
                    {message && <Alert variant="filled" severity="info">{message}</Alert>}
                    {error && <Alert variant="filled" severity="error">{error}</Alert>}
                    <StyledForm>

                        <FormControl>
                            <TextField required inputRef={emailRef} label="Email"></TextField>
                        </FormControl>


                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>Reset</Button>

                    </StyledForm>
                    <div>
                        Need an account? <Link to="/register">Sign Up</Link>
                    </div>
                    <div>
                        <Link to="/login">Login</Link>
                    </div>
                </StyledPaper>
            </PageContainer>
        </AuthProvider>
    );
}