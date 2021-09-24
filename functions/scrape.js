// // const cors = require("cors")({ origin: true });
// //const axios = require('axios');
const cheerio = require("cheerio");
// // const getUrls = require("get-urls");
const fetch = require("node-fetch");
const FormData = require("form-data");
const functions = require('firebase-functions');
// const functions = require("firebase-functions");
const admin = require("firebase-admin"); // firestore
// admin.initializeApp();


//exports.scrapeTable = functions.https.onCall((data, context) => {
exports.scrapeTable = functions.pubsub.schedule("50 * * * *")
    .timeZone('America/New_York')
    .onRun(() => {
        console.log("Start scraper");

        const formdata = new FormData();
        formdata.append("UserLogin", "mazz8040@mylaurier.ca");
        formdata.append("Password", "82ex2UW%");
        formdata.append("submit_Login", "Login");

        const requestOptions = {
            method: "GET",
        }
        // First make a GET request to retrieve cookies
        return fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
            .then((response) => { return response.headers.raw()['set-cookie'] }) // extract cookies from headers
            .then((cookies => {

                console.log("SET-COOKIE HEADERS >>> " + cookies);

                // create new headers using the cookies retrieved from the GET request.
                const myHeaders = new fetch.Headers();
                // myHeaders.append("Cookie", "BIGipServerathletics_pool_https=978586122.47873.0000; PHPSESSID=smr2n9geg52pu2o5qsbipn5id4");
                myHeaders.append("Cookie", cookies);

                // create a POST request which will login
                const requestOptions = {
                    method: "POST",
                    headers: myHeaders, // inject cookies into new request headers
                    body: formdata,
                    redirect: "follow",
                };
                // send the POST request to login
                return fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
                    .then((response) => response.text()) // get the html in plain text
                    .then((html) => {
                        const $ = cheerio.load(html);

                        //console.log(html);

                        // get a new write batch (firebase)
                        const batch = admin.firestore().batch();

                        var writes = 0; // max writes = 500

                        // find all the rows in the table containing resrvation information (slots)
                        // 
                        $("#DataTables_Table_1 > tbody > tr").each((index, tr) => {
                            console.log("Writes in this batch:", writes);
                            if (writes >= 500) {
                                throw new error("max writes reached: >= 500");
                            }

                            // get the row data (as an object, not string)
                            const tds = $(tr).find("td");

                            // combine reservation date and time string to create Date object
                            const resDateTime = new Date($(tds[3]).text() + "T" + $(tds[4]).text());

                            const capacityArr = $(tds[6]).text().split(" "); // convert "0 of 80" to ["0","of","80"] to extract numbers

                            const maxCapacity = parseInt(capacityArr[2]);
                            const currCapacity = parseInt(capacityArr[0]);
                            const duraction = parseInt($(tds[5]).text());
                            const slotId = $(tds[0]).text();
                            let sessionType = $(tds[1]).text();
                            const location = $(tds[2]).text()

                            // sanitize sessionType by removing special characters and " - Sep 12" 
                            sessionType = sessionType.substring(0, sessionType.indexOf(" - "));
                            sessionType = sessionType.replace(/[^a-zA-Z ]/g, "");
                            // create slot object with all perameters of a resrvation 
                            const slot = {
                                slotId: slotId,            // unique id (String) (also used as the document id)
                                sessionType: sessionType,  // description of the session (String)
                                location: location,        // (String)
                                resDateTime: resDateTime,  // date and time of the session (date object)
                                duraction: duraction,      // length of the session (Int)
                                currCapacity: currCapacity,// anount of people registered for the session (Int)
                                maxCapacity: maxCapacity,  // total reservations allowed (Int)
                            };

                            console.log("slot >>>", slot);

                            // add the new entry to the batch
                            batch.set(admin.firestore().collection("slots").doc(slot.slotId), slot);

                            writes++;
                        });

                        // push changes to firestore (locks database until changes are complete)
                        console.log("commiting batch");
                        return batch.commit();
                    }).catch((error) => console.log("error", error));

            }));

    });
