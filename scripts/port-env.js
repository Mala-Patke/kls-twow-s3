const { readFileSync } = require('fs')
const { parse } = require('dotenv');
const { join } = require('path')
const { execSync } = require('child_process');

let env = parse(readFileSync(join(__dirname, '../.env')));
for(let elem of Object.entries(env)){
    try {
        execSync(`heroku config:set ${elem[0]}=${elem[1]}`)
    } catch (e) {
        console.log(e);
    }
}