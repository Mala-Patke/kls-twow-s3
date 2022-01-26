const db = require('../database/dbwrapper');
const { PBKDF2 } = require('crypto-js'); 
require('dotenv').config();

const command = process.argv[2];
const dbref = process.argv[3]
const args = process.argv.slice(4).join(" ").trim();

//  0    1       2      3     4
//node query <command> <db> (user)

const commands = {
    'count': (data) => {
        console.log(Object.keys(data).length);
    },
    'has': (data) => {
        console.log(
            Object.keys(data).includes(PBKDF2(args, process.env.SALT, { keySize: 2 }).toString())
        );
    }
}

const dbrefs = {
    'users': new Promise((res, rej) => 
        db.getUsers()
            .then(res)
            .catch(rej)
    ),
    'responses': new Promise((res, rej) => 
        db.getConfig().then(({ round }) => {
            db.getResponses(round)
                .then(res)
                .catch(rej);
        })
    ),
    'votes': new Promise((res, rej) => 
        db.getConfig().then(({ round }) => {
            db.getVotes(round)
                .then(res)
                .catch(rej);
        })
    )
};

//console.log(command, dbref, args)
dbrefs[dbref].then(commands[command]).then(() => process.exit());