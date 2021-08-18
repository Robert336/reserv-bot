import { Paper, TextField } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import styled from 'styled-components';
import ComingSoonBackground from '../assets/ComingSoonBackground.png';
import ClockWidget from '../components/ClockWidget';


const PageDiv = styled.div`    
    font-family: "Work Sans";
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


    overflow: hidden;
`;

const Title = styled.h1`
    margin: 0em 0em 0em 0em;
    align-self: center;
    margin-bottom: 0.2em;
    font-size: 5em;
    text-shadow: -0.05em 0px 0px #EBB81A;
`;

const SubTitle = styled.h3`
    margin: 0 0 0 0;
    opacity: 80%;
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
    && {
        margin-right: 0.5em;
    }    
`;

const StyledButton = styled(Button)`
    && {
        font-family: "Work Sans";
        background-color: #37297F;
        color: #fff;
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        padding: 7px 14px;
        &:hover {
        background-color: #5469d4;
        }
    }

   
`;

const StyledForm = styled.form`

    margin-top: 1em;
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

const Date = styled.h3`

    color: #37297F;

`;


function ComingSoonPage() {
    return (
        <PageDiv>

            <InfoDiv>
                <StyledPaper elevation={3} square="false">
                    <ClockWidget />
                    <Title >Reserv</Title>
                    <SubTitle>Never miss a gym session.</SubTitle>
                    <SubTitle>Instantly auto-book with the click of a button.</SubTitle>
                    <Date>WLU 21/09/10</Date>
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
            <StyledP>Not affiliated with Wilfrid Laurier University</StyledP>
            <BackgroundText src={ComingSoonBackground} />
        </PageDiv >
    );
}

export default ComingSoonPage;


