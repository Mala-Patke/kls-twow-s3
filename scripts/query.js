const db = require('../database/dbwrapper');
const { PBKDF2 } = require('crypto-js'); 
require('dotenv').config();

const command = process.argv[2];
const dbref = process.argv[3]
const args = process.argv.slice(4).join(" ").trim();

//  0    1       2      3     4
//node query <command> <db> (user)

const hash = e => PBKDF2(e, process.env.SALT, { keySize: 2 }).toString();

const commands = {
    'count': (data) => {
        console.log(Object.keys(data).length);
    },
    'has': (data) => {
        console.log(
            Object.keys(data).includes(hash(args))
        );
    },
    'list': (data) => {
        console.log(Object.values(data));
    },
    'list_users': (data) => {
        dbrefs.users.then(users => {
            console.log(
                Object.entries(users)
                    .filter(e => args === "not" ? !data[e[0]] : data[e[0]])
                    .map(e => e[1].username)
                    .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
            );
        });
    },
    'get': (data) => {
        console.log(data[hash(args)]);
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