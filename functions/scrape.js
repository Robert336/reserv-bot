// const cors = require("cors")({ origin: true });
//const axios = require('axios');
const cheerio = require("cheerio");
// const getUrls = require("get-urls");
const fetch = require("node-fetch");


// local page for testing purposes

/*
******************** CREATE TESTING PAGE
*/
let http = require('http');
let fs = require('fs');

let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./test-target-tables.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
};

http.createServer(handleRequest).listen(8000);
//****************************************

//const url = "https://www.laurierathletics.com/ecommerce/user/home.php"; // real URL

const url = "http://localhost:8000/ecommerce/user/reservationwaiver.php"; // local test URL

scrapeTable(url); // test


/* 
    Function to scrape data from reservation table
    Parameters: wlu_url - URL to the WLU Athlectics Centre reservation site
    Returns: trs - list of rows representing the table
*/
async function scrapeTable(wlu_url) {
    const response = await fetch(wlu_url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const trs = [];

    //console.log($("table").text());
    $("table > tbody > tr").each((index, tr) => {

        const tds = $(tr).find("td");

        const slotId = $(tds[0]).text();
        const sessionType = $(tds[1]).text();
        const location = $(tds[2]).text();
        const date = $(tds[3]).text();
        const time = $(tds[4]).text();
        const duration = $(tds[5]).text();
        const capacity = $(tds[6]).text();
        // find the elements of the row

        const tableRow = { slotId, sessionType, location, date, time, duration, capacity };
        trs.push(tableRow);

    });

    console.log(trs);

}