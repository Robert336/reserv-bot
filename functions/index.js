
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
// const getUrls = require("get-urls");
// const cors = require("cors")({ origin: true });
// const axios = require('axios');
const scrape = require("./scrape");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const functions = require("firebase-functions");
const admin = require("firebase-admin"); // firestore


admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


/**
 * Scrapes the reservation table and adds slots to database
 */
exports.scrapeTable = scrape.scrapeTable;


/**
 * Login to wlu athlectics centre
 * @param email // user's email to wlu ac
 * @param password // user's password to wlu ac
 * @returns loggedInCookies // Array of Cookies accosiated with the logged-in user
 */
exports.loginUserWLU = functions.https.onCall((data, context) => {

    const email = data.email;
    const password = data.password;

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

                });
            return cookies
        }).catch((error) => {
            console.error("Error loading index.php" + error);
        });
});

/**
* Reserve slots using user's session cookies
* @returns promise of server response object
*/
exports.reserveSlotsCookieWLU = functions.https.onCall(async (data) => {
    const cookies = data.cookies;
    const slotIDs = data.slotIDs;

    console.log("Cookies used", cookies);
    console.log("slotIDs", slotIDs);

    const myHeaders = new fetch.Headers();
    myHeaders.append("Cookie", cookies);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const responsePromises = slotIDs.map(slot => {
        const urlencoded = new URLSearchParams();
        urlencoded.append("waiver1", "Agree");
        urlencoded.append("waiver2", "Agree");
        urlencoded.append("SlotID", slot);
        urlencoded.append("makereservation", "1");

        console.log("urlencoded: " + urlencoded);
        console.log("MyHeaders: " + myHeaders.get('Cookie'));

        const requestOptions = {
            method: "POST",
            headers: myHeaders, // inject cookies into new request headers
            body: urlencoded,
            redirect: "follow",
        };

        fetch("https://www.laurierathletics.com/ecommerce/user/backendcrud.php", requestOptions)
            .then(response => {
                return response.data;
            });
    });

    const responseArray = await Promise.all(responsePromises);

    return responseArray;
});

// exports.test = functions.pubsub.schedule("every 1 minutes")
//     // Users can choose timezone - default is America/Los_Angeles
//     .onRun(async () => {
//         console.log("test pub/sub");
//     });