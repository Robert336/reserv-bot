import { breakpoints } from "../utils/Breakpoints";
import React from "react";
import Styled from "styled-components";


const ClockPiece = Styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 0 0.12rem;
flex-grow: 1;
color: #30292F;
h4 {
font-size: 1.35rem;
${breakpoints("font-size", [
    { 300: "1rem" },
    { 250: "0.9rem" }
])}
margin: 0;
}
p {
font-size: 0.75rem;
${breakpoints("font-size", [
    { 300: "0.6rem" },
    { 250: "0.56rem" }
])}
margin: 0;
}
`;
const ClockDivider = Styled.div`
    border-left: 2px solid #30292F;
`;

export class ClockWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }
    componentDidMount() {
        setInterval(
            () => this.setState({ date: new Date() }),
            1000
        );
    }
    render() {
        const hackathonStartTime = 1631289600000; // use currentmillis.com to find this number
        const countdown = hackathonStartTime - this.state.date;
        const days = (countdown - (countdown % 86400000)) / 86400000;
        const hours = ((countdown % 86400000) - (countdown % 3600000)) / 3600000;
        const minutes = ((countdown % 3600000) - (countdown % 60000)) / 60000;
        const seconds = ((countdown % 60000) - (countdown % 1000)) / 1000;

        return (
            <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
                <ClockPiece>
                    <h4>{days}</h4>
                    <p>DAYS</p>
                </ClockPiece>

                <ClockPiece>
                    <h4>{hours}</h4>
                    <p>HRS</p>
                </ClockPiece>

                <ClockPiece>
                    <h4>{minutes}</h4>
                    <p>MINS</p>
                </ClockPiece>

                <ClockPiece>
                    <h4>{seconds}</h4>
                    <p>SECS</p>
                </ClockPiece>
            </div>
        );
    }
};
export default ClockWidget;

const NEXT_EVENT_YEAR = 2021;
const NEXT_EVENT_MONTH = 9;
const NEXT_EVENT_DAY = 10;
const NEXT_EVENT_HOUR = 0;

const NEXT_EVENT_DATE = new Date(NEXT_EVENT_YEAR, NEXT_EVENT_MONTH, NEXT_EVENT_DAY, NEXT_EVENT_HOUR, 0, 0, 0);

// eslint-disable-next-line no-unused-vars
function getTimeLeft() {
    let timeLeft = new Date(NEXT_EVENT_DATE - new Date());
    let days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    timeLeft %= (24 * 60 * 60 * 1000);

    let hours = Math.floor(timeLeft / (60 * 60 * 1000));
    timeLeft %= (60 * 60 * 1000);

    let minutes = Math.floor(timeLeft / (60 * 1000));
    timeLeft %= (60 * 1000);

    let seconds = Math.floor(timeLeft / 1000);
    return { "days": days, "hours": hours, "minutes": minutes, "seconds": seconds };

}