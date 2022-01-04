const { getUserDataByUsername } = require('./dbwrapper');
const db = require('./dbwrapper');

(async () => {
    //let resps = await db.getResponses('Round 1');
    //console.log(resps);
})();
/*
db.registerNewUser("Test User 1", "testUID1");
db.registerNewUser("Test User 2", "testUID2");*/

db.getUserDataByID("634d3e5c4a14d714").then(console.log)