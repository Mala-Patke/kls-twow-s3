const { getVotes, getUsers, getResponses } = require('../database/dbwrapper');

if(!process.argv.slice(2).length) return console.log("Specify a round");

getVotes(process.argv.slice(2).join(" ")).then(votes => {
    getUsers().then(users => {
        getResponses(process.argv.slice(2).join(" ")).then(responses => {
            console.log(require('../lib/calculate')(votes, users, responses));
            process.exit();
        })
    });
});