//import config from '../config.json';
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, doc, setDoc } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
//import { getStorage } from "firebase/storage";
import validator from "validator";

/*

    THIS CONFIG IS FOR THE **DEVELOPMENT DEPLOYMENT**

*/
let FIREBASE_CONFIG = {
    apiKey: "AIzaSyABBBlukEzmazXjZp_QPytuo722SLtTwZI",
    authDomain: "reserv-dev.firebaseapp.com",
    projectId: "reserv-dev",
    storageBucket: "reserv-dev.appspot.com",
    messagingSenderId: "987246716040",
    appId: "1:987246716040:web:d61b0c44564d01f051ab3d",
    measurementId: "G-W1LWS1W67M"
};

// if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
//     FIREBASE_CONFIG = {
//         "apiKey": process.env.REACT_APP_FIREBASE_API_KEY,
//         "projectId": "reserv-dev"
//     }; // .env file data (localhost)
// }
console.log(FIREBASE_CONFIG);

const firebaseApp = initializeApp(FIREBASE_CONFIG);

const db = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp);
const auth = getAuth(firebaseApp);

console.log("auth >>> ", auth);
console.log("functions >>> ", functions);
console.log("db >>> ", db);


/*
* Use emulator for testing
*/
if (window.location.hostname === "127.0.0.1") {
    console.log("HOSTNAME ==== " + window.location.hostname);

    //storage.useEmulator("http://127.0.0.1:9199/");
    //auth.useEmulator("http://127.0.0.1:9099/");

    connectFirestoreEmulator(db, "http://127.0.0.1", 8080);
    connectFunctionsEmulator(functions, "http://127.0.0.1", 5001);
    connectAuthEmulator(auth, "http://127.0.0.1", 9099);
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

    await setDoc(doc(db, "interested", "interested"), notifyEmail)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });

    // await db.collection("interested").add(notifyEmail)
    //     .then((docRef) => {
    //         console.log("Document written with ID: ", docRef.id);
    //     }).catch((error) => {
    //         console.error("Error adding document: ", error);
    //     })

}


export { notifyMe, auth, db, functions };
export default firebaseApp;
