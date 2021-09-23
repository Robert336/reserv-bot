import { useState } from 'react';
import { Paper, TextField, Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import ComingSoonBackground from '../assets/ComingSoonBackground.png';
import firebase from '../api/firebase';
import { Link, useHistory } from 'react-router-dom';
import { Margin } from '@material-ui/icons';

const Title = styled.h1`
    margin: 0em 0em 0em 0em;
    align-self: center;
    margin-bottom: 0.2em;
    font-size: 5em;
    text-shadow: -0.05em 0px 0px #EBB81A;
`;


const PageDiv = styled.div`    
    font-family: "Work Sans";
    
    width: 98vw;
    height: 98vh;
    overflow: hidden;
`;

const InfoDiv = styled.div`
    
    position: absolute;
    
    left: 0;
    right 0;
    top: 0;
    bottom: 0;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;


    overflow: hidden;
`;



const BackgroundText = styled.img`
    position: relative;
    margin-left: 0;
    margin-right: 0;

    height: 130%;
    z-index: -1;

`;

const StyledPaper = styled(Paper)`
    && {
        padding: 1em 1em 1em 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 15px;
    }
`;

const StyledP = styled.p`

    position: absolute;
    text-align: center;
    
    left: 0;
    right 0;
    top: 95vh;
    bottom: 0;

    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
`;


function ComingSoonPage() {
    const history = useHistory();

    function handleSignUp() {
        history.push("/register");
    }

    function handleLogin() {
        history.push("/login");
    }

    return (
        <PageDiv>

            <InfoDiv>
                <StyledPaper elevation={3}>
                    <Title>Reserv</Title>
                    <Typography variant="h4" align="center">Make booking spots at the gym easier</Typography>
                    <Typography variant="h5">Reserve your sessions around your weekly schedule</Typography>
                    <br></br>
                    <Typography variant="subtitle">Sign up for the free beta, it's currently only available for Laurier.</Typography>
                    <br></br>
                    <div>
                        <Button variant="contained" color="primary" size="large" onClick={handleSignUp}>Sign up</Button>
                        <Button size="large" onClick={handleLogin}>Login</Button>
                    </div>


                </StyledPaper>


            </InfoDiv>
            <StyledP>Not affiliated with Wilfrid Laurier University</StyledP>
            <BackgroundText src={ComingSoonBackground} />
        </PageDiv >
    );
}

export default ComingSoonPage;
