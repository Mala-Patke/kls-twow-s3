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
    set(obj){
        return new Promise((res, rej) => {
            onValue(this.ref, data => {
                let ret = data.val();
                for(let elem of Object.entries(obj)){
                    Object.defineProperty(ret, elem[0], {
                        value:elem[1],
                        enumerable: true
                    });
                }
                set(this.ref, ret)
                    .then(() => this[key] = value)
                    .then(res)
                    .catch(rej);
            })
        });
    }

    /**
     * @param {string} id 
     * @returns {Promise<User>}
     */
    static build(id){
        return new Promise((res, rej) => {
            onValue(_ref(db, `userdata/${id}`), (data) => {
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
                if(data.val()) this.build(id).then(res)
                
                let seed = Math.floor(Math.random() * 10);
                let user = new this(id, username, false, false, seed);

                user.set({
                    username: user.username,
                    isOut: user.isOut,
                    isBanned: user.isBanned,
                    seed: user.seed
                });

                res(user);

            }, rej, { onlyOnce: true });
    
        });
    }
}

module.exports = User;