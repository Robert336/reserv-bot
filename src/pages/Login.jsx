import { useState, useRef } from 'react';
import { Paper, TextField, Button, FormGroup, FormControl, InputLabel, Input } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import validator from 'validator';



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
            <div>
                <h2>Login</h2>
                <form>

                    <FormControl>
                        <TextField required inputRef={emailRef} label="Email"></TextField>
                    </FormControl>

                    <FormControl>
                        <TextField required inputRef={passwordRef} label="Password"></TextField>
                    </FormControl>


                    <p>{error}</p>
                    <Button onClick={handleSubmit} disabled={loading}>Login</Button>

                </form>
                <div>
                    Need an account? <Link to="/register">Sign Up</Link>
                </div>
                <div>
                    <Link to="/forgot-password">Forgot passowrd?</Link>
                </div>

            </div>
        </AuthProvider >
    );
}