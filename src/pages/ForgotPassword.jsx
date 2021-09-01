import { useState, useRef } from 'react';
import { Paper, TextField, Button, FormControl, Alert } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import validator from 'validator';



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
            <div>
                <h2>Reset Password</h2>
                {message && <Alert variant="filled" severity="success">{message}</Alert>}
                {error && <Alert variant="filled" severity="error">{error}</Alert>}
                <form>

                    <FormControl>
                        <TextField required inputRef={emailRef} label="Email"></TextField>
                    </FormControl>


                    <Button onClick={handleSubmit} disabled={loading}>Reset</Button>

                </form>
                <div>
                    Need an account? <Link to="/register">Sign Up</Link>
                </div>
                <div>
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </AuthProvider>
    );
}