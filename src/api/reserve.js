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
const fetch = require("node-fetch");

// not used for the x-www-form-urlencoded
// const FormData = require("form-data"); 

// console.log("Test rserveSlotCredWLU");

// const reserveResp = resrveSlotCredWLU("mazz8040@mylaurier.ca", "82ex2UW%", "2791");
// console.log("resposne: " + reserveResp.ok);
// console.log("End test");

// console.log("Test loginUser");
// loginUserWLU("mazz8040@mylaurier.ca", "82ex2UW%")
//     .then(cookies => console.log(cookies));

// console.log("Test Reserve");
// resrveSlotCredWLU("mazz8040@mylaurier.ca", "82ex2UW%", "2791")
//     .then(response => response.text())
//     .catch(err => console.error(err));


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
    }
    // First make a GET request to retrieve cookies
    return fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
        .then((response) => { return response.headers.raw()['set-cookie'] }) // extract cookies from headers
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
