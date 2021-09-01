import { useState, useRef } from 'react';
import { Paper, TextField, Button } from '@material-ui/core';
import { Alert } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import validator from 'validator';

import styled from 'styled-components';

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

    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();

        const password = passwordRef.current.value;
        const email = emailRef.current.value;

        if (!validator.isEmail(email)) {
            return setError("Not a valid email");
        }

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            history.push("/Dashboard");
        } catch (error) {
            setError("Failed to login");
            console.log(error);
        }

        setLoading(false);

    }

    return (
        <AuthProvider>
            <PageContainer>
                <StyledPaper>
                    <Reserv>Login to Reserv</Reserv>
                    {error && <Alert severity="error" >{error}</Alert>}
                    <StyledForm>
                        <TextField required inputRef={emailRef} label="Email"></TextField>
                        <TextField required inputRef={passwordRef} label="Password"></TextField>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>Login</Button>
                    </StyledForm>
                    <div>
                        Need an account? <Link to="/register">Sign Up</Link>
                    </div>
                    <div>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                </StyledPaper>

            </PageContainer >
        </AuthProvider >
    );
}