const { ref:_ref, set, onValue } = require('firebase/database');
const { PBKDF2 } = require('crypto-js');
const db = require('../database/firebase-init');
require('dotenv').config();

class UserEnum {
    /** @type {string} */
    username;
    /** @type {boolean} */
    isOut;
}

class User {
    constructor(id){
        this.id = id;
    }

    /**
     * @private 
     */
    get ref() {
        return _ref(db, 'userdata/' + this.id);
    }

    /**
     * @returns {Promise<UserEnum>}
     */
    get data(){
        return new Promise((res, rej) => {
            onValue(this.ref, data => {
                if(data.val() === null || !data.val()) return res(false);
                res(Object.defineProperty(data.val(), "id", {
                    value: this.id,
                    enumerable: true
                }));
            }, rej, { onlyOnce: true });
        });
    }

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
                ).then(res).catch(rej);
            }).catch(rej);
        });
    }

    /**
     * @param {string} username 
     * @returns {User}
     */
    static async registerUser(username){
        let id = PBKDF2(username, process.env.SALT, { keySize: 2 }).toString();
        let user = new this(id);
        let exists = await user.data;

        if(!exists) {
            await user.set("isOut", false);
            await user.set("username", username);
        }
        return user;
    }
}

module.exports = User;