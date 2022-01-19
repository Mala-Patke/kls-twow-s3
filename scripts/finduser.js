const { getUsers } = require('../database/dbwrapper');
const { PBKDF2 } = require('crypto-js');
require('dotenv').config();

getUsers().then(users => {
    console.log(users[PBKDF2(process.argv.slice(2).join(" "), process.env.SALT, { keySize:2 }).toString()]);
    process.exit();
});