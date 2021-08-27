// // const cors = require("cors")({ origin: true });
// //const axios = require('axios');
const cheerio = require("cheerio");
// // const getUrls = require("get-urls");
const fetch = require("node-fetch");
const FormData = require("form-data");
const { html } = require("cheerio/lib/api/manipulation");
// const functions = require("firebase-functions");
// const admin = require("firebase-admin"); // firestore
// admin.initializeApp();




testingCookieLogin();


async function testingCookieLogin() {

    console.log("Start TEST");

    const formdata = new FormData();
    formdata.append("UserLogin", "mazz8040@mylaurier.ca");
    formdata.append("Password", "82ex2UW%");
    formdata.append("submit_Login", "Login");

    // const myHeaders = new fetch.Headers();
    // myHeaders.append("Cookie", "BIGipServerathletics_pool_https=978586122.47873.0000; PHPSESSID=smr2n9geg52pu2o5qsbipn5id4");

    const requestOptions = {
        method: "POST",
        /* headers: myHeaders,*/
        body: formdata,
        redirect: "follow",
        credentials: 'include',
    };

    fetch("https://www.laurierathletics.com/ecommerce/user/index.php", requestOptions)
        .then((response) => {

            return response.headers;
        })
        .then((headers) => {
            console.log(headers); // print page title
            const html = accessHome(headers);
            return html;

        });
}

function accessHome(headers) {

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
        credentials: 'include',
    };

    fetch("https://www.laurierathletics.com/ecommerce/user/home.php", requestOptions)
        .then((response) => {

            return response.text();
        })
        .then((html) => {
            console.log(html);
            return html;// print page title
        });
}