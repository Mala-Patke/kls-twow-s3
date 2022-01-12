const { getVotes } = require('../database/dbwrapper');
getVotes(process.argv.slice(2)).then(votes => {
    console.log(require('../structures/calculate')(votes));
    process.exit();
});