const db = require('../database/dbwrapper');

const ref = process.argv[2];
const refargs = process.argv.slice(3).join(" ");

const swich = {
    'users': async () => {
        db.getUsers().then(users => {
            console.log(`We have ${Object.keys(users).length} registered users.`);
            process.exit();
        });
    },
    'responses': async () => {
        db.getResponses(refargs).then(users => {
            console.log(`We have ${Object.keys(users).length} registered responses for round ${refargs}.`);
            process.exit();
        });
    },
    'votes': async () => {
        db.getVotes(refargs).then(votes => {
            console.log(`We have ${Object.keys(votes).length} registered for round ${refargs}.`);
            process.exit();
        });
    }
};

swich[ref]();