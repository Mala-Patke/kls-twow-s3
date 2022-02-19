const { PBKDF2 } = require('crypto-js');
require('dotenv').config();
console.log(PBKDF2(process.argv.slice(2).join(" "), process.env.SALT, { keySize: 2 }).toString());