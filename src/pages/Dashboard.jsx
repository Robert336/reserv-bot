import {
    Button,
    Paper,
    Container,
    Typography,
    TextField,
    Alert,
} from '@material-ui/core';


import React, { useState, useRef } from 'react';
import { useAuth, } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import BookingPreferenceTable from '../components/BookingPreferenceTable';
import { functions } from "../api/firebase";
import { findSlots } from '../api/reserve';
import { httpsCallable } from '@firebase/functions';
import { PasswordRounded } from '@material-ui/icons';

const Header = styled.div`
    background: white;    
    margin-bottom: 1em;
    padding: 1em;
`;

const PageContainer = styled.div`
    min-height: 100vh;
    background: rgb(172,143,255);
    background: linear-gradient(0deg, rgba(172,143,255,1) 0%, rgba(235,184,26,1) 150%);

`;
const StyledPaper = styled(Paper)`
    padding: 1em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
`;

export default function Dashboard() {
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const history = useHistory();
    const [started, setStarted] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    function handleStart(event) {
        setStarted(true);
        const login = httpsCallable(functions, 'loginUserWLU');
        const reserveSlots = httpsCallable(functions, 'reserveSlotsCookieWLU');

        login({ email: emailRef.current.value, password: passwordRef.current.value })
            .then((result) => {
                const cookiesArray = result.data;
                console.log("cookiesArray", cookiesArray);

                findSlots(currentUser.uid)
                    .then((slots) => {
                        const slotsArray = slots;
                        console.log("slots to reserve: ", slotsArray);
                        console.log("Cookies", cookiesArray);
                        reserveSlots({
                            slotIDs: slots,
                            cookies: cookiesArray
                        })
                    })
                    .then(response => { console.log(response) })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err))
            .finally(setStarted(false));

    }

    async function handleLogout(event) {
        setError('');
        try {
            await logout();
            history.push("/login");
        } catch {
            setError("Failed to logout");
        }
    }

    return (
        <PageContainer>
            <Header>
                <Typography align="center" variant="h4">Reserv Dashboard</Typography>
                <Typography align="center" variant="h6">[BETA Version 1]</Typography>
                {error && alert(error)}

            </Header>
            <Container>
                <StyledPaper>
                    <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                    {/* <Button variant="outlined" to="/update-profile">Update Profile</Button> */}
                    <BookingPreferenceTable currentUser={currentUser} />
                </StyledPaper>
            </Container>

            <Container>
                {started ?
                    <StyledPaper>
                        <Typography variant="h4">Loading... (this may take a minute)</Typography>
                    </StyledPaper>
                    :
                    <StyledPaper>
                        <Typography variant="h5">
                            Start
                        </Typography>
                        <Alert style={{ margin: 5 }} variant="outlined" severity="info">Input your login info for LaurierAthletics.com.
                            <br></br>This information is NOT saved in our database.
                        </Alert>
                        <Typography></Typography>
                        <Typography><em></em></Typography>
                        <TextField inputRef={emailRef} label="Athletics Email" />
                        <TextField inputRef={passwordRef} type="password" label="Athletics Password" />
                        <Button variant="contained" onClick={handleStart} disabled={started}>
                            Start
                        </Button>
                    </StyledPaper>
                }
            </Container>

            {/* <Container>
                <StyledPaper>
                    <Typography variant="h5">Live Feed</Typography>
                </StyledPaper>
            </Container> */}
        </PageContainer>
    );
}
