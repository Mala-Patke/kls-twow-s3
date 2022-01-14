const { ref:_ref, set, onValue } = require('firebase/database');
const { PBKDF2 } = require('crypto-js');
const db = require('../database/firebase-init');
require('dotenv').config();

class User {
    constructor(id, username, isOut, isBanned, seed) {
        this.id = id;
        this.username = username;
        this.isOut = isOut;
        this.isBanned = isBanned;
        this.seed = seed;
    }

    /**
     * @private 
     */
     get ref() {
        return _ref(db, 'userdata/' + this.id);
    }

    /**
     * @param {string} key 
     * @param {string} value 
     * @returns {Promise<void>}
     */
    set(key, value){
        return new Promise((res, rej) => {
            this.data.then(data => {
                let obj = {}
                if(!!data) obj = data;
                set(this.ref, 
                    Object.defineProperty(obj, key, {
                        value,
                        enumerable: true
                    })
                ).then(() => this[key] = value)
                .then(res)
                .catch(rej);
            }).catch(rej);
        });
    }

    /**
     * @param {string} id 
     * @returns {Promise<User>}
     */
    static build(id){
        return new Promise((res, rej) => {
            onValue(_ref(db, `userdata/${id}`), ({ val }) => {
                let data = val();
                res(new this(
                    id, data.username, data.isOut, data.isBanned, data.seed
                ));
            }, rej, { onlyOnce: true });
        });
    }

    /**
     * @param {string} username 
     * @returns {Promise<User>}
     */
    static register(username){
        return new Promise((res, rej) => {
            let id = PBKDF2(username, process.env.SALT, { keySize: 2 }).toString();
            onValue(_ref(db, `userdata/${id}`), data => {
                if(data.val()) res(this.build(id));
                
                let seed = Math.floor(Math.random() * 10);
                let user = new this(id, username, false, false, seed);

                user.set('username', user.username);
                user.set('isOut', user.isOut);
                user.set('isBanned', user.isBanned);
                user.set('seed', user.seed);

                res(user);

            }, rej, { onlyOnce: true });
    
        });
    }
}

module.exports = User;