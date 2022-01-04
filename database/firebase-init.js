const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
require('dotenv').config();

const app = initializeApp({
    apiKey: process.env.fb_apiKey,
    authDomain: `${process.env.fb_projectID}.firebaseapp.com`,
    projectId: process.env.fb_projectID,
    storageBucket: `${process.env.fb_projectID}.appspot.com`,
    messagingSenderId: process.env.fb_messageSenderID,
    appId: process.env.fb_appID,
    databaseURL: `${process.env.fb_projectID}-default-rtdb.firebaseio.com`
});

module.exports = getDatabase(app);