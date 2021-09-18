import { getDoc, getDocs, doc, setDoc, collection, where, query } from 'firebase/firestore';
import { db } from './firebase';
const fetch = require("node-fetch");

/*
    API to handle making a reservation on laurierathletics.com
    This will run run client-side version of the reservation system.

    TODO: Store user username/password to the athletics centre in a cookie
    TODO: Call upon the cookie to login and reserve a slot

    Option 1: User needs to have the browser active inorder to have to reservation complete
    Option 2: Session cookies for each user are stored on the server (used for server-side reservation)
*/

/** WLU Reservation Form Data (HTTP Request) 
 * 
 *  waiver1: Agree
 *  waiver2: Agree
 *  SlotID: [SLOT ID HERE]
 *  makereservation: 1
 * 
*/

/**
 * This will be used to run the bot locally when the user clicks "start"
 * It will handle checking and reserving all slots that match the requirements of the user
 * 
 * @param currentUserUID user's uid
 * 
 * @returns slots
 */
export function findSlots(currentUserUID) {
    console.log("Finding slots");

    const userDocRef = doc(db, "users", currentUserUID);

    return getDoc(userDocRef).then((docSnap) => {
        const data = docSnap.data();
        return data.schedule;
    }).then((schedule) => {
        // an array of slots to resrve
        let slotsToReserve = [];

        console.log("Schedule", schedule);
        // interate over each entry in user's booking table
        //schedule.forEach((item) => {
        for (let i = 0; i < schedule.length; i++) {
            const cronArray = schedule[i].cronSchedule.split(" ");
            console.log("Cron array = ", cronArray);
            const slotsRef = collection(db, "slots");


            const q = query(slotsRef, where("sessionType", "==", schedule[i].session));
            getDocs(q).then((querySnap) => {
                // interate over all slots with the matching sessionType
                //console.log(querySnap);
                querySnap.forEach((doc) => {
                    const data = doc.data();
                    //console.log(data);

                    // convert timestamp to JS Date object
                    const resDateTime = data.resDateTime.toDate();

                    // check if slot is on the correct day and hour as requested
                    //console.log(resDateTime.getDay(), "==", cronArray[4], "&&", resDateTime.getHours(), "==", cronArray[1]);
                    //console.log(resDateTime.getDay() == cronArray[4] && resDateTime.getHours() == cronArray[1]);
                    if (resDateTime.getDay() === parseInt(cronArray[4]) && resDateTime.getHours() === parseInt(cronArray[1])) {
                        slotsToReserve.push(data.slotId);
                        console.log("Pushed slot: " + data.slotId);
                    }
                });
            }).catch(err => console.error(err));
        }

        console.log("slots to reserve (reserve.js): ", slotsToReserve);
        return new Promise((resolve, reject) => {
            if (slotsToReserve === undefined && slotsToReserve === null) {
                reject("Slots not defined, and null");
            } else if (slotsToReserve.length >= 0) {
                resolve(slotsToReserve);
            }
        });
    }).catch(err => console.error(err));


}



/**
 * Reserves a slot using user's credentials
 * @param email // (String) user's email to wlu ac
 * @param password // (String) user's password to wlu ac
 * @param slotID // (String) Id of the slot to reserve
 * 
 * @returns promise of server response object
 */
function resrveSlotCredWLU(email, password, slotID) {

    return loginUserWLU(email, password)
        .then(cookies => {
            const myHeaders = new fetch.Headers();
            myHeaders.append("Cookie", cookies);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const urlencoded = new URLSearchParams();
            urlencoded.append("waiver1", "Agree");
            urlencoded.append("waiver2", "Agree");
            urlencoded.append("SlotID", slotID);
            urlencoded.append("makereservation", "1");

            console.log("urlencoded: " + urlencoded);
            console.log("MyHeaders: " + myHeaders.get('Cookie'));

            const requestOptions = {
                method: "POST",
                headers: myHeaders, // inject cookies into new request headers
                body: urlencoded,
                redirect: "follow",
            };

            return requestOptions;
        })
        .then((requestOptions) => {
            return fetch("https://www.laurierathletics.com/ecommerce/user/backendcrud.php", requestOptions);
        })
        .catch(err => console.log("ERROR WITH LOGIN PROCESS >>> " + err));
}

/**
 * Reserves a slot using user's credentials
 * @param cookies // cookies from a logged-in session
 * @param slotID // ID of the slot to reserve
 * 
 * @returns promise of server response object
 */
function resrveSlotCookieWLU(cookies, slotID) {

    const myHeaders = new fetch.Headers();
    myHeaders.append("Cookie", cookies);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("waiver1", "Agree");
    urlencoded.append("waiver2", "Agree");
    urlencoded.append("SlotID", slotID);
    urlencoded.append("makereservation", "1");

    console.log("urlencoded: " + urlencoded);
    console.log("MyHeaders: " + myHeaders.get('Cookie'));

    const requestOptions = {
        method: "POST",
        headers: myHeaders, // inject cookies into new request headers
        body: urlencoded,
        redirect: "follow",
    };

    return fetch("https://www.laurierathletics.com/ecommerce/user/backendcrud.php", requestOptions)
        .catch(error => console.error("Error sending reserve request: ", error));
}


/**
 * Login to wlu athlectics centre
 * @param email // user's email to wlu ac
 * @param password // user's password to wlu ac
 * @returns loggedInCookies // Array of Cookies accosiated with the logged-in user
 */
function loginUserWLU(email, password) {

    console.log("Start Login");

    const requestOptions = {
        method: "GET",
        mode: "cors",
    }
    // First make a GET request to retrieve cookies
    return fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
        .then((response) => {
            console.log(response);
            return response.headers.raw()['set-cookie'];
        }) // extract cookies from headers
        .then((cookies) => {

            console.log("GET index.php cookies " + cookies);

            // create new headers using the cookies retrieved from the GET request.
            const myHeaders = new fetch.Headers();
            // myHeaders.append("Cookie", "BIGipServerathletics_pool_https=978586122.47873.0000; PHPSESSID=smr2n9geg52pu2o5qsbipn5id4");
            myHeaders.append("Cookie", cookies);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const urlencoded = new URLSearchParams();
            urlencoded.append("UserLogin", email);
            urlencoded.append("Password", password);
            urlencoded.append("submit_Login", "Login");

            // create a POST request which will login
            const requestOptions = {
                method: "POST",
                headers: myHeaders, // inject cookies into new request headers
                body: urlencoded,
                redirect: "follow",
            }
            // send the POST request to login
            fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
                .catch((error) => {
                    console.error("Error with login" + error);
                    alert("Error logging into WLU Athletics Centre");
                });
            return cookies
        }).catch((error) => {
            console.error("Error loading index.php" + error);
            alert("Error getting WLU Athlectics Centre login page");
        });
}
