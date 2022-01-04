const db = require('./firebase-init');
const { ref:_ref, set, onValue } = require('firebase/database');
require('dotenv').config();

function ref(path) {
    return _ref(db, path);
}

module.exports.handleInput = function(round, userID, input){
    set(ref(`${round}/responses/${userID}`), input).catch(console.error);
}

module.exports.handleVote = function(round, user, vote){
    set(ref(`${round}/voting/${user}`), vote);
}

module.exports.handleConfigUpdate = (config) => {
    set(ref(`config`), config);
}

module.exports.getResponses = (round) => {
    return new Promise((res, rej) => {
        onValue(ref(`${round}/responses`), data => {
            res(data.toJSON());
        }, rej, { onlyOnce: true });
    })
}

module.exports.getVotes = function(round){
    return new Promise((res, rej) => {
        onValue(ref(`${round}/voting`), data => {
            res(data.toJSON());
        }, rej, { onlyOnce: true });
    });
}

module.exports.getConfig = function(){
    return new Promise((res, rej) => {
        onValue(ref('config'), data => {
            res(data.toJSON())
        }, rej, { onlyOnce: true })
    })
}