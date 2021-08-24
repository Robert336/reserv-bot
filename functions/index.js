// note: sraper should run every night at some time around 23:00 - 23:59


const functions = require("firebase-functions");
const admin = require("firebase-admin"); // firestore
admin.initializeApp();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


// "min hour day-of-the-month month day-of-the-week" (* * * * *) unix cron format
// exports.scheduledFunctionCrontab = functions.pubsub.schedule('30 23 * * *')
//     .timeZone('America/Toronto') // Users can choose timezone - default is America/Los_Angeles
//     .onRun((context) => {
//         console.log('This will be run every day at 11:30 PM Eastern!');
//         return null;
//     });