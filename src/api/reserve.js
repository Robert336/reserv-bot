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
 * Reserves a slot using user's credentials
 * @param email // user's email to wlu ac
 * @param password // user's password to wlu ac
 * @param slotID // Id of the slot to reserve
 * 
 * @returns promise of server response object
 */
async function resrveSlotCredWLU(email, password, slotID) {
    const loginResponse = await loginUserWLU(email, password);
    const loginSessionCookies = loginResponse.headers.raw()['set-cookie'];

    const myHeaders = new fetch.Headers();
    // myHeaders.append("Cookie", "BIGipServerathletics_pool_https=978586122.47873.0000; PHPSESSID=smr2n9geg52pu2o5qsbipn5id4");
    myHeaders.append("Cookie", loginSessionCookies);

    const formdata = new FormData();
    formdata.append("waiver1", "Agree");
    formdata.append("waiver2", "Agree");
    formdata.append("SlotID", slotID);
    formdata.append("makereservation", "1");

    const requestOptions = {
        method: "POST",
        headers: myHeaders, // inject cookies into new request headers
        body: formdata,
        redirect: "follow",
    };

    return fetch("https://www.laurierathletics.com/ecommerce/user/backendcrud.php", requestOptions)
        .catch((error) => {
            console.error("Error with reservation" + error);
            alert("Error reserving SlotID:" + slotID);
        });
}

/**
 * Reserves a slot using user's credentials
 * @param cookies // cookies from a logged-in session
 * @param slotID // ID of the slot to reserve
 * 
 * @returns promise of server response object
 */
async function resrveSlotCookieWLU(cookies, slotID) {


}

/**
 * Login to wlu athlectics centre
 * @param email // user's email to wlu ac
 * @param password // user's password to wlu ac
 * 
 * @returns promise of server response object
 */
async function loginUserWLU(email, password) {

    console.log("Start Login");

    const requestOptions = {
        method: "GET",
    }
    // First make a GET request to retrieve cookies
    return fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
        .then((response) => { return response.headers.raw()['set-cookie'] }) // extract cookies from headers
        .then((cookies) => {

            // create new headers using the cookies retrieved from the GET request.
            const myHeaders = new fetch.Headers();
            // myHeaders.append("Cookie", "BIGipServerathletics_pool_https=978586122.47873.0000; PHPSESSID=smr2n9geg52pu2o5qsbipn5id4");
            myHeaders.append("Cookie", cookies);

            const formdata = new FormData();
            formdata.append("UserLogin", email);
            formdata.append("Password", password);
            formdata.append("submit_Login", "Login");

            // create a POST request which will login
            const requestOptions = {
                method: "POST",
                headers: myHeaders, // inject cookies into new request headers
                body: formdata,
                redirect: "follow",
            }
            // send the POST request to login
            return fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
                .catch((error) => {
                    console.error("Error with login" + error);
                    alert("Error logging into WLU Athletics Centre :" + slotID);
                });
        }).catch((error) => {
            console.error("Error loading index.php" + error);
            alert("Error getting WLU Athlectics Centre login page");
        });
}
