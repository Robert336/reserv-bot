import { useState, useRef } from 'react';
import { Paper, TextField, Button, Alert } from '@material-ui/core';
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

export default function Register() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        const password = passwordRef.current.value;
        const passwordConfirm = passwordConfirmRef.current.value;
        const email = emailRef.current.value;

        if (password !== passwordConfirm) {
            return setError("Passwords do not match");
        } else if (!validator.isStrongPassword(password, { minLength: 6 })) {
            return setError("Password must contain at least 1 [a-z], 1 [A-Z], 1 Symbol, and 1 [0-9]");
        }
        if (!validator.isEmail(email)) {
            return setError("Not a valid email");
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password);
        } catch (error) {
            setError("Failed to create an account");
            console.log(error);
        }

        setLoading(false);
    }

    return (
        <AuthProvider>
            <PageContainer>
                <StyledPaper>
                    <Reserv>Sign up for Reserv</Reserv>
                    {error && <Alert severity="error" >{error}</Alert>}
                    <StyledForm>
                        <TextField required inputRef={emailRef} label="Email"></TextField>
                        <TextField required inputRef={passwordRef} label="Password"></TextField>
                        <TextField required inputRef={passwordConfirmRef} label="Confirm Password"></TextField>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>Register</Button>
                    </StyledForm>
                    <div>
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </StyledPaper>
            </PageContainer>
        </AuthProvider >
    );
}