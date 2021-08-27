//import config from '../config.json';
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import validator from "validator";

let FIREBASE_CONFIG = {
    "apiKey": process.env.FIREBASE_API_KEY,
    "authDomain": "reserv-323222.firebaseapp.com",
    "databaseURL": "https://reserv-323222-default-rtdb.firebaseio.com",
    "projectId": "reserv-323222",
    "storageBucket": "reserv-323222.appspot.com",
    "messagingSenderId": "173348046260",
    "appId": "1:173348046260:web:7680fb1b10314d54361ee1",
    "measurementId": "G-X0K21D26TS"
};

if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    FIREBASE_CONFIG = {
        "apiKey": process.env.REACT_APP_FIREBASE_API_KEY,
        "projectId": "reserv-323222"
    }; // .env file data (localhost)
}
console.log(FIREBASE_CONFIG);

const firebaseApp = initializeApp({ FIREBASE_CONFIG });
//const auth = firebase.auth();
const db = firebaseApp.firestore();
const functions = firebaseApp.functions();
//const storage = firebase.storage();

/*
*
* Use emulator for testing
*
*/
if (window.location.hostname === "127.0.0.1") {
    console.log("HOSTNAME ==== " + window.location.hostname);

    //auth.useEmulator("http://127.0.0.1:9099/");
    db.useEmulator("127.0.0.1", 8080);
    //storage.useEmulator("http://127.0.0.1:9199/");
    functions.useEmulator("http://127.0.0.1:5001");

}

// using the GitHub secrets
//firebase.initializeApp(config.firebaseConfig); // using the config.json file

async function notifyMe(name, email) {

    try {

        console.log(name + " " + email);
        // validate input first
        if (!validator.isEmail(email) || validator.isEmpty(email)) {
            throw Error("Please enter a valid email address.");
        }
    } catch (err) {
        throw Error("Please enter a valid email address.");
    }

    // if no error, then add the email to the database
    // create new entry into the notify collection
    const timeElapsed = Date.now();
    const date = new Date(timeElapsed);
    const date_str = date.toISOString();
    const notifyEmail = {
        name: name,
        email: email,
        date: date_str
    }

    await db.collection("interested").add(notifyEmail)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }).catch((error) => {
            console.error("Error adding document: ", error);
        })

}

export default { firebase, notifyMe };