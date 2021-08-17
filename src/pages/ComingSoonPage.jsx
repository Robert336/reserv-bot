import { Paper, TextField, Button } from '@material-ui/core';
import styled from 'styled-components';
import ComingSoonBackground from '../assets/ComingSoonBackground.png';



const PageDiv = styled.div`    
    background-color: transparent;

    width: 100vw;
    height: 100vh;
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
`;

const Title = styled.h1`
    margin: 0em 0em 0em 0em;
    align-self: center;
    margin-bottom: 0.2em;
`;

const SubTitle = styled.h3`
    margin: 0 0 0 0;
    opacity: 70%;
    align-self: center;
    margin: 0.1em;
`;

const BackgroundText = styled.img`
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;

    height: 130%;
    z-index: -1;

`;

const StyledPaper = styled(Paper)`
    padding: 1em 1em 1em 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 15px;
`;

const StyledField = styled(TextField)`
    margin-top: 0.5em;
`;

const StyledButton = styled(Button)`
    margin-top: 0.5em;
    margin-left: 0.1em;
`;

const StyledForm = styled.form`

    margin-top: 1em;
`;


function ComingSoonPage() {
    return (
        <PageDiv>

            <InfoDiv>
                <StyledPaper elevation={3} square="false">
                    <Title>Reserv</Title>
                    <SubTitle>Never miss a gym session.</SubTitle>
                    <SubTitle>Instantly auto-book with the click of a button.</SubTitle>

                    <StyledForm>
                        <StyledField
                            required
                            variant="outlined"
                            id="email-input"
                            placeholder="candice@email.com"
                            size="small"
                            label="email" />
                        <StyledButton>notify me</StyledButton>
                    </StyledForm>

                </StyledPaper>
            </InfoDiv>
            <BackgroundText src={ComingSoonBackground} />
        </PageDiv>
    );
}

export default ComingSoonPage;
