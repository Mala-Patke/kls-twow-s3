const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL
});

client.connect().catch(console.error);
client.on('error', e => {
    if(e.name === "SocketClosedUnexpectedlyError") client.connect().catch(console.error);
});

module.exports = client;