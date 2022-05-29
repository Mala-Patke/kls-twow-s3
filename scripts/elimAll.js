const { getUsers } = require('../database/dbwrapper');
const User = require('../lib/user');

async function main() {
    let users = await getUsers();
    for(let [id, { username, isOut, isBanned }] of Object.entries(users)) {
        let u = new User(id, username, isOut, isBanned);
        u.set({
            isOut: true
        });
    }
}

main();