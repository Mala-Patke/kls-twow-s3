require('dotenv').config();
const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URL
});

async function main() {
    await client.connect();

    let keys = await client.keys('*');
    for(let key of keys) {
        let val = await client.get(key);
        console.log(key, val);
    }
}

main();
