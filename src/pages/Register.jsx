import { useState, useRef } from 'react';
import { Paper, TextField, Button, FormGroup, FormControl, InputLabel, Input } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import validator from 'validator';



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
            <div>
                <h2>Register</h2>
                <div>
                    <p>{error}</p>
                    <FormControl>
                        <TextField required inputRef={emailRef} label="Email"></TextField>
                    </FormControl>

                    <FormControl>
                        <TextField required inputRef={passwordRef} label="Password"></TextField>
                    </FormControl>

                    <FormControl>
                        <TextField required inputRef={passwordConfirmRef} label="Confirm Password"></TextField>
                    </FormControl>

                    <Button onClick={handleSubmit} disabled={loading}>Register</Button>

                </div>
                <div>
                    Already have an account? <Link to="/login">Login</Link>
                </div>

            </div>
        </AuthProvider >
    );
}