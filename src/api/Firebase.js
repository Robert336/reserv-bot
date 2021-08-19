import config from '../config.json';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import validator from "validator";


const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG;

firebase.initializeApp(FIREBASE_CONFIG); // using the GitHub secrets
//firebase.initializeApp(config.firebaseConfig); // using the config.json file


const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
/*
*
* Use emulator for testing
*
*/
// auth.useEmulator("http://localhost:9099");
// db.useEmulator("http://localhost:8080");
// storage.useEmulator("http://localhost:9199");


async function notifyMe(event) {
    event.preventDefault();

    const email = event.target.elements[0].value;
    try {
        // validate input first
        if (!validator.isEmail(email) || validator.isEmpty(email))
            throw Error("Please enter a valid email address.");
    } catch (err) {
        alert(err.message);
    }

    // if no error, then add the email to the database
    // create new entry into the notify collection
    const notifyEmail = {
        email: email
    }

    await db.collection("interested").add(notifyEmail)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }).catch((error) => {
            console.error("Error adding document: ", error);
        })

}


export default {
    firebase,
    auth,
    db,
    storage,
    notifyMe
};