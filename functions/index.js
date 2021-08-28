/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
// const getUrls = require("get-urls");
// const cors = require("cors")({ origin: true });
// const axios = require('axios');
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const functions = require("firebase-functions");
const FormData = require("form-data");
const admin = require("firebase-admin"); // firestore

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.test = functions.pubsub.schedule("every 2 minutes")
    // Users can choose timezone - default is America/Los_Angeles
    .onRun((context) => {
        console.log("test pub/sub");

    });
//                                              min hr
exports.scrapeTable = functions.pubsub.schedule("30 23 * * *")
    // Users can choose timezone - default is America/Los_Angeles
    .timeZone("America/Toronto")
    .onRun((context) => {
        console.log("Start scraper");

        const formdata = new FormData();
        formdata.append("UserLogin", "mazz8040@mylaurier.ca");
        formdata.append("Password", "82ex2UW%");
        formdata.append("submit_Login", "Login");

        const myHeaders = new fetch.Headers();
        myHeaders.append("Cookie", "BIGipServerathletics_pool_https=978586122.47873.0000; PHPSESSID=smr2n9geg52pu2o5qsbipn5id4");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        return fetch("https://www.laurierathletics.com/ecommerce/user/home.php", requestOptions)
            .then((response) => response.text())
            .then((html) => {
                const $ = cheerio.load(html);

                console.log(html);

                // get a new write batch
                const batch = admin.firestore().batch();

                var writes = 0; // max writes = 500

                // find all the rows in the table containing resrvation information (slots)
                $("table > tbody > tr").each((index, tr) => {
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
                    const sessionType = $(tds[1]).text();
                    const location = $(tds[2]).text()

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

                    // admin.firestore().collection("table").doc(slot.slotId).set(slot)
                    //     .then((result) => {
                    //         console.log("firestore write success");
                    //     })
                    //     .catch((error) => {
                    //         console.log("error adding writing to firestore");
                    //     });
                    writes++;
                });

                // push changes to firestore (locks database until changes are complete)
                console.log("commiting batch");
                return batch.commit();
            }).catch((error) => console.log("error", error));
    });
