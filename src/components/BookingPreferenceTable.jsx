import react, { useState, useEffect, useRef } from 'react';
import { Delete, AddCircle } from '@material-ui/icons';
import { db } from '../api/firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Select,
    MenuItem

} from '@material-ui/core';


export default function BookingPreferenceTable({ currentUser }) {
    const sessionNameRef = useRef();
    const timeRefHour = useRef();
    const timeRefMin = useRef();

    const [error, setError] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [weekday, setWeekday] = useState("Weekday");

    const docRef = doc(db, "users", currentUser.uid);
    function handleWeekdayChange(event) {
        setWeekday(event.target.value);
    }

    function getUserSchedule() {
        getDoc(docRef).then((docSnap) => {
            return docSnap.data();
        }).then((userData) => {
            if (userData.schedule !== undefined) {
                setSchedule(userData.schedule);
            }
            return;
        })
            .catch(err => {
                console.error("Failed to load user data. \n ", err);
                alert("Failed to load your data");
            });

    }

    function handleAdd() {
        const timeHour = timeRefHour.current.value;
        const timeMin = timeRefMin.current.value;
        const sessionName = sessionNameRef.current.value;

        if (sessionName === "") {
            setError("Enter session name");
            return;
        }
        if (weekday === "Weekday") {
            setError("Select a day of the week");
            return;
        }
        if (timeHour === "" || timeMin === "") {
            setError("Enter time");
            return;
        }
        if (isNaN(timeHour) || isNaN(timeMin) || timeHour > 24 || timeHour < 0 || timeMin < 0 || timeMin > 59) {
            setError("Invalid Time");
            return;
        }


        // process inputs
        let newSchedule = [];

        if (schedule !== undefined) {
            newSchedule = schedule.slice();
            newSchedule.push({
                session: sessionName,
                cronSchedule: timeMin + " " + timeHour + " * * " + weekday
            });
        } else {
            newSchedule = [{
                session: sessionName,
                cronSchedule: timeMin + " " + timeHour + " * * " + weekday
            }];
        }
        console.log(newSchedule);
        // update firestore
        setDoc(docRef, { schedule: newSchedule });

        // update state
        setSchedule(newSchedule);
        alert("added reservation");
    }

    function handleDelete(event) {
        console.log(event.target.id);
        if (schedule.length === 1) {
            setSchedule([]);
            setDoc(docRef, { schedule: [] });
        } else {
            const newSchedule = [...schedule];
            newSchedule.splice(event.target.id, 1);
            console.log("array length " + newSchedule.length);
            console.log("after delete: " + newSchedule.session);


            setDoc(docRef, { schedule: newSchedule });
            setSchedule(newSchedule);
        }
    }

    function renderTable() {

        const dayDict = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
        }

        if (schedule) {
            return schedule.map((row, index) => {

                // convert "* * * * *" to an array to be interpreted
                const cronArray = row.cronSchedule.split(' ');

                return (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row">{row.session}</TableCell>
                        <TableCell align="right">{dayDict[cronArray[4]]}</TableCell>
                        <TableCell align="right">{cronArray[1] + ":" + cronArray[0]}</TableCell>
                        <TableCell aligh="right">
                            <Button
                                id={index}
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={handleDelete}
                                endIcon={<Delete />}
                            >Delete</Button>
                        </TableCell>
                    </TableRow>
                )
            });
        }

    }

    useEffect(() => {
        getUserSchedule();
        renderTable();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" align="center">Booking Schdeule</Typography>
            <Table aria-label="Weekly Schedule">
                <TableHead>

                    <TableRow>
                        <TableCell>Session Name</TableCell>
                        <TableCell align="right">Day of the week</TableCell>
                        <TableCell align="right">Time&nbsp;(24-hour)</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderTable()}
                    <TableRow key="add">
                        <TableCell component="th" scope="row">
                            <TextField required value="Fitness Centre Session " inputRef={sessionNameRef} size="small" label="Session" helperText="more sessions coming soon" />
                        </TableCell>
                        <TableCell align="right">
                            <Select required value={weekday} onChange={handleWeekdayChange} size="small" variant="outlined">
                                <MenuItem value="Weekday"><em>Weekday</em></MenuItem>
                                <MenuItem value="0">Sunday</MenuItem>
                                <MenuItem value="1">Monday</MenuItem>
                                <MenuItem value="2">Tuesday</MenuItem>
                                <MenuItem value="3">Wednesday</MenuItem>
                                <MenuItem value="4">Thursday</MenuItem>
                                <MenuItem value="5">Friday</MenuItem>
                                <MenuItem value="6">Saturday</MenuItem>
                            </Select>
                        </TableCell>
                        <TableCell align="right">
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <TextField required
                                    placeholder="15"
                                    style={{ maxWidth: 100 }}
                                    inputRef={timeRefHour}
                                    size="small"
                                    label="Hour"
                                />
                                <TextField required
                                    value="00"
                                    placeholder="00"
                                    style={{ maxWidth: 100 }}
                                    inputRef={timeRefMin}
                                    size="small"
                                    label="Minute"
                                />
                            </div>
                        </TableCell>
                        <TableCell aligh="right">
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<AddCircle />}
                                onClick={handleAdd}
                            >Add</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {error && <Alert onClose={() => setError(null)} severity="error">{error}</Alert>}
        </TableContainer >
    );
}